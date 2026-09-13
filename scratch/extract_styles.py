import os
import re

src_dir = os.path.join(os.path.dirname(__file__), '../frontend/src')
css_path = os.path.join(src_dir, 'index.css')

all_styles = []

# Walk through all jsx files
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract and remove <style>...</style>
            def repl_style(match):
                all_styles.append(match.group(1))
                return ''
            
            content = re.sub(r'<style>([\s\S]*?)<\/style>', repl_style, content)

            # Fix <script type="application/ld+json">...</script>
            def repl_jsonld(match):
                inner = match.group(1)
                # Wrap with dangerouslySetInnerHTML
                return f'<script type="application/ld+json" dangerouslySetInnerHTML={{{{__html: `{inner}`}}}}></script>'

            content = re.sub(r'<script type="application/ld\+json">([\s\S]*?)<\/script>', repl_jsonld, content)

            # Fix <script>...</script> (inline JS logic)
            # We'll just comment them out for now so it compiles. 
            # Real logic like EJS data passing should be handled by React state
            def repl_script(match):
                inner = match.group(1)
                # If it's a src script, leave it but make sure it's self closing or empty child
                if '<script src=' in match.group(0):
                    return match.group(0)
                return '{/* SCRIPT REMOVED: \n' + inner.replace('*/', '* /') + '\n*/}'

            content = re.sub(r'<script(?! src| type="application/ld\+json")>([\s\S]*?)<\/script>', repl_script, content)

            # Fix unescaped < or > in text which causes JSX errors
            # Content like `<%` is already replaced mostly, but let's remove any remaining <%= %>
            content = re.sub(r'<%=([\s\S]*?)%>', r'{\1}', content)
            content = re.sub(r'<%([\s\S]*?)%>', r'{/* EJS: \1 */}', content)

            # Fix `onclick` to `onClick`
            content = re.sub(r'\bonclick=', 'onClick=', content)
            
            # Fix style="..." to style={{...}}
            # Actually we already did that in the first script, but let's check
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

# Append all extracted styles to index.css
if all_styles:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write('\n\n/* Extracted from JSX files */\n\n')
        f.write('\n\n'.join(all_styles))

print("Extracted styles and fixed scripts/JSX issues.")
