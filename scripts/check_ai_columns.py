import csv
from pathlib import Path

FIELDS = [
    'language_proficiency_required',
    'ielts_min_score',
    'toefl_min_score',
    'german_min_level',
    'english_min_level',
    'language_notes',
    'academic_background_requirements',
    'support_services_summary',
    'support_services_list',
    'tuition_exact_eur',
    'tuition_min_eur',
    'tuition_max_eur',
    'tuition_notes',
    'documents_required_list'
]

def main():
    path = Path('data/programs_with_language_requirements.csv')
    counts = {field: 0 for field in FIELDS}
    total = 0

    with path.open(encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            total += 1
            for field in FIELDS:
                value = row.get(field)
                if value and value.strip():
                    counts[field] += 1
            if total == 500:
                break

    print(f'Rows checked: {total}')
    for field in FIELDS:
        print(f"{field}: {counts[field]} non-empty entries")


if __name__ == '__main__':
    main()
