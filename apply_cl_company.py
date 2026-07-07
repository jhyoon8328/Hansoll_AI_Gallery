with open('adminPage.html', 'r', encoding='utf-8') as f:
    html = f.read()

search_yn_html = '''<div class="flex items-center gap-2">
                            <label class="font-bold text-slate-600 whitespace-nowrap w-[70px] text-right">공개(Y/N):</label>
                            <select id="search-yn-open" onchange="fetchUserInfoList()"
                                class="w-32 border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer">
                                <option value="all" selected>전체</option>
                                <option value="Y">Y</option>
                                <option value="N">N</option>
                            </select>
                        </div>'''
search_cl_html = '''<div class="flex items-center gap-2">
                            <label class="font-bold text-slate-600 whitespace-nowrap w-[70px] text-right">소속:</label>
                            <select id="search-cl-company" onchange="fetchUserInfoList()"
                                class="w-32 border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer">
                                <option value="all" selected>전체</option>
                                <option value="본사">본사</option>
                                <option value="법인">법인</option>
                                <option value="게스트">게스트</option>
                            </select>
                        </div>'''
html = html.replace(search_yn_html, search_yn_html + '\n                        ' + search_cl_html)

th_html = '<th class="p-4 text-center">공개(Y/N)</th>'
html = html.replace(th_html, th_html + '\n                                <th class="p-4 text-center">소속</th>')

html = html.replace('colspan="7" class="p-8 text-center text-slate-500">데이터를 불러오는 중입니다...', 'colspan="8" class="p-8 text-center text-slate-500">데이터를 불러오는 중입니다...')
html = html.replace('colspan="7" class="p-8 text-center text-red-500">데이터를 불러오는데 실패했습니다.', 'colspan="8" class="p-8 text-center text-red-500">데이터를 불러오는데 실패했습니다.')
html = html.replace('colspan="7" class="p-8 text-center text-slate-500">일치하는 결과가 없습니다.', 'colspan="8" class="p-8 text-center text-slate-500">일치하는 결과가 없습니다.')

js_yn_param = "const ynOpen = document.getElementById('search-yn-open')?.value || 'all';"
html = html.replace(js_yn_param, js_yn_param + "\n            const clCompany = document.getElementById('search-cl-company')?.value || 'all';")

js_yn_filter = "if (ynOpen !== 'all') query = query.eq('yn_open', ynOpen);"
html = html.replace(js_yn_filter, js_yn_filter + "\n            if (clCompany !== 'all') query = query.eq('cl_company', clCompany);")

js_td_html = '<td class="p-4 text-center">${selectHtml}</td>'
html = html.replace(js_td_html, js_td_html + '\n                    <td class="p-4 text-center">${user.cl_company || "-"}</td>')

with open('adminPage.html', 'w', encoding='utf-8') as f:
    f.write(html)
