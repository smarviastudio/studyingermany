"""Extract a slice of rows from a CSV by zero-based index range."""
import csv
from pathlib import Path

INPUT_FILE = Path('data/programs_with_language_requirements.csv')
OUTPUT_FILE = Path('data/programs_with_language_requirements_batch2.csv')
START_INDEX = 500  # inclusive
END_INDEX = 1000   # exclusive


def main():
    rows = []
    with INPUT_FILE.open(encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        for idx, row in enumerate(reader):
            if idx < START_INDEX:
                continue
            if idx >= END_INDEX:
                break
            rows.append(row)
        fieldnames = reader.fieldnames
        print(f"Scanned {idx + 1} rows in {INPUT_FILE}")

    if not rows:
        raise SystemExit('No rows extracted for specified range')

    with OUTPUT_FILE.open('w', newline='', encoding='utf-8') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f'Wrote {len(rows)} rows to {OUTPUT_FILE}')


if __name__ == '__main__':
    main()
