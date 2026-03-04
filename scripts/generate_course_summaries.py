#!/usr/bin/env python3
"""Generate AI-enhanced course summaries (overview + requirements + costs) for every program row."""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
from pathlib import Path
from typing import Optional, Dict, Any

from dotenv import load_dotenv
import openai
from tqdm import tqdm

load_dotenv()

# LiteLLM proxy credentials (same flow as other data-enrichment scripts)
LITELLM_VIRTUAL_KEY = os.getenv("LITELLM_VIRTUAL_KEY", "sk-JcCEWQqCiqEiiLoVQuO0-w")
LITELLM_BASEURL = os.getenv("LITELLM_BASEURL", "https://devlitellm.annalect.com")
CLIENT_ID = os.getenv("CLIENT_ID", "default")
USER_ID = os.getenv("USER_ID", "default")

client = openai.OpenAI(api_key=LITELLM_VIRTUAL_KEY, base_url=LITELLM_BASEURL)

SUMMARY_COLUMN = "ai_course_summary"
MODEL_NAME = "anthropic.claude-sonnet-4-5-20250929-v1:0"

SUMMARY_PROMPT = """You are an admissions copywriter. Reformat the supplied DAAD data into a concise, friendly briefing for applicants.
Return VALID JSON with the following structure (keys required, use empty strings/arrays when not available):
{
  "overview": "2 short sentences describing the program focus, teaching style, and target student",
  "modules": ["list 3-5 curriculum highlights or module groups"],
  "requirements": {
    "academic_background": "summarize prior degree / field / experience expectations",
    "language": "summarize language proficiency + exams",
    "documents": ["key required documents"],
    "extra": "deadlines, portfolio, internship, or other noteworthy requirements"
  },
  "costs": {
    "tuition": "tuition situation (exact € amount or \"Free / contact university\")",
    "semester_fee": "semester/social fee info",
    "living_expenses": "monthly living expense guidance",
    "funding": "scholarship or funding notes if available"
  },
  "takeaways": ["2-3 bullet style selling points or tips"]
}
Keep tone informative, student-friendly, and less than ~120 words per field.
"""


def _strip_code_fence(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        return "\n".join(lines).strip()
    return text


def summarize_program(row: Dict[str, Any]) -> str:
    """Call the LLM once per program and return serialized JSON summary."""
    source_chunks = [
        f"Program: {row.get('program_name', '').strip()} | University: {row.get('university', '').strip()} | Degree: {row.get('degree_level', '').strip()}",
        row.get("tab_course_details", ""),
        row.get("tab_overview", ""),
        row.get("description", ""),
        row.get("tab_requirements_registration", ""),
        row.get("requirements", ""),
        row.get("tab_costs_funding", ""),
        row.get("tab_services", ""),
    ]
    source_text = "\n\n".join(chunk for chunk in source_chunks if chunk).strip()

    if not source_text:
        return json.dumps(
            {
                "overview": "",
                "modules": [],
                "requirements": {
                    "academic_background": "",
                    "language": "",
                    "documents": [],
                    "extra": "",
                },
                "costs": {
                    "tuition": "",
                    "semester_fee": "",
                    "living_expenses": "",
                    "funding": "",
                },
                "takeaways": [],
            },
            ensure_ascii=False,
        )

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=0.2,
            max_tokens=900,
            messages=[
                {"role": "system", "content": SUMMARY_PROMPT},
                {"role": "user", "content": source_text},
            ],
            extra_headers={
                "x-client-id": CLIENT_ID,
                "x-user-id": USER_ID,
            },
        )
        content = response.choices[0].message.content
        clean_content = _strip_code_fence(content)
        payload = json.loads(clean_content)
    except Exception as exc:  # noqa: BLE001
        payload = {
            "overview": "",
            "modules": [],
            "requirements": {
                "academic_background": "",
                "language": "",
                "documents": [],
                "extra": f"AI summary failed: {exc}",
            },
            "costs": {
                "tuition": "",
                "semester_fee": "",
                "living_expenses": "",
                "funding": "",
            },
            "takeaways": [],
        }
    return json.dumps(payload, ensure_ascii=False)


def process_csv(
    input_path: str,
    output_path: str,
    start_row: int = 0,
    max_rows: Optional[int] = None,
    append: bool = False,
) -> None:
    input_file = Path(input_path)
    output_file = Path(output_path)

    if not input_file.exists():
        print(f"ERROR: Input file not found: {input_path}")
        sys.exit(1)

    print(f"Reading from: {input_file}")
    print(f"Writing to: {output_file}")

    mode = "a" if append and output_file.exists() else "w"

    with open(input_file, "r", encoding="utf-8") as infile, \
        open(output_file, mode, encoding="utf-8", newline="") as outfile:
        reader = csv.DictReader(infile)
        fieldnames = list(reader.fieldnames or [])
        if SUMMARY_COLUMN not in fieldnames:
            fieldnames.append(SUMMARY_COLUMN)

        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        if not append or outfile.tell() == 0:
            writer.writeheader()

        rows = list(reader)
        total_rows = len(rows) - start_row
        if max_rows is not None:
            total_rows = min(total_rows, max_rows)

        progress = tqdm(enumerate(rows[start_row:], start=start_row), total=total_rows, unit="program")
        processed = 0
        for row_idx, row in progress:
            if max_rows is not None and processed >= max_rows:
                break

            summary_json = summarize_program(row)
            row[SUMMARY_COLUMN] = summary_json
            writer.writerow(row)
            processed += 1
            progress.set_description(f"Summarizing program {row_idx + 1}")

        print(f"\nFinished generating summaries for {processed} rows")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate AI summaries (overview + requirements + costs) for programs CSV")
    parser.add_argument("input", nargs="?", default="data/programs.csv", help="Input CSV path")
    parser.add_argument("output", nargs="?", default="data/programs_with_ai_summary.csv", help="Output CSV path")
    parser.add_argument("start_row", nargs="?", type=int, default=0, help="Zero-based row index to start from")
    parser.add_argument("max_rows", nargs="?", type=int, default=None, help="Optional max number of rows to process")
    parser.add_argument("append", nargs="?", type=lambda x: x.lower() in {"true", "1", "yes"}, default=False, help="Append to existing output file")

    args = parser.parse_args()

    print("AI Course Summary Generator")
    print("=" * 60)
    print(f"Input file:  {args.input}")
    print(f"Output file: {args.output}")
    print(f"Start row:   {args.start_row}")
    if args.max_rows is not None:
        print(f"Max rows:    {args.max_rows}")
    print(f"Append mode: {args.append}")
    print("=" * 60)

    process_csv(args.input, args.output, start_row=args.start_row, max_rows=args.max_rows, append=args.append)


if __name__ == "__main__":
    main()
