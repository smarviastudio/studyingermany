import csv
from pathlib import Path

path = Path('data/programs.csv')

with path.open(encoding='utf-8') as f:
    reader = csv.reader(f)
    total = sum(1 for _ in reader) - 1  # subtract header

print(f'Rows (excluding header): {total}')
