#!/usr/bin/env python3
import os
import re

# Root directory
root_dir = '/Users/eapple/Desktop/Pak_Plastic_Industry'

# Extensions to process
extensions = ['.html', '.css', '.js']

# Counter
files_modified = 0
total_replacements = 0

def process_file(filepath):
    global files_modified, total_replacements
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count matches before replacement
        matches = len(re.findall(r'Petro\s+chemical', content, re.IGNORECASE))
        
        if matches > 0:
            # Replace "Petro chemical" with "Petrochemical" (case-insensitive)
            # This will handle: "Petro chemical", "petro chemical", "PETRO CHEMICAL", etc.
            new_content = re.sub(r'Petro\s+chemical', lambda m: 'Petrochemical' if m.group()[0].isupper() else 'petrochemical', content, flags=re.IGNORECASE)
            
            # Write back
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            files_modified += 1
            total_replacements += matches
            print(f'✓ {os.path.relpath(filepath, root_dir)}: {matches} replacement(s)')
    
    except Exception as e:
        print(f'✗ Error processing {filepath}: {e}')

# Walk through all files
for dirpath, dirnames, filenames in os.walk(root_dir):
    # Skip hidden directories and common non-source directories
    dirnames[:] = [d for d in dirnames if not d.startswith('.') and d not in ['node_modules', 'vendor']]
    
    for filename in filenames:
        if any(filename.endswith(ext) for ext in extensions):
            filepath = os.path.join(dirpath, filename)
            process_file(filepath)

print(f'\n✅ Complete!')
print(f'Files modified: {files_modified}')
print(f'Total replacements: {total_replacements}')
