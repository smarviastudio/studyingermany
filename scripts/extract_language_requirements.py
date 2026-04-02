#!/usr/bin/env python3
"""
Extract structured language proficiency requirements from CSV using OpenAI API.
Adds new columns: language_proficiency_required, ielts_min_score, toefl_min_score,
other_language_tests, german_min_level, english_min_level, language_notes
"""

import argparse
import csv
import json
import os
import re
import sys
from pathlib import Path
from typing import Optional, Dict, Any
from dotenv import load_dotenv
import openai
from tqdm import tqdm

load_dotenv()

# Initialize LiteLLM client with custom proxy
LITELLM_VIRTUAL_KEY = os.getenv("LITELLM_VIRTUAL_KEY", "sk-JcCEWQqCiqEiiLoVQuO0-w")
LITELLM_BASEURL = os.getenv("LITELLM_BASEURL", "https://devlitellm.annalect.com")
CLIENT_ID = os.getenv("CLIENT_ID", "default")
USER_ID = os.getenv("USER_ID", "default")

client = openai.OpenAI(
    api_key=LITELLM_VIRTUAL_KEY,
    base_url=LITELLM_BASEURL
)

EXPECTED_RESPONSE_KEYS = [
    "language_proficiency_required",
    "ielts_min_score",
    "toefl_min_score",
    "other_language_tests",
    "german_min_level",
    "english_min_level",
    "language_notes",
    "academic_background_requirements",
    "support_services_summary",
    "support_services_list",
    "tuition_exact_eur",
    "tuition_min_eur",
    "tuition_max_eur",
    "tuition_notes",
    "semester_fee_eur",
    "semester_fee_notes",
    "living_expenses_month_eur",
    "living_expenses_notes",
    "min_ects_required",
    "academic_notes",
    "registration_deadline_date",
    "registration_deadline_text",
    "application_channel",
    "application_channel_notes",
    "scholarship_available",
    "scholarship_notes",
    "documents_required"
]

# Define the extraction schema
EXTRACTION_PROMPT = """You are a data extraction specialist. Analyze the provided requirement text and extract structured program information.

Return PLAIN TEXT in the following format (no JSON, no bullet points, no prose):
language_proficiency_required: yes/no
ielts_min_score: <number or blank>
toefl_min_score: <number or blank>
other_language_tests: <use JSON array or semicolon-separated list>
german_min_level: <CEFR level or blank>
english_min_level: <CEFR level or blank>
language_notes: <short text>
academic_background_requirements: <previous degree, major, prerequisite courses>
support_services_summary: <plain English description of support/services provided>
support_services_list: <JSON array or semicolon-separated list of services>
tuition_exact_eur: <number or blank>
tuition_min_eur: <number or blank>
tuition_max_eur: <number or blank>
tuition_notes: <short text>
semester_fee_eur: <number or blank>
semester_fee_notes: <short text>
living_expenses_month_eur: <number or blank>
living_expenses_notes: <short text>
min_ects_required: <number or blank>
academic_notes: <short text>
registration_deadline_date: <YYYY-MM-DD or blank>
registration_deadline_text: <short text>
application_channel: direct-university | uni-assist | centralized-portal | embassy | other | unknown
application_channel_notes: <instructions or URLs>
scholarship_available: yes/no
scholarship_notes: <short text>
documents_required: <JSON array or semicolon-separated list of document names>

Rules:
- language_proficiency_required: true if ANY exam, test, or minimum level is mentioned
- ielts_min_score: extract numeric band (e.g., 6.5), null if not found
- toefl_min_score: extract iBT score (e.g., 90), null if not found
- other_language_tests: capture all other exams (TestDaF, DSH, Duolingo, Cambridge, PTE, Goethe, placement tests, etc.)
- german_min_level & english_min_level: extract highest CEFR level (A1, A2, B1, B2, C1, C2)
- language_notes: capture placement test info, conditional requirements, or special notes
- tuition_exact/min/max: capture tuition fees mentioned (convert to EUR values). If only a range is given, set min/max. If per semester/year is specified, normalize to EUR per academic year when possible and mention basis inside tuition_notes.
- academic_background_requirements: summarize the expected prior degree(s), subject focus, prerequisite coursework, or professional experience explicitly mentioned.
- support_services_summary & list: simplify content from "Services" or support sections (housing help, visa support, mentoring, excursions, social events, etc.) so it is easy to read.
- semester_fee_eur: capture mandatory semester fee / social contribution.
- living_expenses_month_eur: capture monthly cost of living guidance when available.
- min_ects_required: pull explicit statements like "at least 180 ECTS" or "240 ECTS" requirements. Use numeric value if present.
- academic_notes: summarize degree background or GPA/ECTS details.
- registration_deadline_date: prefer ISO 8601 (YYYY-MM-DD). If multiple deadlines, pick earliest upcoming date.
- registration_deadline_text: concise explanation of the deadline(s) in plain English.
- application_channel: identify whether applications are submitted directly to the university, via Uni-Assist, other central portals (e.g., hochschulstart), embassies/consulates, or unknown. Use "unknown" if not stated.
- application_channel_notes: summarize the instructions or URLs for the chosen channel.
- documents_required: include every document applicants must submit; normalize to human-readable names (CV, motivation letter, transcript, reference letters, portfolio, language certificate, APS certificate, passport copy, proof of finances, research proposal, application form, etc.)
- scholarship_available: true if any scholarships/funding/fee waivers/financial aid are mentioned; false otherwise
- scholarship_notes: summarize the funding opportunity (who offers it, coverage, link)

Return ONLY the key/value lines exactly as shown above (one per line). No explanations, no additional text."""

def _normalize_numeric_string(num_str: str) -> str:
    """Normalize a numeric string by removing thousand separators and harmonizing decimals."""
    if not num_str:
        return ""
    num_str = num_str.replace("\u00A0", "").replace(" ", "")
    digits_only = re.sub(r"\D", "", num_str)
    if not digits_only:
        return ""

    if "," in num_str and "." in num_str:
        if num_str.rfind(",") > num_str.rfind("."):
            decimal_sep, thousand_sep = ",", "."
        else:
            decimal_sep, thousand_sep = ".", ","
        num_str = num_str.replace(thousand_sep, "")
        num_str = num_str.replace(decimal_sep, ".")
        return num_str

    if "," in num_str:
        last = num_str.rfind(",")
        digits_after = len(num_str) - last - 1
        if digits_after == 3 and len(digits_only) > 3:
            num_str = num_str.replace(",", "")
        else:
            num_str = num_str.replace(",", ".")
        return num_str

    if "." in num_str:
        last = num_str.rfind(".")
        digits_after = len(num_str) - last - 1
        if digits_after == 3 and len(digits_only) > 3:
            num_str = num_str.replace(".", "")
    return num_str


def _extract_number(value: Any) -> Optional[float]:
    """Extract numeric value from mixed inputs, handling thousands separators."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        text = value.strip()
        if not text or text.lower() in {"null", "none", "n/a"}:
            return None
        match = re.search(r"\d[\d.,\s]*", text)
        if match:
            normalized = _normalize_numeric_string(match.group())
            if not normalized:
                return None
            try:
                return float(normalized)
            except ValueError:
                return None
    return None

def _format_ielts(value: Any) -> str:
    num = _extract_number(value)
    if num is None:
        return ""
    # IELTS scores are typically reported to one decimal place
    return f"{num:.1f}"

def _format_toefl(value: Any) -> str:
    num = _extract_number(value)
    if num is None:
        return ""
    return str(int(round(num)))

def _format_currency(value: Any) -> str:
    """Return currency as plain text string to avoid Excel misinterpretation."""
    if not value:
        return ""
    if isinstance(value, (int, float)):
        return str(int(value))
    if isinstance(value, str):
        text = value.strip()
        if not text or text.lower() in {"null", "none", "n/a", "blank"}:
            return ""
        # Extract just the numeric part and return as string
        match = re.search(r"\d[\d.,\s]*", text)
        if match:
            normalized = _normalize_numeric_string(match.group())
            if normalized:
                try:
                    num_val = float(normalized)
                    return str(int(num_val))
                except ValueError:
                    pass
    return ""

def _normalize_doc_list(items: Any) -> list[str]:
    if not items:
        return []
    normalized = []
    if isinstance(items, str):
        try:
            parsed = json.loads(items)
            if isinstance(parsed, list):
                items = parsed
        except json.JSONDecodeError:
            items = re.split(r'[;,\n]+', items)
    for item in items:
        if not item:
            continue
        text = str(item).strip().strip('-•')
        if text:
            normalized.append(text)
    return normalized

def _parse_kv_response(text: str) -> Dict[str, str]:
    data = {key: "" for key in EXPECTED_RESPONSE_KEYS}
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or ":" not in line:
            continue
        key_part, value_part = line.split(":", 1)
        key_norm = key_part.strip().lower().replace("-", "_").replace(" ", "_")
        if key_norm in data:
            data[key_norm] = value_part.strip()
    return data

def _ensure_list(value: Any) -> list[Any]:
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return parsed
        except json.JSONDecodeError:
            pass
    return []

def _build_structured_payload(data: Dict[str, Any], documents: list[str], other_tests: list[Any], errors: list[str] | None = None) -> Dict[str, Any]:
    return {
        "language": {
            "proficiency_required": bool(data.get("language_proficiency_required", False)),
            "german_min_level": data.get("german_min_level", ""),
            "english_min_level": data.get("english_min_level", ""),
            "notes": data.get("language_notes", "")
        },
        "language_tests": {
            "ielts_min_score": data.get("ielts_min_score", ""),
            "toefl_min_score": data.get("toefl_min_score", ""),
            "other": other_tests
        },
        "documents_required": documents,
        "costs": {
            "tuition_exact_eur": data.get("tuition_exact_eur", ""),
            "tuition_min_eur": data.get("tuition_min_eur", ""),
            "tuition_max_eur": data.get("tuition_max_eur", ""),
            "tuition_notes": data.get("tuition_notes", ""),
            "semester_fee_eur": data.get("semester_fee_eur", ""),
            "semester_fee_notes": data.get("semester_fee_notes", ""),
            "living_expenses_month_eur": data.get("living_expenses_month_eur", ""),
            "living_expenses_notes": data.get("living_expenses_notes", "")
        },
        "scholarship": {
            "available": bool(data.get("scholarship_available", False)),
            "notes": data.get("scholarship_notes", "")
        },
        "errors": errors or []
    }

def extract_language_requirements(requirement_text: str, language_requirements: str = "", doc_text: str = "", cost_text: str = "", services_text: str = "", rows_processed: int = 0) -> Dict[str, Any]:
    """
    Use OpenAI to extract structured language proficiency data from requirement text.
    """
    if not requirement_text and not language_requirements and not doc_text and not cost_text:
            return {
            "language_proficiency_required": False,
            "ielts_min_score": "",
            "toefl_min_score": "",
            "other_language_tests": json.dumps([], ensure_ascii=False),
            "german_min_level": "",
            "english_min_level": "",
            "language_notes": "",
            "academic_background_requirements": "",
            "support_services_summary": "",
            "support_services_list": json.dumps([], ensure_ascii=False),
            "tuition_exact_eur": "",
            "tuition_min_eur": "",
            "tuition_max_eur": "",
            "tuition_notes": "",
            "semester_fee_eur": "",
            "semester_fee_notes": "",
            "living_expenses_month_eur": "",
            "living_expenses_notes": "",
            "min_ects_required": "",
            "academic_notes": "",
            "registration_deadline_date": "",
            "registration_deadline_text": "",
            "application_channel": "unknown",
            "application_channel_notes": "",
            "scholarship_available": False,
            "scholarship_notes": "",
            "documents_required_list": json.dumps([], ensure_ascii=False)
        }
    
    combined_text = "\n\n".join(filter(None, [language_requirements, requirement_text, doc_text, cost_text, services_text])).strip()
    
    try:
        response = client.chat.completions.create(
            model="anthropic.claude-sonnet-4-5-20250929-v1:0",
            messages=[
                {"role": "system", "content": EXTRACTION_PROMPT},
                {"role": "user", "content": f"Extract language requirements from:\n\n{combined_text}"}
            ],
            temperature=0,
            max_tokens=800,
            extra_headers={
                "x-client-id": CLIENT_ID,
                "x-user-id": USER_ID
            }
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Strip markdown code blocks if present
        if result_text.startswith("```"):
            # Remove ```json or ``` at start and ``` at end
            lines = result_text.split('\n')
            if lines[0].startswith("```"):
                lines = lines[1:]  # Remove first line
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]  # Remove last line
            result_text = '\n'.join(lines).strip()
        
        parsed = _parse_kv_response(result_text)

        # Validate and normalize
        formatted = {
            "language_proficiency_required": parsed.get("language_proficiency_required", "").strip().lower() in {"yes", "true", "1"},
            "ielts_min_score": _format_ielts(parsed.get("ielts_min_score")),
            "toefl_min_score": _format_toefl(parsed.get("toefl_min_score")),
            "german_min_level": parsed.get("german_min_level", ""),
            "english_min_level": parsed.get("english_min_level", ""),
            "language_notes": parsed.get("language_notes", ""),
            "academic_background_requirements": parsed.get("academic_background_requirements", ""),
            "support_services_summary": parsed.get("support_services_summary", ""),
            "support_services_list_raw": parsed.get("support_services_list", ""),
            "tuition_exact_eur": _format_currency(parsed.get("tuition_exact_eur")),
            "tuition_min_eur": _format_currency(parsed.get("tuition_min_eur")),
            "tuition_max_eur": _format_currency(parsed.get("tuition_max_eur")),
            "tuition_notes": parsed.get("tuition_notes", ""),
            "semester_fee_eur": _format_currency(parsed.get("semester_fee_eur")),
            "semester_fee_notes": parsed.get("semester_fee_notes", ""),
            "living_expenses_month_eur": _format_currency(parsed.get("living_expenses_month_eur")),
            "living_expenses_notes": parsed.get("living_expenses_notes", ""),
            "min_ects_required": parsed.get("min_ects_required", ""),
            "academic_notes": parsed.get("academic_notes", ""),
            "registration_deadline_date": parsed.get("registration_deadline_date", ""),
            "registration_deadline_text": parsed.get("registration_deadline_text", ""),
            "application_channel": (parsed.get("application_channel") or "unknown").lower(),
            "application_channel_notes": parsed.get("application_channel_notes", ""),
            "scholarship_available": parsed.get("scholarship_available", "").strip().lower() in {"yes", "true", "1"},
            "scholarship_notes": parsed.get("scholarship_notes", "")
        }
        documents = _normalize_doc_list(parsed.get("documents_required", []))
        other_tests = _ensure_list(parsed.get("other_language_tests", []))
        support_services = _normalize_doc_list(formatted.get("support_services_list_raw", []))
        return {
            "language_proficiency_required": formatted["language_proficiency_required"],
            "ielts_min_score": formatted["ielts_min_score"],
            "toefl_min_score": formatted["toefl_min_score"],
            "other_language_tests": json.dumps(other_tests, ensure_ascii=False),
            "german_min_level": formatted["german_min_level"],
            "english_min_level": formatted["english_min_level"],
            "language_notes": formatted["language_notes"],
            "academic_background_requirements": formatted["academic_background_requirements"],
            "support_services_summary": formatted["support_services_summary"],
            "support_services_list": json.dumps(support_services, ensure_ascii=False),
            "tuition_exact_eur": formatted["tuition_exact_eur"],
            "tuition_min_eur": formatted["tuition_min_eur"],
            "tuition_max_eur": formatted["tuition_max_eur"],
            "tuition_notes": formatted["tuition_notes"],
            "semester_fee_eur": formatted["semester_fee_eur"],
            "semester_fee_notes": formatted["semester_fee_notes"],
            "living_expenses_month_eur": formatted["living_expenses_month_eur"],
            "living_expenses_notes": formatted["living_expenses_notes"],
            "min_ects_required": formatted["min_ects_required"],
            "academic_notes": formatted["academic_notes"],
            "registration_deadline_date": formatted["registration_deadline_date"],
            "registration_deadline_text": formatted["registration_deadline_text"],
            "application_channel": formatted["application_channel"],
            "application_channel_notes": formatted["application_channel_notes"],
            "scholarship_available": formatted["scholarship_available"],
            "scholarship_notes": formatted["scholarship_notes"],
            "documents_required_list": json.dumps(documents, ensure_ascii=False)
        }
    
    except Exception as e:
        print(f"Parsing error: {e}")
        return {
            "language_proficiency_required": False,
            "ielts_min_score": "",
            "toefl_min_score": "",
            "other_language_tests": json.dumps([], ensure_ascii=False),
            "german_min_level": "",
            "english_min_level": "",
            "language_notes": f"Extraction failed: {str(e)}",
            "academic_background_requirements": f"Extraction failed: {str(e)}",
            "support_services_summary": f"Extraction failed: {str(e)}",
            "support_services_list": json.dumps([], ensure_ascii=False),
            "tuition_exact_eur": "",
            "tuition_min_eur": "",
            "tuition_max_eur": "",
            "tuition_notes": f"Extraction failed: {str(e)}",
            "semester_fee_eur": "",
            "semester_fee_notes": f"Extraction failed: {str(e)}",
            "living_expenses_month_eur": "",
            "living_expenses_notes": f"Extraction failed: {str(e)}",
            "min_ects_required": "",
            "academic_notes": f"Extraction failed: {str(e)}",
            "registration_deadline_date": "",
            "registration_deadline_text": f"Extraction failed: {str(e)}",
            "application_channel": "unknown",
            "application_channel_notes": f"Extraction failed: {str(e)}",
            "scholarship_available": False,
            "scholarship_notes": f"Extraction failed: {str(e)}",
            "documents_required_list": json.dumps([], ensure_ascii=False)
        }
    except Exception as e:
        print(f"API error: {e}")
        return {
            "language_proficiency_required": False,
            "ielts_min_score": "",
            "toefl_min_score": "",
            "other_language_tests": json.dumps([], ensure_ascii=False),
            "german_min_level": "",
            "english_min_level": "",
            "language_notes": f"API error: {str(e)}",
            "academic_background_requirements": f"API error: {str(e)}",
            "support_services_summary": f"API error: {str(e)}",
            "support_services_list": json.dumps([], ensure_ascii=False),
            "tuition_exact_eur": "",
            "tuition_min_eur": "",
            "tuition_max_eur": "",
            "tuition_notes": f"API error: {str(e)}",
            "semester_fee_eur": "",
            "semester_fee_notes": f"API error: {str(e)}",
            "living_expenses_month_eur": "",
            "living_expenses_notes": f"API error: {str(e)}",
            "min_ects_required": "",
            "academic_notes": f"API error: {str(e)}",
            "registration_deadline_date": "",
            "registration_deadline_text": f"API error: {str(e)}",
            "application_channel": "unknown",
            "application_channel_notes": f"API error: {str(e)}",
            "scholarship_available": False,
            "scholarship_notes": f"API error: {str(e)}",
            "documents_required_list": json.dumps([], ensure_ascii=False)
        }

def process_csv(
    input_path: str,
    output_path: str,
    max_rows: Optional[int] = None,
    start_row: int = 0,
    append: bool = False
):
    """
    Read CSV, extract language requirements, and write to new CSV with additional columns.
    """
    input_file = Path(input_path)
    output_file = Path(output_path)
    
    if not input_file.exists():
        print(f"ERROR: Input file not found: {input_path}")
        sys.exit(1)
    
    print(f"Reading from: {input_path}")
    print(f"Writing to: {output_path}")
    if start_row:
        print(f"Starting at row index: {start_row}")
    if max_rows:
        print(f"Processing up to {max_rows} rows")
    print(f"Append mode: {'ON' if append else 'OFF'}")
    
    new_columns = [
        "language_proficiency_required",
        "ielts_min_score",
        "toefl_min_score",
        "other_language_tests",
        "german_min_level",
        "english_min_level",
        "language_notes",
        "academic_background_requirements",
        "support_services_summary",
        "support_services_list",
        "tuition_exact_eur",
        "tuition_min_eur",
        "tuition_max_eur",
        "tuition_notes",
        "semester_fee_eur",
        "semester_fee_notes",
        "living_expenses_month_eur",
        "living_expenses_notes",
        "min_ects_required",
        "academic_notes",
        "registration_deadline_date",
        "registration_deadline_text",
        "application_channel",
        "application_channel_notes",
        "scholarship_available",
        "scholarship_notes",
        "documents_required_list"
    ]
    
    rows_processed = 0
    
    try:
        mode = 'a' if append and output_file.exists() else 'w'
        with open(input_file, 'r', encoding='utf-8') as infile, \
             open(output_file, mode, encoding='utf-8', newline='') as outfile:
            
            reader = csv.DictReader(infile)

            # Determine total rows for progress bar
            total_rows_in_file = sum(1 for _ in reader)
            infile.seek(0)
            reader = csv.DictReader(infile)
            remaining_rows = max(0, total_rows_in_file - start_row)
            total_rows = min(remaining_rows, max_rows) if max_rows else remaining_rows
            
            # Add new columns to fieldnames
            fieldnames = reader.fieldnames + new_columns
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            if not append or outfile.tell() == 0:
                writer.writeheader()

            row_iter = enumerate(reader)
            row_iter = tqdm(row_iter, total=total_rows_in_file, desc="Scanning programs", unit="program")
            
            for row_num, row in row_iter:
                if row_num < start_row:
                    continue
                if max_rows and rows_processed >= max_rows:
                    break
                
                requirement_text = row.get('requirements', '') or row.get('tab_requirements_registration', '')
                language_requirements = row.get('language_requirements', '')
                doc_text = "\n".join(
                    filter(
                        None,
                        [
                            row.get('documents_required', ''),
                            row.get('language_certificates', ''),
                            row.get('tab_requirements_registration', ''),
                            row.get('requirements', '')
                        ]
                    )
                )
                cost_text = "\n".join(
                    filter(
                        None,
                        [
                            row.get('tab_costs_funding', ''),
                            row.get('tab_overview', ''),
                            row.get('tab_course_details', ''),
                            row.get('description', ''),
                        ]
                    )
                )
                services_text = row.get('tab_services', '') or ''
                
                extracted = extract_language_requirements(
                    requirement_text,
                    language_requirements,
                    doc_text,
                    cost_text,
                    services_text,
                    rows_processed=rows_processed
                )
                
                # Add extracted fields to row
                for col in new_columns:
                    row[col] = extracted.get(col, "")
                
                writer.writerow(row)
                rows_processed += 1
        
        print(f"\nSuccessfully processed {rows_processed} rows")
        print(f"Output saved to: {output_path}")
    
    except Exception as e:
        print(f"\nERROR during processing: {e}")
        sys.exit(1)

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Extract program language requirements in batches.")
    parser.add_argument("input", nargs="?", default="data/programs.csv", help="Input CSV path")
    parser.add_argument("output", nargs="?", default="data/programs_with_language_requirements.csv", help="Output CSV path")
    parser.add_argument("max_rows", nargs="?", type=int, default=None, help="Maximum number of rows to process")
    parser.add_argument("start_row", nargs="?", type=int, default=0, help="Zero-based row index to start from")
    parser.add_argument("append", nargs="?", type=lambda x: x.lower() in {"true","1","yes"}, default=False, help="Append to existing output (true/false)")

    args = parser.parse_args()

    print(f"Language Requirement Extractor")
    print(f"=" * 60)
    print(f"Input:  {args.input}")
    print(f"Output: {args.output}")
    if args.max_rows:
        print(f"Max rows: {args.max_rows}")
    print(f"Start row: {args.start_row}")
    print(f"Append: {args.append}")
    print(f"=" * 60)
    
    process_csv(args.input, args.output, args.max_rows, args.start_row, args.append)

if __name__ == "__main__":
    main()
