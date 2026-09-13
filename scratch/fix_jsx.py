import os
import re

src_dir = os.path.join(os.path.dirname(__file__), '../frontend/src')

# Fixes to apply to all JSX files
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            original_content = content
            
            # 1. Ensure `return (` is followed by `<>` and ends with `</>`
            # We will just replace `return (` with `return (\n    <>` 
            # and the last `);` with `    </>\n  );`
            if 'return (' in content and 'return (\n        <>' not in content and 'return (\n    <>' not in content:
                content = content.replace('return (', 'return (\n        <>')
                # find the last );
                last_paren_idx = content.rfind(');')
                if last_paren_idx != -1:
                    content = content[:last_paren_idx] + '        </>\n    ' + content[last_paren_idx:]

            # 2. Fix remaining <% ... %> blocks that were not caught
            content = re.sub(r'<%([\s\S]*?)%>', r'{/* EJS LOGIC: \1 */}', content)

            # 3. Fix unclosed img tags
            # Replace <img ... > with <img ... />
            content = re.sub(r'<img([^>]+?)(?<!/)>', r'<img\1 />', content)

            # 4. Fix src="{ var }" to src={ var }
            content = re.sub(r'src="\{([^}]+)\}"', r'src={\1}', content)
            content = re.sub(r'href="\{([^}]+)\}"', r'href={\1}', content)
            
            # 5. Fix class= to className= (in case any were missed)
            content = re.sub(r'\bclass="', 'className="', content)
            content = re.sub(r"\bclass='", "className='", content)
            
            # 6. Fix for= to htmlFor=
            content = re.sub(r'\bfor="', 'htmlFor="', content)

            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)

print("Applied JSX syntax fixes.")
