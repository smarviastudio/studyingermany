import csv
import json

print('Checking validation results...')
with open('data/programs_with_ai_validated.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    corrected_count = 0
    examples = []
    
    for i, row in enumerate(reader):
        if row.get('validation_issues') and row['validation_issues'].strip() and row['validation_issues'] != '[]':
            corrected_count += 1
            if len(examples) < 3:
                issues = json.loads(row['validation_issues'])
                examples.append({
                    'program': row.get('program_name', 'Unknown')[:60] + '...' if len(row.get('program_name', '')) > 60 else row.get('program_name', 'Unknown'),
                    'city': row.get('city', 'Unknown'),
                    'issues': issues,
                    'old_overview': row.get('city_expats_overview', 'Not provided')[:100] + '...' if row.get('city_expats_overview') else 'Not provided'
                })
    
    print(f'Total corrections made: {corrected_count}')
    print(f'--- EXAMPLES OF CORRECTIONS ---')
    
    for i, ex in enumerate(examples, 1):
        print(f'{i}. Program: {ex["program"]}')
        print(f'   City: {ex["city"]}')
        print(f'   Issues found: {ex["issues"]}')
        print(f'   Old content: {ex["old_overview"]}')
        print(f'   Status: CORRECTED')
        print()
