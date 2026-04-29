import os

replacements = {
    'bg-green-500': 'bg-blue-500',
    'bg-green-600': 'bg-blue-600',
    'bg-green-700': 'bg-blue-700',
    'text-green-500': 'text-blue-500',
    'text-green-600': 'text-blue-600',
    'border-green-500': 'border-blue-500',
    'shadow-green-500/20': 'shadow-orange-500/20',
    'shadow-green-500/10': 'shadow-orange-500/10',
    'shadow-green-500/40': 'shadow-orange-500/40',
    'rgba(22, 163, 74, 0.3)': 'rgba(249, 115, 22, 0.3)', # Green to Orange shadow
    'rgba(22, 163, 74, 0.5)': 'rgba(249, 115, 22, 0.5)',
    'rgba(22, 163, 74, 0.1)': 'rgba(249, 115, 22, 0.1)',
}

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

def walk_dir(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.jsx', '.css', '.html')):
                replace_in_file(os.path.join(root, file))

if __name__ == "__main__":
    walk_dir(r'c:\Users\ibrahim\Desktop\bags\frontend\src')
