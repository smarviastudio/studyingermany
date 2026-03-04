import csv
from pathlib import Path

backup_path = Path('data/programs_backup.csv')
full_path = Path('data/programs_with_language_requirements_full.csv')

with backup_path.open(encoding='utf-8') as f:
    backup_reader = csv.DictReader(f)
    backup_ids = [row['id'] for row in backup_reader]

with full_path.open(encoding='utf-8') as f:
    full_reader = csv.DictReader(f)
    full_ids = [row['id'] for row in full_reader]

backup_set = set(backup_ids)
full_set = set(full_ids)

missing_in_full = sorted(backup_set - full_set)
print(f'Backup rows: {len(backup_ids)}')
print(f'Full rows: {len(full_ids)}')
print(f'Unique backup IDs: {len(backup_set)}')
print(f'Unique full IDs: {len(full_set)}')
print(f'Missing in full: {len(missing_in_full)}')

if missing_in_full:
    print('First few missing IDs:', missing_in_full[:20])
