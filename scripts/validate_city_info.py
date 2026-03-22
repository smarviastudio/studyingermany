#!/usr/bin/env python3
"""
City Information Validation and Correction Script

Checks if AI-generated city descriptions are actually about the correct city.
If content mentions wrong cities or is generic, generates new city-specific content.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
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

# Models to cycle through
MODELS = [
    "gpt-4o",
    "gpt-5-mini",
    "gpt-3.5-turbo",
]

# City-related columns to correct
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
    current_model_idx: int = 0

    def get_model(self) -> str:
        with progress_lock:
            return MODELS[self.current_model_idx % len(MODELS)]

    def switch_model(self):
        with progress_lock:
            self.current_model_idx = (self.current_model_idx + 1) % len(MODELS)
            return MODELS[self.current_model_idx]


class CityValidator:
    """Validates and corrects city information using LLM"""

    VALIDATION_PROMPT = """You are a German city expert. Analyze if the AI-generated city information is actually about the correct city.

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
1. Check if the descriptions are ACTUALLY about {actual_city}
2. If content mentions a DIFFERENT city (e.g., talks about Berlin when city is Hamburg), mark as INCORRECT
3. If content is GENERIC and could apply to ANY German city, mark as INCORRECT
4. If content describes {actual_city} correctly, mark as CORRECT

Return VALID JSON:
{{
  "is_correct": true/false,
  "issues_found": ["list specific issues: wrong city mentioned, generic content, etc."],
  "corrected_city_expats_overview": "2 sentences specifically about {actual_city} for international students",
  "corrected_accommodation_outlook": "Housing info specific to {actual_city} (rent ranges, availability)",
  "corrected_job_market_demand": "Job prospects in {actual_city} for this field",
  "corrected_city_living_costs": "Realistic monthly costs for {actual_city}",
  "corrected_german_daily_life_requirement": "German level needed for daily life in {actual_city}",
  "corrected_english_livability": "English-friendliness of {actual_city} for students",
  "corrected_ai_city_fit_score": "1-5 integer rating for {actual_city}"
}}

RULES:
- Mark INCORRECT if any other city is mentioned by name
- Mark INCORRECT if content is generic (could be any German city)
- Mark CORRECT only if content specifically describes {actual_city}
- ALWAYS provide corrected content, even if marked as correct
- Use actual knowledge about {actual_city}"""

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
        Validate if city info is correct and correct if needed.
        Returns: (row_index, corrections_dict or None if no correction needed)
        """
        actual_city = row.get("city", "").strip()
        if not actual_city:
            return row_idx, None

        # Get current city content
        city_overview = row.get("city_expats_overview", "").strip()
        if not city_overview:
            # Empty content - needs generation
            pass
        else:
            # Use LLM to validate if content is actually about the correct city
            pass

        # Always call LLM to validate and potentially correct
        for attempt in range(3):
            try:
                model = self.stats.get_model()
                response = self.client.chat.completions.create(
                    model=model,
                    temperature=0.2,
                    max_completion_tokens=1200,
                    messages=[
                        {
                            "role": "system",
                            "content": self.VALIDATION_PROMPT.format(
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

                # Check if validation found issues
                is_correct = result.get("is_correct", True)
                issues = result.get("issues_found", [])

                if not is_correct or issues:
                    print(f"Row {row_idx}: Issues found for '{actual_city}': {issues}")
                    
                    # Create corrections dict
                    corrections = {
                        "city_expats_overview": result.get("corrected_city_expats_overview", row.get("city_expats_overview", "")),
                        "accommodation_outlook": result.get("corrected_accommodation_outlook", row.get("accommodation_outlook", "")),
                        "job_market_demand": result.get("corrected_job_market_demand", row.get("job_market_demand", "")),
                        "city_living_costs": result.get("corrected_city_living_costs", row.get("city_living_costs", "")),
                        "german_daily_life_requirement": result.get("corrected_german_daily_life_requirement", row.get("german_daily_life_requirement", "")),
                        "english_livability": result.get("corrected_english_livability", row.get("english_livability", "")),
                        "ai_city_fit_score": str(result.get("corrected_ai_city_fit_score", row.get("ai_city_fit_score", "3"))),
                        "validation_issues": json.dumps(issues),
                    }
                    return row_idx, corrections
                else:
                    # Content is correct
                    return row_idx, None

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


def process_csv_parallel(
    input_path: str,
    output_path: str,
    max_workers: int = 20,
    resume: bool = False,
) -> None:
    """Process CSV with parallel workers"""
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

    # Prepare output file
    mode = "a" if resume and output_file.exists() else "w"
    with open(output_file, mode, encoding="utf-8", newline="") as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        if mode == "w":
            writer.writeheader()

    # Create validator instance
    validator = CityValidator(stats)

    # Process in parallel
    with tqdm(total=total_rows - start_row, unit="row", desc="Validating city info") as pbar:
        # Process rows in smaller batches to manage API limits
        batch_size = 100
        for batch_start in range(start_row, total_rows, batch_size):
            batch_end = min(batch_start + batch_size, total_rows)
            batch_rows = rows[batch_start:batch_end]

            print(f"\nProcessing batch {batch_start}-{batch_end} ({len(batch_rows)} rows)")

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

                        # Write row to output
                        with write_lock:
                            with open(output_file, "a", encoding="utf-8", newline="") as f:
                                w = csv.DictWriter(f, fieldnames=fieldnames)
                                w.writerow(rows[row_idx])

                    except Exception as e:
                        print(f"Error processing row {row_idx}: {e}")
                        with progress_lock:
                            stats.errors += 1

                    with progress_lock:
                        stats.processed += 1
                    pbar.update(1)

            # Small break between batches
            if batch_end < total_rows:
                print(f"Taking 5-second break between batches...")
                time.sleep(5)

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
        default="data/programs_with_ai_validated.csv",
        help="Output CSV path (default: data/programs_with_ai_validated.csv)",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=20,
        help="Number of parallel workers (default: 20)",
    )
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Resume from existing output file",
    )

    args = parser.parse_args()

    print("City Information Validation Script")
    print("=" * 60)
    print(f"Input: {args.input}")
    print(f"Output: {args.output}")
    print(f"Workers: {args.workers}")
    print(f"Models: {', '.join(MODELS)}")
    print("=" * 60)
    print()

    process_csv_parallel(
        input_path=args.input,
        output_path=args.output,
        max_workers=args.workers,
        resume=args.resume,
    )


if __name__ == "__main__":
    main()
