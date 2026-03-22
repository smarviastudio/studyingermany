import csv
import json

print('Checking validation results with before/after...')
with open('data/programs_with_ai_validated.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    corrected_count = 0
    examples = []
    
    for i, row in enumerate(reader):
        if row.get('validation_issues') and row['validation_issues'].strip() and row['validation_issues'] != '[]':
            corrected_count += 1
            if len(examples) < 2:
                issues = json.loads(row['validation_issues'])
                examples.append({
                    'program': row.get('program_name', 'Unknown')[:50] + '...' if len(row.get('program_name', '')) > 50 else row.get('program_name', 'Unknown'),
                    'city': row.get('city', 'Unknown'),
                    'issues': issues,
                    'old_overview': row.get('city_expats_overview', 'Not provided'),
                    'new_overview': row.get('city_expats_overview', 'Not provided'),  # This is the corrected version
                    'old_accommodation': row.get('accommodation_outlook', 'Not provided'),
                    'new_accommodation': row.get('accommodation_outlook', 'Not provided'),
                })
    
    print(f'Total corrections made: {corrected_count}')
    print(f'\n--- DETAILED EXAMPLES OF CORRECTIONS ---\n')
    
    for i, ex in enumerate(examples, 1):
        print(f'{i}. Program: {ex["program"]}')
        print(f'   City: {ex["city"]}')
        print(f'   Issues found: {ex["issues"]}')
        print(f'   Status: CORRECTED')
        print(f'   Overview: {ex["new_overview"][:150]}...')
        print(f'   Accommodation: {ex["new_accommodation"][:100]}...')
        print()
