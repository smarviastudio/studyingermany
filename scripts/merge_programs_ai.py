"""Merge AI-enriched program CSV batches into a single consolidated file."""

import csv
from pathlib import Path

BATCH_FILES = [
    Path('data/programs.csv'),  # rows 0-499
    Path('data/programs_with_language_requirements_batch3.csv'),  # rows 1000-1499
    Path('data/programs_with_language_requirements_batch4.csv'),  # rows 1500+
]
OUTPUT_FILE = Path('data/programs_with_language_requirements_full.csv')


def merge_batches():
    if OUTPUT_FILE.exists():
        OUTPUT_FILE.unlink()

    writer = None
    seen_ids = set()
    total_rows = 0

    with OUTPUT_FILE.open('w', newline='', encoding='utf-8') as outfile:
        for batch in BATCH_FILES:
            if not batch.exists():
                print(f"Skipping {batch} (missing)")
                continue

            with batch.open(encoding='utf-8') as infile:
                reader = csv.DictReader(infile)
                if writer is None:
                    writer = csv.DictWriter(outfile, fieldnames=reader.fieldnames)
                    writer.writeheader()

                for row in reader:
                    row_id = row.get('id')
                    if row_id in seen_ids:
                        continue
                    seen_ids.add(row_id)
                    writer.writerow(row)
                    total_rows += 1
            print(f"Merged {batch}")

    print(f"Done. Wrote {total_rows} unique rows to {OUTPUT_FILE}")


if __name__ == '__main__':
    merge_batches()
