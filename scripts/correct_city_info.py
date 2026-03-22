#!/usr/bin/env python3
"""
City Information Correction Script

Validates and corrects city-related AI fields in the programs CSV.
- Checks if AI-generated city info matches the actual program city
- Corrects mismatches using LLM
- Parallel processing for speed
- Auto model switching if processing stalls
- 30-second break every 200 courses
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import Optional, Dict, Any, List, Tuple
from datetime import datetime
from dotenv import load_dotenv
import openai
from tqdm import tqdm

load_dotenv()

# LiteLLM proxy configuration
LITELLM_VIRTUAL_KEY = os.getenv("LITELLM_VIRTUAL_KEY", "sk-JcCEWQqCiqEiiLoVQuO0-w")
LITELLM_BASEURL = os.getenv("LITELLM_BASEURL", "https://devlitellm.annalect.com")
CLIENT_ID = os.getenv("CLIENT_ID", "default")
USER_ID = os.getenv("USER_ID", "default")

# Default settings for 1-hour completion target
DEFAULT_WORKERS = 50  # High concurrency for speed
DEFAULT_BATCH_SIZE = 500  # Larger batches to reduce break overhead
BREAK_DURATION = 30  # seconds
BREAK_AFTER_COURSES = 500  # Less frequent breaks with more workers
STALL_THRESHOLD = 45  # seconds - switch model faster

# Models to cycle through if one stalls
MODELS = [
    "anthropic.claude-sonnet-4-5-20250929-v1:0",
    "openai.gpt-4o-mini",
    "anthropic.claude-3-5-haiku-20241022-v1:0",
]

# City-related columns to validate and correct
CITY_COLUMNS = [
    "city_expats_overview",
    "accommodation_outlook",
    "job_market_demand",
    "city_living_costs",
    "german_daily_life_requirement",
    "english_livability",
    "ai_city_fit_score",
]

# Thread-safe locks
write_lock = threading.Lock()
progress_lock = threading.Lock()


@dataclass
class ProcessingStats:
    """Thread-safe processing statistics"""
    processed: int = 0
    corrected: int = 0
    errors: int = 0
    last_write_time: float = 0.0
    current_model_idx: int = 0
    courses_since_break: int = 0

    def __post_init__(self):
        self.last_write_time = time.time()

    def update_write_time(self):
        with progress_lock:
            self.last_write_time = time.time()

    def get_model(self) -> str:
        with progress_lock:
            return MODELS[self.current_model_idx % len(MODELS)]

    def switch_model(self):
        with progress_lock:
            self.current_model_idx = (self.current_model_idx + 1) % len(MODELS)
            return MODELS[self.current_model_idx]


class CityValidator:
    """Validates and corrects city information using LLM"""

    CORRECTION_PROMPT = """You are a German city expert. Analyze if the provided AI-generated city information matches the ACTUAL city name.

ACTUAL CITY: {actual_city}
PROGRAM: {program_name}
UNIVERSITY: {university}

CURRENT AI-GENERATED CONTENT:
{city_expats_overview}

{accommodation_outlook}

{job_market_demand}

{city_living_costs}

{german_daily_life_requirement}

{english_livability}

CITY FIT SCORE: {ai_city_fit_score}

TASK:
1. Check if the descriptions actually refer to {actual_city} (the actual city where the program is located)
2. If content mentions a DIFFERENT city (e.g., talks about Berlin when the city is Hamburg), flag as INCORRECT
3. If content is GENERIC and could apply to ANY city, flag as INCORRECT - we need {actual_city}-specific info
4. ALWAYS provide corrected descriptions that are SPECIFIC to {actual_city}

Return VALID JSON:
{{
  "is_correct": true/false,
  "issues_found": ["list any incorrect city references or generic content found"],
  "corrected_city_expats_overview": "2 sentences specifically about {actual_city} for international students (safety, culture, expat community)",
  "corrected_accommodation_outlook": "Housing info specific to {actual_city} (typical rent ranges, availability, where to look)",
  "corrected_job_market_demand": "Job prospects in {actual_city} for this field, mentioning local industries if known",
  "corrected_city_living_costs": "Realistic monthly costs for {actual_city} (rent range + total monthly budget)",
  "corrected_german_daily_life_requirement": "German level needed for daily life in {actual_city}",
  "corrected_english_livability": "English-friendliness of {actual_city} for students",
  "corrected_ai_city_fit_score": "1-5 integer rating for {actual_city} as student destination"
}}

RULES:
- Mark as INCORRECT if any other city is mentioned
- Mark as INCORRECT if content is generic (could apply to any German city)
- ALWAYS provide corrected content even if marked as correct
- Use actual knowledge about {actual_city} - no generic statements
- If {actual_city} is small/unknown, still provide specific info based on its size and region"""

    def __init__(self, stats: ProcessingStats):
        self.stats = stats
        self.client = openai.OpenAI(api_key=LITELLM_VIRTUAL_KEY, base_url=LITELLM_BASEURL)

    def _strip_code_fence(self, text: str) -> str:
        """Remove markdown code fences from response"""
        text = text.strip()
        if text.startswith("```"):
            lines = text.splitlines()
            if lines and lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            return "\n".join(lines).strip()
        return text

    def validate_and_correct(self, row: Dict[str, Any], row_idx: int) -> Tuple[int, Optional[Dict[str, str]]]:
        """
        Validate and correct city info for a single row.
        Returns: (row_index, corrections_dict or None if no correction needed)
        """
        actual_city = row.get("city", "").strip()
        if not actual_city:
            return row_idx, None

        # Check if city info is empty or mentions wrong city
        city_overview = row.get("city_expats_overview", "").strip()
        if not city_overview:
            # Empty city info - needs generation
            pass  # Continue to correction
        else:
            # Check if current content mentions a DIFFERENT city
            mentioned_cities = self._extract_city_names(city_overview)
            if mentioned_cities:
                # If any mentioned city doesn't match actual city, it's wrong
                for mentioned_city in mentioned_cities:
                    if mentioned_city.lower() != actual_city.lower() and actual_city.lower() not in mentioned_city.lower():
                        # Wrong city detected - needs correction
                        break
                else:
                    # All mentioned cities match or actual city is mentioned - likely correct
                    return row_idx, None
            else:
                # No specific city mentioned - check if content is generic
                # If it's generic, we should still generate city-specific content
                pass  # Continue to correction

        # Call LLM to validate and correct
        for attempt in range(3):
            try:
                model = self.stats.get_model()
                response = self.client.chat.completions.create(
                    model=model,
                    temperature=0.2,
                    max_tokens=1200,
                    messages=[
                        {
                            "role": "system",
                            "content": self.CORRECTION_PROMPT.format(
                                actual_city=actual_city,
                                program_name=row.get("program_name", "Unknown Program"),
                                university=row.get("university", "Unknown University"),
                                city_expats_overview=row.get("city_expats_overview", "Not provided"),
                                accommodation_outlook=row.get("accommodation_outlook", "Not provided"),
                                job_market_demand=row.get("job_market_demand", "Not provided"),
                                city_living_costs=row.get("city_living_costs", "Not provided"),
                                german_daily_life_requirement=row.get("german_daily_life_requirement", "Not provided"),
                                english_livability=row.get("english_livability", "Not provided"),
                                ai_city_fit_score=row.get("ai_city_fit_score", "Not provided"),
                            ),
                        },
                    ],
                    extra_headers={
                        "x-client-id": CLIENT_ID,
                        "x-user-id": USER_ID,
                    },
                )

                content = response.choices[0].message.content
                clean_content = self._strip_code_fence(content)
                result = json.loads(clean_content)

                # Always apply corrections if we got them
                corrections = {
                    "city_expats_overview": result.get("corrected_city_expats_overview", row.get("city_expats_overview", "")),
                    "accommodation_outlook": result.get("corrected_accommodation_outlook", row.get("accommodation_outlook", "")),
                    "job_market_demand": result.get("corrected_job_market_demand", row.get("job_market_demand", "")),
                    "city_living_costs": result.get("corrected_city_living_costs", row.get("city_living_costs", "")),
                    "german_daily_life_requirement": result.get("corrected_german_daily_life_requirement", row.get("german_daily_life_requirement", "")),
                    "english_livability": result.get("corrected_english_livability", row.get("english_livability", "")),
                    "ai_city_fit_score": str(result.get("corrected_ai_city_fit_score", row.get("ai_city_fit_score", "3"))),
                    "validation_issues": json.dumps(result.get("issues_found", [])),
                }
                
                # Only return corrections if something actually changed
                if (result.get("is_correct", True) == False or 
                    result.get("issues_found") or 
                    not city_overview):  # Empty content was filled
                    return row_idx, corrections

                return row_idx, None  # No correction needed

            except json.JSONDecodeError as e:
                print(f"Row {row_idx}: JSON parse error on attempt {attempt + 1}: {e}")
                if attempt == 2:
                    return row_idx, None
                time.sleep(2 ** attempt)
            except Exception as e:
                print(f"Row {row_idx}: API error on attempt {attempt + 1}: {e}")
                # Switch model on failure
                new_model = self.stats.switch_model()
                print(f"Switched to model: {new_model}")
                if attempt == 2:
                    return row_idx, None
                time.sleep(2 ** attempt)

        return row_idx, None

    def _extract_city_names(self, text: str) -> List[str]:
        """Extract city names that appear in text"""
        # Common German cities to check for
        german_cities = [
            "Berlin", "Munich", "München", "Hamburg", "Frankfurt", "Cologne", "Köln",
            "Düsseldorf", "Dusseldorf", "Stuttgart", "Leipzig", "Dresden", "Heidelberg",
            "Freiburg", "Aachen", "Bremen", "Hannover", "Nuremberg", "Nürnberg",
            "Bonn", "Karlsruhe", "Mannheim", "Wiesbaden", "Göttingen", "Erlangen",
            "Duisburg", "Essen", "Dortmund", "Bochum", "Wuppertal", "Bielefeld",
            "Münster", "Saarbrücken", "Kiel", "Rostock", "Magdeburg", "Potsdam",
            "Jena", "Tübingen", "Ulm", "Regensburg", "Passau", "Würzburg",
            "Erfurt", "Halle", "Kaiserslautern", "Oldenburg", "Osnabrück", "Siegen"
        ]

        found = []
        text_lower = text.lower()
        for city in german_cities:
            if city.lower() in text_lower:
                found.append(city)
        return found


def check_processing_health(stats: ProcessingStats) -> bool:
    """
    Check if processing is healthy (data being written within threshold).
    Returns True if healthy, False if stalled.
    """
    with progress_lock:
        time_since_write = time.time() - stats.last_write_time
        if time_since_write > STALL_THRESHOLD:  # Use constant
            return False
    return True


def monitor_and_switch_models(stats: ProcessingStats, stop_event: threading.Event):
    """Background thread to monitor processing and switch models if stalled"""
    while not stop_event.is_set():
        time.sleep(10)  # Check every 10 seconds
        if not check_processing_health(stats):
            new_model = stats.switch_model()
            print(f"\n[MONITOR] Processing stalled (> {STALL_THRESHOLD}s). Switched to model: {new_model}\n")


def process_csv_parallel(
    input_path: str,
    output_path: str,
    max_workers: int = DEFAULT_WORKERS,
    batch_size: int = DEFAULT_BATCH_SIZE,
    resume: bool = False,
) -> None:
    """Process CSV with parallel workers and periodic breaks"""
    input_file = Path(input_path)
    output_file = Path(output_path)

    if not input_file.exists():
        print(f"ERROR: Input file not found: {input_path}")
        sys.exit(1)

    # Read all rows into memory
    print(f"Reading input file: {input_file}")
    with open(input_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        # Add validation_issues column if not exists
        if "validation_issues" not in fieldnames:
            fieldnames.append("validation_issues")
        rows = list(reader)

    total_rows = len(rows)
    print(f"Total rows to process: {total_rows}")

    # Resume logic
    start_row = 0
    if resume and output_file.exists():
        # Count already processed rows in output
        try:
            with open(output_file, "r", encoding="utf-8") as f:
                out_reader = csv.DictReader(f)
                processed_in_output = sum(1 for _ in out_reader)
                start_row = processed_in_output
                print(f"Resuming from row {start_row} ({processed_in_output} already processed)")
        except Exception:
            print("Could not resume, starting from beginning")

    # Initialize stats
    stats = ProcessingStats()

    # Start monitoring thread
    stop_event = threading.Event()
    monitor_thread = threading.Thread(target=monitor_and_switch_models, args=(stats, stop_event))
    monitor_thread.daemon = True
    monitor_thread.start()

    # Prepare output file
    mode = "a" if resume and output_file.exists() else "w"
    with open(output_file, mode, encoding="utf-8", newline="") as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        if mode == "w":
            writer.writeheader()

    # Create validator instance
    validator = CityValidator(stats)

    # Process in batches with breaks
    with tqdm(total=total_rows - start_row, unit="row", desc="Validating city info") as pbar:
        for batch_start in range(start_row, total_rows, batch_size):
            batch_end = min(batch_start + batch_size, total_rows)
            batch_rows = rows[batch_start:batch_end]

            print(f"\n{'='*60}")
            print(f"Processing batch {batch_start}-{batch_end} ({len(batch_rows)} rows)")
            print(f"Workers: {max_workers} | Model: {stats.get_model()}")
            print(f"Progress: {stats.processed} processed, {stats.corrected} corrected, {stats.errors} errors")
            print(f"{'='*60}")

            # Process batch in parallel
            with ThreadPoolExecutor(max_workers=max_workers) as executor:
                future_to_idx = {
                    executor.submit(validator.validate_and_correct, row, batch_start + i): batch_start + i
                    for i, row in enumerate(batch_rows)
                }

                for future in as_completed(future_to_idx):
                    row_idx = future_to_idx[future]
                    try:
                        _, corrections = future.result()

                        # Update row with corrections if needed
                        if corrections:
                            for col, val in corrections.items():
                                if col != "validation_issues":
                                    rows[row_idx][col] = val
                            rows[row_idx]["validation_issues"] = corrections.get("validation_issues", "[]")
                            with progress_lock:
                                stats.corrected += 1

                        # Write corrected row to output
                        with write_lock:
                            with open(output_file, "a", encoding="utf-8", newline="") as f:
                                w = csv.DictWriter(f, fieldnames=fieldnames)
                                w.writerow(rows[row_idx])
                            stats.update_write_time()

                        with progress_lock:
                            stats.processed += 1
                            stats.courses_since_break += 1

                    except Exception as e:
                        print(f"Error processing row {row_idx}: {e}")
                        with progress_lock:
                            stats.errors += 1

                    pbar.update(1)

            # Check if we need a break
            if stats.courses_since_break >= BREAK_AFTER_COURSES:
                print(f"\n{'='*60}")
                print(f"✅ BATCH COMPLETE: {stats.courses_since_break} courses processed")
                print(f"📊 Progress: {stats.processed} total processed, {stats.corrected} corrected, {stats.errors} errors")
                print(f"⏸️  Taking {BREAK_DURATION}s break to prevent API rate limits...")
                print(f"🤖 Current model: {stats.get_model()}")
                print(f"{'='*60}\n")
                time.sleep(BREAK_DURATION)
                with progress_lock:
                    stats.courses_since_break = 0

    # Stop monitoring thread
    stop_event.set()
    monitor_thread.join(timeout=5)

    # Final summary
    print(f"\n{'='*60}")
    print("🎉 PROCESSING COMPLETE!")
    print(f"{'='*60}")
    print(f"📈 Total processed: {stats.processed}")
    print(f"✏️  Corrections made: {stats.corrected}")
    print(f"❌ Errors: {stats.errors}")
    print(f"💾 Output file: {output_file}")
    print(f"⏱️  Estimated time saved: {stats.corrected * 2} minutes of manual corrections")
    print(f"{'='*60}")


def main():
    parser = argparse.ArgumentParser(
        description="Validate and correct city information in programs CSV using AI"
    )
    parser.add_argument(
        "--input",
        default="data/programs_with_ai.csv",
        help="Input CSV path (default: data/programs_with_ai.csv)",
    )
    parser.add_argument(
        "--output",
        default="data/programs_with_ai_corrected.csv",
        help="Output CSV path (default: data/programs_with_ai_corrected.csv)",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=DEFAULT_WORKERS,
        help=f"Number of parallel workers (default: {DEFAULT_WORKERS})",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=DEFAULT_BATCH_SIZE,
        help=f"Batch size before taking a break (default: {DEFAULT_BATCH_SIZE})",
    )
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Resume from existing output file",
    )

    args = parser.parse_args()

    print("City Information Correction Script")
    print("=" * 60)
    print(f"Input: {args.input}")
    print(f"Output: {args.output}")
    print(f"Workers: {args.workers}")
    print(f"Batch size: {args.batch_size}")
    print(f"Break after: {BREAK_AFTER_COURSES} courses")
    print(f"Break duration: {BREAK_DURATION}s")
    print(f"Stall threshold: {STALL_THRESHOLD}s")
    print(f"Models: {', '.join(MODELS)}")
    print("=" * 60)
    print()

    process_csv_parallel(
        input_path=args.input,
        output_path=args.output,
        max_workers=args.workers,
        batch_size=args.batch_size,
        resume=args.resume,
    )


if __name__ == "__main__":
    main()
