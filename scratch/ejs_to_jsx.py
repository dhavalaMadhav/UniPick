import re
import sys
import os

def ejs_to_jsx(input_path, output_path, component_name):
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove includes
    content = re.sub(r'<%-?\s*include\([^)]+\)\s*%>', '', content)

    # 2. Convert class to className
    content = re.sub(r'\bclass="', 'className="', content)
    content = re.sub(r"\bclass='", "className='", content)

    # 3. Convert for to htmlFor
    content = re.sub(r'\bfor="', 'htmlFor="', content)

    # 4. Convert HTML comments to JSX comments
    content = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', content, flags=re.DOTALL)

    # 5. Convert unclosed tags like <input ...> to <input ... />
    # A simple but imperfect regex for inputs, imgs, br, hr, meta, link
    for tag in ['input', 'img', 'br', 'hr', 'meta', 'link']:
        content = re.sub(r'<(%s\b[^>]*?)(?<!/)>' % tag, r'<\1 />', content, flags=re.IGNORECASE)

    # 6. Convert inline styles (simplistic)
    # This is hard to do perfectly with regex, we'll just leave it and fix manually if Vite complains.
    # Actually, let's try to fix simple styles: style="display: none;" -> style={{ display: 'none' }}
    def style_repl(match):
        style_str = match.group(1)
        rules = style_str.split(';')
        new_rules = []
        for rule in rules:
            if ':' in rule:
                k, v = rule.split(':', 1)
                k = k.strip()
                v = v.strip()
                # camelCase the key
                k = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)
                new_rules.append(f"{k}: '{v}'")
        return "style={{" + ", ".join(new_rules) + "}}"

    content = re.sub(r'style="([^"]*)"', style_repl, content)

    # 7. Wrap in basic component
    jsx_content = f"""import React, {{ useEffect, useState }} from 'react';
import {{ Link }} from 'react-router-dom';

export default function {component_name}() {{
    // TODO: Add state and data fetching logic here

    return (
        <>
            {content}
        </>
    );
}}
"""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(jsx_content)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python ejs_to_jsx.py <input> <output> <ComponentName>")
        sys.exit(1)
    ejs_to_jsx(sys.argv[1], sys.argv[2], sys.argv[3])
    print(f"Successfully converted {sys.argv[1]} to {sys.argv[2]}")
