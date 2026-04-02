#!/usr/bin/env python3
"""Scan program CSV for stale or obviously wrong application deadlines."""

import csv
import sys
from datetime import datetime
from pathlib import Path
from typing import Iterable, Tuple

DEFAULT_PATH = Path('data/programs.csv')
DATE_COLUMNS = (
    'application_deadline',
    'registration_deadline_date',
)
CURRENT_YEAR = datetime.utcnow().year


def parse_year(value: str) -> int | None:
    if not value:
        return None
    value = value.strip()
    if not value:
        return None
    # Try ISO-style date first (YYYY-MM-DD)
    try:
        return datetime.fromisoformat(value[:10]).year
    except ValueError:
        pass
    # Fallback: look for any 4-digit year token
    for token in value.replace('/', ' ').replace('-', ' ').split():
        if len(token) == 4 and token.isdigit():
            year = int(token)
            if 1900 < year < 2100:
                return year
    return None


def find_suspicious_deadlines(rows: Iterable[dict]) -> Iterable[Tuple[dict, str, int]]:
    for row in rows:
        for column in DATE_COLUMNS:
            year = parse_year(row.get(column, ''))
            if year is None:
                continue
            if year < CURRENT_YEAR:
                yield row, column, year


def main(path: Path) -> None:
    if not path.exists():
        print(f"ERROR: {path} does not exist", file=sys.stderr)
        sys.exit(1)

    with path.open(encoding='utf-8') as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)

    stale = list(find_suspicious_deadlines(rows))
    total = len(rows)

    print(f"Checked {total} rows from {path}")
    print(f"Found {len(stale)} rows with deadlines before {CURRENT_YEAR}")
    if not stale:
        return

    print('\nExamples:')
    for row, column, year in stale[:20]:
        print(f"- ID {row.get('id')} ({row.get('program_name')}): {column} -> {row.get(column)}")

    output_path = path.with_name(path.stem + '_deadlines_flagged.csv')
    with output_path.open('w', encoding='utf-8', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()) + ['deadline_issue_column', 'deadline_issue_year'])
        writer.writeheader()
        for row, column, year in stale:
            row = row.copy()
            row['deadline_issue_column'] = column
            row['deadline_issue_year'] = year
            writer.writerow(row)
    print(f"Detailed rows written to {output_path}")


if __name__ == '__main__':
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PATH
    main(target)
