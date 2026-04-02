import csv
from pathlib import Path

RAW_FILE = Path('data/programs_backup.csv')
FULL_FILE = Path('data/programs_with_language_requirements_full.csv')
SEARCH_FILES = sorted(Path('data').glob('programs_with_language_requirements*.csv'))


def load_ids(path: Path) -> set[str]:
    with path.open(encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return {row['id'] for row in reader}


def main():
    raw_ids = load_ids(RAW_FILE)
    full_ids = load_ids(FULL_FILE)
    missing = sorted(raw_ids - full_ids)
    print(f'Missing IDs count: {len(missing)}')
    if not missing:
        return

    missing_set = set(missing)
    for path in SEARCH_FILES:
        if path == FULL_FILE:
            continue
        ids = load_ids(path)
        overlap = sorted(missing_set & ids)
        if overlap:
            print(f'{path.name} contains {len(overlap)} missing IDs (showing up to 10): {overlap[:10]}')
        else:
            print(f'{path.name} contains none of the missing IDs')


if __name__ == '__main__':
    main()
