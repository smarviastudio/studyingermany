# Language Requirements Extraction Script

This script uses OpenAI's API to automatically extract structured language proficiency requirements from your CSV data and add new columns.

## New Columns Added

- **language_proficiency_required** (boolean): Whether any language exam or minimum level is required
- **ielts_min_score** (number): Minimum IELTS band score (e.g., 6.5), or null
- **toefl_min_score** (number): Minimum TOEFL iBT score (e.g., 90), or null
- **other_language_tests** (JSON array): Other exams like TestDaF, DSH, Duolingo, Cambridge, PTE, Goethe, placement tests
- **german_min_level** (string): CEFR level (A1-C2) or null
- **english_min_level** (string): CEFR level (A1-C2) or null
- **language_notes** (text): Free-form context, placement test info, conditional requirements

## Setup

### 1. Install Dependencies
```bash
pip install openai python-dotenv
```

### 2. Set Environment Variable
Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=sk-your-key-here
```

## Usage

### Basic Usage (Process All Rows)
```bash
cd scripts
python extract_language_requirements.py
```

### Process Specific Input/Output Files
```bash
python extract_language_requirements.py data/programs.csv data/programs_extracted.csv
```

### Test with Limited Rows (Recommended First)
```bash
python extract_language_requirements.py data/programs.csv data/programs_test.csv 5
```
This processes only the first 5 rows to verify output quality before running the full dataset.

## Output

The script creates a new CSV file with all original columns plus the 7 new language requirement columns.

### Example Output Row

For a program with requirements:
```
"IELTS 6.5 or TOEFL 90 required. German B2 minimum."
```

Extracted as:
```json
{
  "language_proficiency_required": true,
  "ielts_min_score": 6.5,
  "toefl_min_score": 90,
  "other_language_tests": "[]",
  "german_min_level": "B2",
  "english_min_level": null,
  "language_notes": "IELTS or TOEFL accepted for English proficiency"
}
```

## Notes

- The script uses `gpt-4o-mini` model for cost efficiency
- Temperature is set to 0 for consistent, deterministic extraction
- If extraction fails for a row, default values are used and noted in `language_notes`
- Processing time depends on CSV size and API rate limits (~1-2 seconds per row)
- The original CSV is not modified; output is written to a new file

## Troubleshooting

**"OPENAI_API_KEY not set"**: Ensure `.env.local` exists in the project root with your API key.

**JSON parse errors**: Some requirement text may be malformed. Check the `language_notes` field for error details.

**Rate limiting**: If you hit API rate limits, the script will pause and retry. You can reduce `max_rows` for testing.

## Next Steps

1. Test with 5 rows: `python extract_language_requirements.py data/programs.csv data/programs_test.csv 5`
2. Review output quality in `data/programs_test.csv`
3. Run full extraction: `python extract_language_requirements.py data/programs.csv data/programs_with_language_requirements.csv`
4. Replace original CSV or merge columns back as needed
5. Update `src/lib/types.ts` to include new fields in the `Program` schema
6. Update `src/lib/csv/loadPrograms.ts` to parse and expose the new columns
