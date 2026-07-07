with open('adminPage.html', 'r', encoding='utf-8') as f:
    html = f.read()

target_html = '''<option value="N">N</option>
                            </select>
                        </div>'''

insert_html = '''
                        <div class="flex items-center gap-2">
                            <label class="font-bold text-slate-600 whitespace-nowrap w-[70px] text-right">소속:</label>
                            <select id="search-cl-company" onchange="fetchUserInfoList()"
                                class="w-32 border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer">
                                <option value="all" selected>전체</option>
                                <option value="본사">본사</option>
                                <option value="법인">법인</option>
                                <option value="게스트">게스트</option>
                            </select>
                        </div>'''

if target_html in html and 'id="search-cl-company"' not in html:
    html = html.replace(target_html, target_html + insert_html)

with open('adminPage.html', 'w', encoding='utf-8') as f:
    f.write(html)
