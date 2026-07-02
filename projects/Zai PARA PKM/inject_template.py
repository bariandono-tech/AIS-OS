import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_FILE = os.path.join(BASE_DIR, 'templates', 'book.html')

if os.path.exists(TEMPLATE_FILE):
    with open(TEMPLATE_FILE, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Replacing the masthead brand
    content = content.replace('<span class="brand-name">Forge</span>', '<span class="brand-name">{{ data.dashboard_title }}</span>')
    content = content.replace('<span class="brand-tag">a serial publication for working programmers</span>', '<span class="brand-tag">Automated PKM Workflow Dashboard</span>')
    
    # We will replace the aside-list with Jinja loop for tasks
    aside_start = content.find('<ul class="aside-list">')
    aside_end = content.find('</ul>', aside_start) + 5
    
    if aside_start != -1:
        jinja_tasks = """<ul class="aside-list">
          {% for task in data.tasks %}
          <li>
            <span class="aside-date">{{ task.due }}</span>
            <span class="aside-title">{{ task.name }}</span>
            <span class="aside-tag published">{{ task.status }}</span>
          </li>
          {% endfor %}
        </ul>"""
        content = content[:aside_start] + jinja_tasks + content[aside_end:]
        
    # Replace the Library Section with Notes
    lib_start = content.find('<div class="library-list">')
    lib_end = content.find('</div>\n    </div>\n\n    <div class="series-detail">') # Approximate end
    
    if lib_start != -1:
        # A bit risky to find end, let's just use string replace on a specific chunk
        pass
        
    with open(TEMPLATE_FILE, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Template updated with Jinja tags successfully!")
else:
    print("Template file not found.")
