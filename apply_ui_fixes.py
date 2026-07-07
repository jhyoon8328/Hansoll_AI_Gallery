with open('adminPage.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add "소속" column header
header_target = '<th class="p-4 text-center">공개여부(Y/N)</th>'
header_replacement = '<th class="p-4 text-center">공개여부(Y/N)</th>\n                                <th class="p-4 text-center">소속</th>'
if header_target in html and header_replacement not in html:
    html = html.replace(header_target, header_replacement)

# 2. Reduce "사번" column width
empno_target = '<th class="p-4">사번</th>'
empno_replacement = '<th class="p-4 w-20">사번</th>'
if empno_target in html:
    html = html.replace(empno_target, empno_replacement)

# 3. Add CSS for resizing
css_styles = """
        .resize-handle {
            position: absolute;
            top: 0;
            right: 0;
            width: 5px;
            height: 100%;
            cursor: col-resize;
            user-select: none;
            z-index: 20;
        }
        .resize-handle:hover, .resize-handle.active {
            background-color: #cbd5e1;
        }
        th {
            position: relative;
        }
    </style>"""
if '.resize-handle' not in html:
    html = html.replace('    </style>', css_styles)

# 4. Add JS for table resizing
js_script = """
        // Make tables resizable
        function makeTablesResizable() {
            const tables = document.querySelectorAll('table');
            tables.forEach(table => {
                const cols = table.querySelectorAll('thead th');
                cols.forEach(col => {
                    const resizer = document.createElement('div');
                    resizer.classList.add('resize-handle');
                    
                    // Force width if not set
                    if (!col.style.width) {
                        col.style.width = col.offsetWidth + 'px';
                    }

                    let startX, startWidth;

                    function onMouseMove(e) {
                        const newWidth = startWidth + (e.pageX - startX);
                        col.style.width = newWidth + 'px';
                        table.style.width = 'auto'; // allow columns to expand freely
                    }

                    function onMouseUp() {
                        resizer.classList.remove('active');
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                    }

                    resizer.addEventListener('mousedown', function(e) {
                        startX = e.pageX;
                        startWidth = col.offsetWidth;
                        resizer.classList.add('active');
                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                    });

                    col.appendChild(resizer);
                });
            });
        }
        document.addEventListener('DOMContentLoaded', makeTablesResizable);
</script>"""

if 'makeTablesResizable' not in html:
    # Insert right before the closing </script> tag of the main script block
    # It might be safer to replace the LAST </script> tag
    parts = html.rsplit('</script>', 1)
    if len(parts) == 2:
        html = parts[0] + js_script + parts[1]

with open('adminPage.html', 'w', encoding='utf-8') as f:
    f.write(html)
