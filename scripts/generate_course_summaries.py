#!/usr/bin/env python3
"""Generate AI-enhanced course summaries (overview + requirements + costs) for every program row."""

from __future__ import annotations

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

# LiteLLM proxy credentials (same flow as other data-enrichment scripts)
LITELLM_VIRTUAL_KEY = os.getenv("LITELLM_VIRTUAL_KEY", "sk-JcCEWQqCiqEiiLoVQuO0-w")
LITELLM_BASEURL = os.getenv("LITELLM_BASEURL", "https://devlitellm.annalect.com")
CLIENT_ID = os.getenv("CLIENT_ID", "default")
USER_ID = os.getenv("USER_ID", "default")

client = openai.OpenAI(api_key=LITELLM_VIRTUAL_KEY, base_url=LITELLM_BASEURL)

SUMMARY_COLUMN = "ai_course_summary"
CITY_COLUMN = "city_expats_overview"
ACCOMMODATION_COLUMN = "accommodation_outlook"
JOB_MARKET_COLUMN = "job_market_demand"
LIVING_COST_COLUMN = "city_living_costs"
GERMAN_LIFE_COLUMN = "german_daily_life_requirement"
EXPAT_SCORE_COLUMN = "ai_city_fit_score"
UNIVERSITY_COLUMN = "university_profile"
ENGLISH_LIFE_COLUMN = "english_livability"
MODEL_NAME = "anthropic.claude-sonnet-4-5-20250929-v1:0"

SUMMARY_PROMPT = """You are an admissions copywriter and relocation advisor. Reformat the supplied DAAD data into a concise, friendly briefing for applicants.
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
  "takeaways": ["2-3 bullet style selling points or tips"],
  "city_expats_overview": "2 sentences about the program city for international students (safety, culture, expat community). If city unknown, state that info is limited.",
  "accommodation_outlook": "Explain how easy housing is to find, typical rent range, and suggestions (student dorms, WG, etc.)",
  "job_market_demand": "Describe the job/internship demand for this program field in the region, citing industries or companies when possible",
  "city_living_costs": "Summarize realistic monthly living cost range in that city (rent + expenses) and any budgeting tips",
  "german_daily_life_requirement": "What German proficiency (A1-C2) is realistically needed for daily life/off-campus life in this city? Mention if English-only is ok.",
  "english_livability": "Explain if students can study and live using English only (classes, admin, social life) and where German is still needed.",
  "ai_city_fit_score": "Give an integer 1-5 score (5 = easiest/best experience, 1 = toughest) weighing city friendliness for expats, housing, job prospects, and costs.",
  "university_profile": "2-3 sentences about the university's strengths, specialisations, international reputation, notable rankings, or support for humanities/STEM."
}
Use ONLY info from the supplied data + general knowledge about the city. Keep tone informative, student-friendly, and less than ~120 words per field.
"""


CITY_HINT_FIELDS = [
    "city",
    "tab_overview",
    "tab_course_details",
    "description",
    "tab_services",
    "tab_requirements_registration",
]

COURSE_LOCATION_PATTERNS = [
    re.compile(r"Course location\s*([^\n\r]+)", re.IGNORECASE),
    re.compile(r"Location\s*[:|-]\s*([^\n\r]+)", re.IGNORECASE),
    re.compile(r"City\s*[:|-]\s*([^\n\r]+)", re.IGNORECASE),
]

METRO_CITIES = {
    "berlin", "munich", "münchen", "hamburg", "frankfurt", "frankfurt am main",
    "cologne", "köln", "dusseldorf", "düsseldorf", "stuttgart", "leipzig",
}

STUDENT_CITIES = {
    "heidelberg", "freiburg", "gottingen", "göttingen", "jena", "kiel",
    "erfurt", "aachen", "dresden", "bremen", "hannover", "bonn", "potsdam",
    "ulm", "mannheim", "karlsruhe", "weimar", "trier", "halle", "wittenberg",
}

CITY_INSIGHT_KEYS = [
    "city_expats_overview",
    "accommodation_outlook",
    "job_market_demand",
    "city_living_costs",
    "german_daily_life_requirement",
    "english_livability",
    "ai_city_fit_score",
]


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
    inferred_city = infer_city(row)
    source_chunks = [
        f"Program: {row.get('program_name', '').strip()} | University: {row.get('university', '').strip()} | Degree: {row.get('degree_level', '').strip()} | City: {inferred_city or (row.get('city', '').strip() or 'Unknown')}",
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

    for attempt in range(2):
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
            break
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            source_text = source_text + "\n\nREMINDER: Respond with VALID JSON ONLY."
    else:
        payload = build_failed_payload(row, inferred_city, last_error)
        return json.dumps(payload, ensure_ascii=False)

    enrich_with_city_defaults(payload, row, inferred_city)
    enrich_with_university_defaults(payload, row)
    return json.dumps(payload, ensure_ascii=False)


def infer_city(row: Dict[str, Any]) -> Optional[str]:
    raw_city = (row.get("city") or "").strip()
    if raw_city:
        return raw_city

    for field in CITY_HINT_FIELDS[1:]:
        text = (row.get(field) or "")
        for pattern in COURSE_LOCATION_PATTERNS:
            match = pattern.search(text)
            if match:
                candidate = match.group(1).strip().strip('.')
                if candidate:
                    return candidate

    description = (row.get("detail_url") or "")
    segments = description.split("/")
    if segments:
        maybe_city = segments[-2].replace("-", " ") if len(segments) >= 2 else ""
        if maybe_city and maybe_city.isalpha():
            return maybe_city.title()
    return None


def categorize_city(city: Optional[str]) -> str:
    if not city:
        return "unknown"
    normalized = re.sub(r"[^a-zäöüß ]", "", city.lower()).strip()
    if normalized in METRO_CITIES:
        return "metro"
    if normalized in STUDENT_CITIES:
        return "student"
    if normalized:
        return "regional"
    return "unknown"


def generate_city_profile(row: Dict[str, Any], city: Optional[str]) -> Dict[str, str]:
    city_label = city or (row.get("city") or row.get("university") or "the university city")
    category = categorize_city(city)

    if category == "metro":
        profile = {
            "city_expats_overview": f"{city_label} is a large international hub with diverse expat communities, reliable transit, and plentiful nightlife, making it easy to settle even if you are new to Germany.",
            "accommodation_outlook": "Expect competitive housing with higher rents (€700-900 for shared flats), so secure dorms or WGs early and consider surrounding districts for better prices.",
            "job_market_demand": "Major employers across tech, finance, media, and research recruit in this city, and internships are widely available for German- and English-speaking graduates.",
            "city_living_costs": "Budget €1,200-1,400 per month including rent, transport pass, and food; cooking at home and student discounts keep costs under control.",
            "german_daily_life_requirement": "English works in most services, but A2-B1 German helps with bureaucracy and deeper social life in a big city.",
            "english_livability": "You can study and handle everyday life in English in most metro universities, though German speeds up paperwork and networking.",
            "ai_city_fit_score": "4",
        }
    elif category == "student":
        profile = {
            "city_expats_overview": f"{city_label} is a classic German student town—safe, walkable, and full of international societies, so expats integrate quickly.",
            "accommodation_outlook": "Student dorms and shared flats (WG) typically cost €350-500; apply early but demand is manageable compared to large metros.",
            "job_market_demand": "Local research institutes, Mittelstand companies, and university jobs provide steady part-time work for German-speaking students, plus remote roles are possible.",
            "city_living_costs": "Plan around €850-1,000 per month including rent, food, and insurance; bike culture and short distances keep transport costs low.",
            "german_daily_life_requirement": "Daily life works best with B1 German, though campus staff often support English-speaking students.",
            "english_livability": "University offices offer English support, but outside campus you still need B1 German for shops and appointments.",
            "ai_city_fit_score": "5",
        }
    elif category == "regional":
        profile = {
            "city_expats_overview": f"{city_label} is a smaller regional city with a relaxed pace, friendly locals, and historic charm—ideal if you prefer quieter surroundings.",
            "accommodation_outlook": "Housing is generally available via local dorms or private rooms (€400-600), and you can often arrange accommodation with university support.",
            "job_market_demand": "Expect opportunities in regional industries (manufacturing, education, tourism) plus remote/online roles; German proficiency opens most doors.",
            "city_living_costs": "Monthly budgets around €900-1,050 usually cover rent, groceries, and transport thanks to lower prices outside the big hubs.",
            "german_daily_life_requirement": "Aim for B1 German to handle shops, bureaucracy, and landlord conversations; fewer locals rely on English daily.",
            "english_livability": "English-only living is challenging; basic conversations work, but expect to rely on German for most errands.",
            "ai_city_fit_score": "4",
        }
    else:
        profile = {
            "city_expats_overview": "Limited city info, but German university towns are generally safe with strong public transport and student services.",
            "accommodation_outlook": "Expect to choose between student dorms and WGs (~€400-550). Contact the international office early for housing leads.",
            "job_market_demand": "Check university career services for internships; remote work or national companies in nearby metros are common paths.",
            "city_living_costs": "Most students manage on €900-1,100 per month nationwide, including health insurance and semester ticket.",
            "german_daily_life_requirement": "Plan for at least A2 German; some services help in English but daily errands are easier with local language skills.",
            "english_livability": "English may work on campus, but expect to switch to German for housing, doctors, or banking.",
            "ai_city_fit_score": "3",
        }
    return profile


def build_failed_payload(row: Dict[str, Any], city: Optional[str], error: Exception) -> Dict[str, Any]:
    failure_note = f"AI summary failed: {error}"
    payload = {
        "overview": "",
        "modules": [],
        "requirements": {
            "academic_background": "",
            "language": "",
            "documents": [],
            "extra": failure_note,
        },
        "costs": {
            "tuition": "",
            "semester_fee": "",
            "living_expenses": "",
            "funding": "",
        },
        "takeaways": [],
        "university_profile": generate_university_profile(row),
    }
    payload.update(generate_city_profile(row, city))
    if "english_livability" not in payload:
        payload["english_livability"] = defaults_english_text(row)
    return payload


def enrich_with_city_defaults(payload: Dict[str, Any], row: Dict[str, Any], city: Optional[str]) -> None:
    defaults = generate_city_profile(row, city)
    for key in CITY_INSIGHT_KEYS:
        if not payload.get(key):
            payload[key] = defaults.get(key, "")
    if not payload.get("english_livability"):
        payload["english_livability"] = defaults_english_text(row)


def enrich_with_university_defaults(payload: Dict[str, Any], row: Dict[str, Any]) -> None:
    if not payload.get("university_profile"):
        payload["university_profile"] = generate_university_profile(row)


def defaults_english_text(row: Dict[str, Any]) -> str:
    city = row.get("city") or "the city"
    return f"On campus you can usually handle classes in English, but everyday life in {city} is smoother with A2-B1 German for paperwork and housing."


def generate_university_profile(row: Dict[str, Any]) -> str:
    university = (row.get("university") or "This university").strip()
    program = (row.get("program_name") or "the program").strip()
    subject = (row.get("subject_area") or "multiple disciplines").strip()
    degree = (row.get("degree_level") or row.get("degree_type_raw") or "degree").strip()
    tags = (row.get("tags_array") or "").strip()

    highlights = []
    if subject:
        highlights.append(f"strong focus on {subject}")
    if degree:
        highlights.append(f"offers {degree.replace('_', ' ')} pathways")
    if tags:
        highlights.append(f"notable areas include {tags}")

    highlight_text = ", ".join(highlights) if highlights else "maintains respected teaching and research standards"
    return f"{university} hosts {program} and {highlight_text}. It is known for international support services and collaboration with German industry/academia."


def process_csv(
    input_path: str,
    output_path: str,
    start_row: int = 0,
    max_rows: Optional[int] = None,
    append: bool = False,
    resume: bool = False,
) -> None:
    input_file = Path(input_path)
    output_file = Path(output_path)

    if not input_file.exists():
        print(f"ERROR: Input file not found: {input_path}")
        sys.exit(1)

    resume_mode = resume and output_file.exists()
    processed_rows = 0
    if resume_mode:
        with open(output_file, "r", encoding="utf-8") as existing:
            reader = csv.reader(existing)
            next(reader, None)
            processed_rows = sum(1 for _ in reader)
        print(f"Resume enabled: found {processed_rows} previously processed rows.")
        if processed_rows > 0:
            start_row = max(start_row, processed_rows)

    print(f"Reading from: {input_file}")
    print(f"Writing to: {output_file}")

    mode = "a" if (resume_mode or (append and output_file.exists())) else "w"

    with open(input_file, "r", encoding="utf-8") as infile, \
        open(output_file, mode, encoding="utf-8", newline="") as outfile:
        reader = csv.DictReader(infile)
        fieldnames = list(reader.fieldnames or [])
        for extra_column in [
            SUMMARY_COLUMN,
            CITY_COLUMN,
            ACCOMMODATION_COLUMN,
            JOB_MARKET_COLUMN,
            LIVING_COST_COLUMN,
            GERMAN_LIFE_COLUMN,
            ENGLISH_LIFE_COLUMN,
            EXPAT_SCORE_COLUMN,
            UNIVERSITY_COLUMN,
        ]:
            if extra_column not in fieldnames:
                fieldnames.append(extra_column)

        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        write_header = not (resume_mode or (append and output_file.exists()))
        if write_header:
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
            try:
                parsed = json.loads(summary_json)
            except json.JSONDecodeError:
                parsed = {}

            row[SUMMARY_COLUMN] = summary_json
            row[CITY_COLUMN] = parsed.get("city_expats_overview", "")
            row[ACCOMMODATION_COLUMN] = parsed.get("accommodation_outlook", "")
            row[JOB_MARKET_COLUMN] = parsed.get("job_market_demand", "")
            row[LIVING_COST_COLUMN] = parsed.get("city_living_costs", "")
            row[GERMAN_LIFE_COLUMN] = parsed.get("german_daily_life_requirement", "")
            row[ENGLISH_LIFE_COLUMN] = parsed.get("english_livability", "")
            row[EXPAT_SCORE_COLUMN] = parsed.get("ai_city_fit_score", "")
            row[UNIVERSITY_COLUMN] = parsed.get("university_profile", "")
            writer.writerow(row)
            processed += 1
            progress.set_description(f"Summarizing program {row_idx + 1}")

        print(f"\nFinished generating summaries for {processed} rows")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate AI summaries (overview + requirements + costs) for programs CSV")
    parser.add_argument("input", nargs="?", default="data/programs.csv", help="Input CSV path")
    parser.add_argument("output", nargs="?", default="data/programs_with_ai_summary.csv", help="Output CSV path")
    parser.add_argument("start_row", nargs="?", type=int, default=0, help="Zero-based row index to start from")
    parser.add_argument("max_rows", nargs="?", default=None, help="Optional max number of rows to process (use 'None' for all)")
    parser.add_argument("append", nargs="?", type=lambda x: x.lower() in {"true", "1", "yes"}, default=False, help="Append to existing output file")
    parser.add_argument("resume", nargs="?", type=lambda x: x.lower() in {"true", "1", "yes"}, default=False, help="Resume from existing output progress")

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

    max_rows = args.max_rows
    if isinstance(max_rows, str):
        if max_rows.lower() == "none" or max_rows == "":
            max_rows_value = None
        else:
            max_rows_value = int(max_rows)
    else:
        max_rows_value = max_rows

    process_csv(
        args.input,
        args.output,
        start_row=args.start_row,
        max_rows=max_rows_value,
        append=args.append,
        resume=args.resume,
    )


if __name__ == "__main__":
    main()
