
        lucide.createIcons();
        
        let globalMenuData = [];
        let sortableInstance = null;
        let selectedFile = null;

        const SUPABASE_URL = 'https://yuklsrhmcbdanswxysrw.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1a2xzcmhtY2JkYW5zd3h5c3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTgwODQsImV4cCI6MjA5NjYzNDA4NH0.PEgzBsLD6Or7P32ao6LaKgSmf-SE1ay829eFQpkzhgE';

        async function loadMenuData(retries = 10) {
            try {
                const res = await fetch(`${SUPABASE_URL}/rest/v1/MenuSetting?select=*`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    },
                    cache: 'no-store'
                });
                if(res.ok) {
                    const flatData = await res.json();
                    if(flatData && flatData.length > 0) {
                        const categories = flatData.filter(d => d.menu_type === 'category' || d.menu_type === '카테고리');
                        globalMenuData = categories.map(cat => {
                            const meta = cat.menu_meta || {};
                            const subItems = flatData.filter(sub => sub.menu_type !== '카테고리' && sub.menu_type !== 'category' && (sub.menu_meta && sub.menu_meta.parentCategory === cat.menu_name)).map(sub => {
                                const subMeta = sub.menu_meta || {};
                                return {
                                    title: sub.menu_name,
                                    description: subMeta.description || "",
                                    status: sub.YN_use ? 'Y' : 'N',
                                    fileName: sub.file_path || "",
                                    menuId: sub.MenuId || sub.menu_name,
                                    folderName: subMeta.folderName || sub.menu_name,
                                    urlAddress: sub.url_address || ""
                                };
                            });
                            return {
                                title: cat.menu_name,
                                slug: meta.slug || "",
                                imageUrl: meta.imageUrl || "",
                                icon: meta.icon || "",
                                status: cat.YN_use ? 'Y' : 'N',
                                displayPhrase: meta.displayPhrase || "",
                                bgColor: meta.bgColor || "#050505",
                                textColor: meta.textColor || "#ffffff",
                                menuId: cat.MenuId,
                                subItems: subItems
                            };
                        });
                        
                        globalMenuData.forEach(cat => {
                            if (cat.subItems) {
                                cat.subItems.forEach(sub => {
                                    if (typeof sub === 'object' && !sub.menuId) {
                                        sub.menuId = sub.title;
                                    }
                                });
                            }
                        });
                        renderDashboard();
                        renderMenuManager();
                        return;
                    }
                }
                throw new Error("Invalid response or empty data");
            } catch(e) {
                if (retries > 0) {
                    console.log(`Failed to load menu data. Retrying in 1s... (${retries} retries left)`);
                    setTimeout(() => loadMenuData(retries - 1), 1000);
                    return;
                }
                console.error("Failed to load menu data completely", e);
                try {
                    if (window.parent && window.parent.menuData) {
                        globalMenuData = JSON.parse(JSON.stringify(window.parent.menuData));
                    } else {
                        throw new Error("No parent data");
                    }
                    globalMenuData = [
                        { title: "사업 3부", slug: "business-3", status: "Y", subItems: [{ title: "CMPH recap 작성", status: "Y" }, { title: "CMPH recap 작성 (Backup)", status: "Y" }] },
                        { title: "IT부", slug: "it", status: "Y", subItems: [{ title: "mainPage", status: "Y" }] }
                    ];
                }
                globalMenuData.forEach(cat => {
                    if (cat.subItems) {
                        cat.subItems.forEach(sub => {
                            if (typeof sub === 'object' && !sub.menuId) {
                                sub.menuId = sub.title;
                            }
                        });
                    }
                });
                renderDashboard();
                renderMenuManager();
            }
        }

        window.onload = loadMenuData;

        async function saveData() {
            try {
                const records = [];
                globalMenuData.forEach((cat, index) => {
                    records.push({
                        MenuId: cat.menuId,
                        menu_path: "",
                        menu_name: cat.title,
                        menu_type: '카테고리',
                        file_path: null,
                        url_address: "",
                        YN_use: (cat.status || 'Y') === 'Y',
                        menu_meta: {
                            icon: cat.icon,
                            slug: cat.slug,
                            bgColor: cat.bgColor,
                            imageUrl: cat.imageUrl,
                            textColor: cat.textColor,
                            displayPhrase: cat.displayPhrase
                        }
                    });

                    if (cat.subItems) {
                        cat.subItems.forEach(sub => {
                            let subTitle = typeof sub === 'string' ? sub : sub.title;
                            let subDesc = typeof sub === 'string' ? null : sub.description;
                            let subStatus = typeof sub === 'string' ? 'Y' : (sub.status || 'Y');
                            let subFile = typeof sub === 'string' ? null : sub.fileName;
                            let menuId = (typeof sub === 'object' && sub.menuId) ? sub.menuId : subTitle;
                            let folderName = (typeof sub === 'object' && sub.folderName) ? sub.folderName : subTitle;
                            let urlAddr = (typeof sub === 'object' && sub.urlAddress) ? sub.urlAddress : "";

                            let typeText = "정보 없음";
                            let isUrl = false;
                            if (subFile) {
                                if (subFile.endsWith('.txt')) { typeText = "URL 링크"; isUrl = true; }
                                else if (subFile.endsWith('.html')) typeText = "HTML 웹페이지";
                                else if (subFile.endsWith('.py')) typeText = "파이썬 스크립트";
                                else if (subFile !== "정보 없음") typeText = "실행 파일 (" + subFile.split('.').pop() + ")";
                            }

                            records.push({
                                MenuId: menuId,
                                menu_path: subFile && subFile !== "정보 없음" ? `Project files/${cat.title}/${folderName}/${subFile}` : "",
                                menu_name: subTitle,
                                menu_type: typeText,
                                file_path: subFile,
                                url_address: isUrl ? urlAddr : "",
                                YN_use: subStatus === 'Y',
                                menu_meta: {
                                    description: subDesc,
                                    folderName: folderName,
                                    parentCategory: cat.title
                                }
                            });
                        });
                    }
                });

                const res = await fetch(`${SUPABASE_URL}/rest/v1/MenuSetting?select=MenuId`, {
                    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
                });
                if (res.ok) {
                    const currentRecords = await res.json();
                    const currentIds = currentRecords.map(r => r.MenuId);
                    const newIds = records.map(r => r.MenuId);
                    const idsToDelete = currentIds.filter(id => !newIds.includes(id));
                    
                    if (idsToDelete.length > 0) {
                        await fetch(`${SUPABASE_URL}/rest/v1/MenuSetting?MenuId=in.(${idsToDelete.join(',')})`, {
                            method: 'DELETE',
                            headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
                        });
                    }
                }

                const postRes = await fetch(`${SUPABASE_URL}/rest/v1/MenuSetting?on_conflict=MenuId`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'resolution=merge-duplicates'
                    },
                    body: JSON.stringify(records)
                });
                if (!postRes.ok) {
                    const errText = await postRes.text();
                    console.error("Supabase upsert failed:", errText);
                    throw new Error("Supabase upsert failed: " + postRes.statusText);
                }
            } catch(e) {
                console.error("Failed to save menu data", e);
                alert("메뉴 저장 중 오류가 발생했습니다: " + e.message);
            }
        }

        function switchTab(tabId) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content, #tab-home, #tab-menu, #tab-password').forEach(c => {
                c.classList.remove('block');
                c.classList.add('hidden');
            });

            event.target.classList.add('active');
            const target = document.getElementById('tab-' + tabId);
            target.classList.remove('hidden');
            target.classList.add('block');
            
            if(tabId === 'home') renderDashboard();
        }

        // --- DASHBOARD ---
        function renderDashboard() {
            let totalDev = 0;
            let hiddenMenuCount = 0;
            let hiddenCatCount = 0;
            let deptCounts = {};
            let hiddenList = [];
            let activeDeptCount = 0;

            globalMenuData.forEach(cat => {
                // 부서 자체가 숨김 처리된 경우 카운트 및 리스트에 추가
                if (cat.status === 'N') {
                    hiddenCatCount++;
                    hiddenList.push({ cat: '카테고리 숨김', name: cat.title });
                } else {
                    activeDeptCount++;
                }

                let activeSubs = 0;
                
                cat.subItems.forEach(sub => {
                    const subStatus = sub.status || 'Y';
                    const isHidden = subStatus === 'N' || cat.status === 'N';
                    
                    // 만약 부서 전체가 숨겨졌다면, 하위 메뉴를 개별적으로 또 리스트에 넣지 않거나 넣거나 선택.
                    // 기존 로직을 존중하여 숨김 처리된 하위 메뉴도 카운트 및 리스트화
                    if(isHidden) {
                        hiddenMenuCount++;
                        hiddenList.push({ cat: cat.title, name: typeof sub === 'string' ? sub : sub.title });
                    }
                    totalDev++;
                    activeSubs++;
                });
                
                // 개발 건수가 1건 이상인 부서만 그래프(리스트)에 표시
                if (activeSubs > 0) {
                    deptCounts[cat.title] = activeSubs;
                }
            });

            document.getElementById('stat-total').innerHTML = `${totalDev}<span class="text-base font-medium text-slate-400 ml-1">건</span>`;
            document.getElementById('stat-dept').innerHTML = `${activeDeptCount}<span class="text-base font-medium text-slate-400 ml-1">개</span>`;
            document.getElementById('stat-hidden-cat').innerHTML = `${hiddenCatCount}<span class="text-base font-medium text-slate-400 ml-1">개</span>`;
            document.getElementById('stat-hidden').innerHTML = `${hiddenMenuCount}<span class="text-base font-medium text-slate-400 ml-1">건</span>`;

            // Render dept list
            const deptContainer = document.getElementById('dept-breakdown-list');
            deptContainer.innerHTML = '';
            for(const [dept, count] of Object.entries(deptCounts)) {
                deptContainer.innerHTML += `
                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span class="font-semibold text-slate-700">${dept}</span>
                        <span class="text-sm font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">${count}건</span>
                    </div>
                `;
            }

            // Render hidden list
            const hiddenContainer = document.getElementById('hidden-menus-list');
            hiddenContainer.innerHTML = '';
            if(hiddenList.length === 0) {
                hiddenContainer.innerHTML = '<p class="text-sm text-slate-400 p-2">숨김처리된 메뉴가 없습니다.</p>';
            } else {
                hiddenList.forEach(item => {
                    hiddenContainer.innerHTML += `
                        <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span class="text-xs font-bold px-2 py-1 bg-slate-200 text-slate-600 rounded-md">${item.cat}</span>
                            <span class="text-sm font-medium text-slate-700">${item.name}</span>
                        </div>
                    `;
                });
            }
        }

        // --- MENU MANAGEMENT ---
        let collapsedCategories = new Set();
        let currentMenuFilter = 'all';

        function applyMenuFilter() {
            currentMenuFilter = document.getElementById('menu-filter-select').value;
            renderMenuManager();
        }

        function renderMenuManager() {
            const container = document.getElementById('categories-container');
            container.innerHTML = '';

            globalMenuData.forEach((cat, catIndex) => {
                const isCollapsed = collapsedCategories.has(catIndex);
                let hasMatchingSubItems = false;
                
                const subItemsHtml = cat.subItems.map((sub, subIndex) => {
                    const title = typeof sub === 'string' ? sub : sub.title;
                    const status = sub.status || 'Y';

                    if (currentMenuFilter === 'active' && status !== 'Y') return '';
                    if (currentMenuFilter === 'hidden' && status !== 'N') return '';

                    hasMatchingSubItems = true;
                    const isChecked = status === 'Y' ? 'checked' : '';
                    
                    return `
                    <div class="flex items-center justify-between p-3 bg-white border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <div class="flex items-center gap-2">
                            <i data-lucide="grip-vertical" class="w-4 h-4 text-slate-300 cursor-move sub-drag-handle hover:text-slate-500"></i>
                            <i data-lucide="file-code-2" class="w-4 h-4 text-slate-400"></i>
                            <span class="text-sm font-medium text-slate-700">${title}</span>
                        </div>
                            <div class="flex items-center gap-3">
                                <span class="text-xs font-bold ${status === 'Y' ? 'text-emerald-500' : 'text-rose-500'}">${status === 'Y' ? '사용중' : '숨김'}</span>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" class="sr-only peer" ${isChecked} onchange="toggleMenuStatus(${catIndex}, ${subIndex})">
                                    <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                                <button onclick="openEditMenuModal(${catIndex}, ${subIndex})" class="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded transition-colors ml-1">변경</button>
                                <button onclick="deleteMenu(${catIndex}, ${subIndex})" class="px-2.5 py-1 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 rounded transition-colors ml-1">삭제</button>
                            </div>
                        </div>`;
                }).join('');

                const catStatus = cat.status || 'Y';
                
                // Category Filter Logic
                if (currentMenuFilter === 'active' && catStatus !== 'Y') {
                    return; // Hide entirely
                }
                
                if (currentMenuFilter === 'hidden') {
                    if (catStatus !== 'N' && !hasMatchingSubItems) {
                        return; // Hide entirely if category is active AND has no hidden subitems
                    }
                }

                const catChecked = catStatus === 'Y' ? 'checked' : '';

                container.innerHTML += `
                    <div class="glass-card rounded-xl border border-slate-200 overflow-hidden" data-id="${cat.slug}">
                        <div class="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 drag-handle">
                            <div class="flex items-center gap-3">
                                <button onclick="event.stopPropagation(); toggleCategoryCollapse(${catIndex})" class="focus:outline-none p-1 hover:bg-slate-200 rounded transition-colors" title="접기/펼치기">
                                    <i data-lucide="${isCollapsed ? 'chevron-right' : 'chevron-down'}" class="w-5 h-5 text-slate-500"></i>
                                </button>
                                <i data-lucide="grip-vertical" class="w-5 h-5 text-slate-400 cursor-move"></i>
                                <h3 class="font-bold text-slate-800">${cat.title}</h3>
                            </div>
                            <div class="flex items-center gap-3" onclick="event.stopPropagation()">
                                <span class="text-xs font-bold ${(cat.status || 'Y') === 'Y' ? 'text-emerald-500' : 'text-rose-500'}">${(cat.status || 'Y') === 'Y' ? '사용중' : '숨김'}</span>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" class="sr-only peer" ${catChecked} onchange="toggleCategoryStatus(${catIndex})">
                                    <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                                <button onclick="openEditCategoryModal(${catIndex})" class="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded transition-colors ml-1">변경</button>
                            </div>
                        </div>
                        <div class="flex flex-col ${isCollapsed ? 'hidden' : ''}" id="sub-list-${catIndex}">
                            ${subItemsHtml || '<div class="p-4 text-sm text-slate-400 italic">등록된 메뉴가 없습니다.</div>'}
                        </div>
                    </div>
                `;
            });

            lucide.createIcons();

            if (sortableInstance) sortableInstance.destroy();
            sortableInstance = new Sortable(container, {
                handle: '.drag-handle',
                animation: 150,
                onEnd: function (evt) {
                    // Reorder globalMenuData based on new order
                    const item = globalMenuData.splice(evt.oldIndex, 1)[0];
                    globalMenuData.splice(evt.newIndex, 0, item);
                }
            });

            if (window.subSortableInstances) {
                window.subSortableInstances.forEach(s => s.destroy());
            }
            window.subSortableInstances = [];

            globalMenuData.forEach((cat, catIndex) => {
                const subContainer = document.getElementById(`sub-list-${catIndex}`);
                if (subContainer && cat.subItems.length > 0) {
                    const subSortable = new Sortable(subContainer, {
                        handle: '.sub-drag-handle',
                        animation: 150,
                        onEnd: function (evt) {
                            const subArray = globalMenuData[catIndex].subItems;
                            const item = subArray.splice(evt.oldIndex, 1)[0];
                            subArray.splice(evt.newIndex, 0, item);
                        }
                    });
                    window.subSortableInstances.push(subSortable);
                }
            });
        }

        async function applyChanges() {
            await saveData();
            
            alert("변경사항이 정상적으로 저장되었습니다. 화면을 새로고침합니다.");
            try {
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'RELOAD_PORTAL' }, '*');
                } else {
                    window.location.reload();
                }
            } catch(e) {
                window.location.reload();
            }
        }

        function toggleCategoryCollapse(catIndex) {
            if (collapsedCategories.has(catIndex)) {
                collapsedCategories.delete(catIndex);
            } else {
                collapsedCategories.add(catIndex);
            }
            renderMenuManager();
        }

        function toggleMenuStatus(catIndex, subIndex) {
            const sub = globalMenuData[catIndex].subItems[subIndex];
            if(typeof sub === 'string') {
                globalMenuData[catIndex].subItems[subIndex] = { title: sub, status: 'N' };
            } else {
                sub.status = sub.status === 'Y' ? 'N' : 'Y';
            }
            renderMenuManager();
        }

        function toggleCategoryStatus(catIndex) {
            const cat = globalMenuData[catIndex];
            cat.status = (cat.status || 'Y') === 'Y' ? 'N' : 'Y';
            renderMenuManager();
        }

        async function deleteMenu(catIndex, subIndex) {
            const cat = globalMenuData[catIndex];
            const sub = cat.subItems[subIndex];
            const title = typeof sub === 'string' ? sub : sub.title;

            if(!confirm(`'${title}' 메뉴를 삭제하시겠습니까? 관련된 물리적 경로 및 파일이 모두 영구 삭제됩니다.`)) return;

            try {
                const res = await fetch('http://localhost:3000/api/delete-menu', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ category: cat.title, menuName: title })
                });

                if(!res.ok) {
                    console.error("Failed to delete physical folder");
                }

                cat.subItems.splice(subIndex, 1);
                await saveData();
                renderMenuManager();
                renderDashboard();
                
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'RELOAD_PORTAL' }, '*');
                }
            } catch(e) {
                alert("삭제 중 오류가 발생했습니다: " + e.message);
            }
        }

        // --- EDIT CATEGORY MODAL ---
        function openEditCategoryModal(catIndex) {
            const cat = globalMenuData[catIndex];
            document.getElementById('edit-cat-index-input').value = catIndex;
            document.getElementById('edit-cat-name-input').value = cat.title || '';
            document.getElementById('edit-cat-display-phrase-input').value = cat.displayPhrase || '';
            document.getElementById('edit-cat-bg-color-input').value = cat.bgColor || '#050505';
            document.getElementById('edit-cat-text-color-input').value = cat.textColor || '#ffffff';
            document.getElementById('edit-category-modal').classList.remove('hidden');
            lucide.createIcons();
        }

        function closeEditCategoryModal() {
            document.getElementById('edit-category-modal').classList.add('hidden');
        }

        async function submitEditCategory() {
            const index = parseInt(document.getElementById('edit-cat-index-input').value);
            const cat = globalMenuData[index];
            const oldName = cat.title;
            
            const newName = document.getElementById('edit-cat-name-input').value.trim();
            const displayPhrase = document.getElementById('edit-cat-display-phrase-input').value.trim();
            const bgColor = document.getElementById('edit-cat-bg-color-input').value;
            const textColor = document.getElementById('edit-cat-text-color-input').value;
            
            if(!newName) return alert("카테고리명을 입력하세요.");
            
            // Check if name changed and new name already exists
            if (oldName !== newName && globalMenuData.find(c => c.title === newName)) {
                return alert("이미 존재하는 카테고리명입니다.");
            }

            try {
                if (oldName !== newName) {
                    const res = await fetch('http://localhost:3000/api/rename-cat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ oldName, newName })
                    });
                    
                    const result = await res.json();
                    if (!res.ok) {
                        if (result.error === 'ALREADY_EXISTS') {
                            return alert('해당 이름의 폴더가 이미 존재합니다.');
                        }
                        if (result.error === 'OLD_DIR_NOT_FOUND') {
                            console.warn('기존 폴더가 존재하지 않지만 메타데이터는 변경합니다.');
                        } else {
                            throw new Error(result.error || 'Failed to rename folder');
                        }
                    }
                }

                // Update data
                cat.title = newName;
                cat.slug = newName.toLowerCase().replace(/\s+/g, '-');
                cat.displayPhrase = displayPhrase;
                cat.bgColor = bgColor;
                cat.textColor = textColor;

                await applyChanges();
                closeEditCategoryModal();
                renderMenuManager();
                renderDashboard();
            } catch(e) {
                alert("변경 저장에 실패했습니다. 서버 상태를 확인해주세요.");
                console.error(e);
            }
        }

        // --- ADD CATEGORY MODAL ---
        function openCategoryModal() {
            document.getElementById('cat-name-input').value = '';
            document.getElementById('cat-display-phrase-input').value = '';
            document.getElementById('cat-bg-color-input').value = '#050505';
            document.getElementById('cat-text-color-input').value = '#ffffff';
            document.getElementById('category-modal').classList.remove('hidden');
        }
        function closeCategoryModal() {
            document.getElementById('category-modal').classList.add('hidden');
        }
        async function submitCategory() {
            const name = document.getElementById('cat-name-input').value.trim();
            const displayPhrase = document.getElementById('cat-display-phrase-input').value.trim();
            const bgColor = document.getElementById('cat-bg-color-input').value;
            const textColor = document.getElementById('cat-text-color-input').value;
            if(!name) return alert("카테고리명을 입력하세요.");
            
            // Check if exists
            if(globalMenuData.find(c => c.title === name)) return alert("이미 존재하는 카테고리입니다.");

            // Add to data
            globalMenuData.push({
                title: name,
                displayPhrase: displayPhrase,
                bgColor: bgColor,
                textColor: textColor,
                slug: name.toLowerCase().replace(/\s+/g, '-'),
                imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200", // default
                icon: "folder",
                status: "Y",
                subItems: []
            });

            // Call API to create directory
            const formData = new FormData();
            formData.append('category', name);
            formData.append('isNewCategory', 'true');
            
            try {
                await fetch('http://localhost:3000/api/upload', { method: 'POST', body: formData });
                await saveData();
                closeCategoryModal();
                renderMenuManager();
            } catch(e) {
                alert("폴더 생성에 실패했습니다.");
            }
        }

        // --- MENU MODAL ---
        function toggleUrlMode() {
            const isUrlMode = document.getElementById('menu-url-checkbox').checked;
            const urlInput = document.getElementById('menu-url-input');
            const dropZone = document.getElementById('drop-zone');
            const fileInput = document.getElementById('file-input');
            const dropZoneText = document.getElementById('drop-zone-text');
            const uploadLabel = document.getElementById('file-upload-label');

            if (isUrlMode) {
                urlInput.disabled = false;
                
                selectedFile = null;
                dropZoneText.innerText = "URL 입력 모드입니다. (파일 첨부 비활성화)";
                dropZone.style.pointerEvents = 'none';
                dropZone.style.opacity = '0.5';
                fileInput.disabled = true;
                uploadLabel.classList.add('opacity-50');
            } else {
                urlInput.disabled = true;
                urlInput.value = '';
                
                selectedFile = null;
                dropZoneText.innerText = "파일을 드래그하거나 클릭하여 선택하세요.";
                dropZone.style.pointerEvents = 'auto';
                dropZone.style.opacity = '1';
                fileInput.disabled = false;
                uploadLabel.classList.remove('opacity-50');
            }
        }

        function openMenuModal() {
            const select = document.getElementById('menu-cat-select');
            select.innerHTML = globalMenuData.map((c, i) => `<option value="${i}">${c.title}</option>`).join('');
            
            document.getElementById('menu-name-input').value = '';
            document.getElementById('menu-desc-input').value = '';
            document.getElementById('menu-url-checkbox').checked = false;
            toggleUrlMode();
            
            document.getElementById('menu-modal').classList.remove('hidden');
        }
        function closeMenuModal() {
            document.getElementById('menu-modal').classList.add('hidden');
        }
        
        // Drag and drop for files
        function handleDragOver(e) {
            e.preventDefault();
            document.getElementById('drop-zone').classList.add('dragover');
        }
        function handleDragLeave(e) {
            e.preventDefault();
            document.getElementById('drop-zone').classList.remove('dragover');
        }
        function handleDrop(e) {
            e.preventDefault();
            document.getElementById('drop-zone').classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                setFile(e.dataTransfer.files[0]);
            }
        }
        function handleFileSelect(e) {
            if (e.target.files.length > 0) {
                setFile(e.target.files[0]);
            }
        }
        function setFile(file) {
            selectedFile = file;
            document.getElementById('drop-zone-text').innerText = `선택된 파일: ${file.name}`;
            
            // Auto-fill menu name if empty
            const nameInput = document.getElementById('menu-name-input');
            if(!nameInput.value) {
                nameInput.value = file.name.split('.').slice(0, -1).join('.');
            }
        }

        async function submitMenu() {
            const catIndex = document.getElementById('menu-cat-select').value;
            const menuName = document.getElementById('menu-name-input').value.trim();
            const desc = document.getElementById('menu-desc-input').value.trim();
            const isUrlMode = document.getElementById('menu-url-checkbox').checked;
            let urlValue = document.getElementById('menu-url-input').value.trim();
            
            if(!menuName) return alert("메뉴명을 입력하세요.");
            if(!desc) return alert("메뉴 설명을 입력하세요.");

            let finalFile = selectedFile;

            if (isUrlMode) {
                if (!urlValue) return alert("실행할 URL 주소를 입력하세요.");
                if (!urlValue.startsWith('http://') && !urlValue.startsWith('https://')) {
                    urlValue = 'https://' + urlValue;
                }
                const fileContent = `${urlValue}\n\n설명 : ${desc}`;
                finalFile = new File([fileContent], `${menuName}.txt`, { type: "text/plain" });
            } else {
                if(!finalFile) return alert("파일을 첨부해주세요.");
            }

            const cat = globalMenuData[catIndex];
            const btn = document.getElementById('submit-menu-btn');
            btn.innerText = "저장 중...";
            btn.disabled = true;

            const formData = new FormData();
            formData.append('category', cat.title);
            formData.append('menuName', menuName);
            formData.append('file', finalFile);

            try {
                // Upload file
                let res = await fetch('http://localhost:3000/api/upload', { method: 'POST', body: formData });
                if(!res.ok) {
                    if (res.status === 409) {
                        if (confirm("동일한 이름의 파일이 있습니다. 해당 파일을 덮어쓰시겠습니까?")) {
                            formData.append('overwrite', 'true');
                            res = await fetch('http://localhost:3000/api/upload', { method: 'POST', body: formData });
                            if (!res.ok) throw new Error("Upload failed after overwrite request");
                        } else {
                            btn.innerHTML = `저장`;
                            btn.disabled = false;
                            return;
                        }
                    } else {
                        throw new Error("Upload failed");
                    }
                }

                // Update data
                cat.subItems.push({
                    title: menuName,
                    description: desc,
                    showHelpIcon: !!desc,
                    status: "Y",
                    fileName: finalFile.name
                });

                await saveData();
                alert("정상적으로 저장되었습니다. 화면을 새로고침합니다.");
                try {
                    if (window.parent && window.parent !== window) {
                        window.parent.postMessage({ type: 'RELOAD_PORTAL' }, '*');
                    } else {
                        window.location.reload();
                    }
                } catch(e) {
                    window.location.reload();
                }
            } catch(e) {
                alert("파일 업로드 또는 저장에 실패했습니다.");
                console.error(e);
            } finally {
                btn.innerHTML = `저장`;
                btn.disabled = false;
            }
        }

        let currentEditCatIndex = -1;
        let currentEditSubIndex = -1;
        let editSelectedFile = null;

        function openEditMenuModal(catIndex, subIndex) {
            currentEditCatIndex = catIndex;
            currentEditSubIndex = subIndex;
            
            const cat = globalMenuData[catIndex];
            const sub = cat.subItems[subIndex];
            
            const title = typeof sub === 'string' ? sub : sub.title;
            const fileName = sub.fileName || "정보 없음";
            
            let typeText = "알 수 없음";
            let isUrl = fileName.endsWith('.txt'); 
            if (isUrl) typeText = "URL 링크";
            else if (fileName.endsWith('.html')) typeText = "HTML 웹페이지";
            else if (fileName.endsWith('.py')) typeText = "파이썬 스크립트";
            else if (fileName !== "정보 없음") typeText = "실행 파일 (" + fileName.split('.').pop() + ")";
            
            const currentInfoHtml = `
                <div class="flex flex-col gap-1">
                    <span class="font-bold text-slate-800">대상 메뉴:</span>
                    <span class="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded inline-block w-fit">${cat.title} > ${title}</span>
                </div>
                <div class="flex flex-col gap-1 mt-3">
                    <span class="font-bold text-slate-800">현재 유형:</span>
                    <span>${typeText}</span>
                </div>
                <div class="flex flex-col gap-1 mt-3">
                    <span class="font-bold text-slate-800">현재 저장 경로/파일명:</span>
                    <span class="break-all font-mono text-xs bg-slate-200 px-2 py-1.5 rounded">Project files/${cat.title}/${title}/${fileName}</span>
                </div>
            `;
            
            document.getElementById('edit-current-info').innerHTML = currentInfoHtml;
            
            document.getElementById('edit-menu-name-input').value = title;
            document.getElementById('edit-name-only-checkbox').checked = false;
            toggleEditNameOnlyMode();
            
            document.getElementById('edit-url-checkbox').checked = false;
            document.getElementById('edit-url-input').value = '';
            editSelectedFile = null;
            document.getElementById('edit-drop-zone-text').innerText = "파일을 드래그하거나 클릭하여 선택하세요.";
            toggleEditUrlMode();
            
            const isLocalFile = window.location.protocol === 'file:';
            const apiUrl = isLocalFile ? 'http://localhost:3000/api' : '/api';
            
            if (isUrl && fileName !== "정보 없음") {
                let url = sub.urlAddress || "";
                if (url) {
                    document.getElementById('edit-url-checkbox').checked = true;
                    toggleEditUrlMode();
                    document.getElementById('edit-url-input').value = url;
                } else {
                    const filePath = `Project files/${cat.title}/${title}/${fileName}`;
                    fetch(apiUrl + '/read-file?filePath=' + encodeURIComponent(filePath) + '&t=' + Date.now())
                        .then(res => res.ok ? res.text() : "")
                        .then(text => {
                            if (text) {
                                let url = text.split('\n')[0].trim();
                            document.getElementById('edit-url-checkbox').checked = true;
                            toggleEditUrlMode();
                            document.getElementById('edit-url-input').value = url;
                        }
                    })
                    .catch(e => console.error("Failed to load URL info", e));
            }
            
            document.getElementById('edit-menu-modal').classList.remove('hidden');
            lucide.createIcons();
        }

        function closeEditMenuModal() {
            document.getElementById('edit-menu-modal').classList.add('hidden');
        }

        function toggleEditNameOnlyMode() {
            const isNameOnly = document.getElementById('edit-name-only-checkbox').checked;
            const rightCol = document.getElementById('edit-right-col');
            
            if(isNameOnly) {
                rightCol.classList.add('opacity-40', 'pointer-events-none');
            } else {
                rightCol.classList.remove('opacity-40', 'pointer-events-none');
            }
        }

        function toggleEditUrlMode() {
            const isChecked = document.getElementById('edit-url-checkbox').checked;
            const urlInput = document.getElementById('edit-url-input');
            const dropZone = document.getElementById('edit-drop-zone');
            const fileLabel = document.getElementById('edit-file-upload-label');
            const fileInput = document.getElementById('edit-file-input');
            
            if(isChecked) {
                urlInput.disabled = false;
                urlInput.focus();
                
                dropZone.classList.add('opacity-50', 'pointer-events-none');
                fileLabel.classList.add('opacity-50');
                editSelectedFile = null;
                document.getElementById('edit-drop-zone-text').innerText = "파일을 드래그하거나 클릭하여 선택하세요.";
                fileInput.value = ''; 
            } else {
                urlInput.disabled = true;
                urlInput.value = '';
                
                dropZone.classList.remove('opacity-50', 'pointer-events-none');
                fileLabel.classList.remove('opacity-50');
            }
        }

        function handleEditDragOver(e) {
            e.preventDefault();
            if(!document.getElementById('edit-url-checkbox').checked) {
                document.getElementById('edit-drop-zone').classList.add('dragover');
            }
        }
        function handleEditDragLeave(e) {
            e.preventDefault();
            document.getElementById('edit-drop-zone').classList.remove('dragover');
        }
        function handleEditDrop(e) {
            e.preventDefault();
            document.getElementById('edit-drop-zone').classList.remove('dragover');
            if(!document.getElementById('edit-url-checkbox').checked && e.dataTransfer.files.length > 0) {
                setEditFile(e.dataTransfer.files[0]);
            }
        }
        function handleEditFileSelect(e) {
            if(!document.getElementById('edit-url-checkbox').checked && e.target.files.length > 0) {
                setEditFile(e.target.files[0]);
            }
        }
        function setEditFile(file) {
            editSelectedFile = file;
            document.getElementById('edit-drop-zone-text').innerText = `선택된 파일: ${file.name}`;
        }

        async function submitEditMenu() {
            const isUrlMode = document.getElementById('edit-url-checkbox').checked;
            let urlValue = document.getElementById('edit-url-input').value.trim();
            const newMenuName = document.getElementById('edit-menu-name-input').value.trim();
            const isNameOnly = document.getElementById('edit-name-only-checkbox').checked;
            
            if (!newMenuName) return alert("메뉴명을 입력하세요.");

            const cat = globalMenuData[currentEditCatIndex];
            const sub = cat.subItems[currentEditSubIndex];
            const oldMenuName = typeof sub === 'string' ? sub : sub.title;
            const desc = sub.description || "";

            let finalFile = editSelectedFile;

            if (!isNameOnly) {
                if (isUrlMode) {
                    if (!urlValue) return alert("새로 변경할 URL 주소를 입력하세요.");
                    if (!urlValue.startsWith('http://') && !urlValue.startsWith('https://')) {
                        urlValue = 'https://' + urlValue;
                    }
                    const fileContent = `${urlValue}\n\n설명 : ${desc}`;
                    finalFile = new File([fileContent], `${newMenuName}.txt`, { type: "text/plain" });
                } else {
                    if(!finalFile) return alert("새로 변경할 파일을 첨부해주세요.");
                }
            }

            const btn = document.getElementById('submit-edit-menu-btn');
            btn.innerText = "저장 중...";
            btn.disabled = true;

            try {
                // Rename folder if name changed and it's NOT a name-only edit
                if (oldMenuName !== newMenuName && !isNameOnly) {
                    let renameRes = await fetch('http://localhost:3000/api/rename', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ category: cat.title, oldName: typeof sub === 'object' && sub.folderName ? sub.folderName : oldMenuName, newName: newMenuName })
                    });
                    if (!renameRes.ok) {
                        if (renameRes.status === 409) {
                            if (confirm("이미 해당 이름의 메뉴 폴더가 존재합니다. 기존 폴더에 덮어쓰기(병합)하시겠습니까?")) {
                                renameRes = await fetch('http://localhost:3000/api/rename', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ category: cat.title, oldName: typeof sub === 'object' && sub.folderName ? sub.folderName : oldMenuName, newName: newMenuName, overwrite: true })
                                });
                                if (!renameRes.ok) {
                                    alert("폴더 병합 중 오류가 발생했습니다.");
                                    btn.innerHTML = `변경 내용 저장`;
                                    btn.disabled = false;
                                    return;
                                }
                            } else {
                                btn.innerHTML = `변경 내용 저장`;
                                btn.disabled = false;
                                return;
                            }
                        } else {
                            alert("폴더 이름 변경 중 오류가 발생했습니다. (Vercel에서는 파일명 변경이 불가능합니다.)");
                            btn.innerHTML = `변경 내용 저장`;
                            btn.disabled = false;
                            return;
                        }
                    }
                }

                let finalFileName = typeof sub === 'string' ? "" : (sub.fileName || "");

                // Upload file if not name-only
                if (!isNameOnly) {
                    const formData = new FormData();
                    formData.append('category', cat.title);
                    formData.append('menuName', newMenuName);
                    formData.append('file', finalFile);

                    let res = await fetch('http://localhost:3000/api/upload', { method: 'POST', body: formData });
                    if(!res.ok) {
                        if (res.status === 409) {
                            if (confirm("기존 폴더에 동일한 이름의 파일이 이미 존재합니다. 해당 파일을 덮어쓰시겠습니까?")) {
                                formData.append('overwrite', 'true');
                                res = await fetch('http://localhost:3000/api/upload', { method: 'POST', body: formData });
                                if (!res.ok) throw new Error("Upload failed after overwrite request");
                            } else {
                                btn.innerHTML = `변경 내용 저장`;
                                btn.disabled = false;
                                return;
                            }
                        } else {
                            throw new Error("Upload failed");
                        }
                    }
                    finalFileName = finalFile.name;
                }

                if (typeof cat.subItems[currentEditSubIndex] === 'string') {
                    cat.subItems[currentEditSubIndex] = {
                        title: newMenuName,
                        status: 'Y',
                        fileName: finalFileName,
                        folderName: isNameOnly ? oldMenuName : newMenuName,
                        urlAddress: isUrlMode ? urlValue : ""
                    };
                } else {
                    cat.subItems[currentEditSubIndex].title = newMenuName;
                    if (isUrlMode) {
                        cat.subItems[currentEditSubIndex].urlAddress = urlValue;
                    }
                    if (!isNameOnly) {
                        cat.subItems[currentEditSubIndex].fileName = finalFileName;
                        cat.subItems[currentEditSubIndex].folderName = newMenuName;
                    } else {
                        // Preserve original folder name
                        if (!cat.subItems[currentEditSubIndex].folderName) {
                            cat.subItems[currentEditSubIndex].folderName = oldMenuName;
                        }
                    }
                }

                await saveData();
                alert("정상적으로 저장되었습니다. 화면을 새로고침합니다.");
                try {
                    if (window.parent && window.parent !== window) {
                        window.parent.postMessage({ type: 'RELOAD_PORTAL' }, '*');
                    } else {
                        window.location.reload();
                    }
                } catch(e) {
                    window.location.reload();
                }
            } catch(e) {
                alert("파일 업로드 또는 저장에 실패했습니다.");
                console.error(e);
            } finally {
                btn.innerHTML = `변경 내용 저장`;
                btn.disabled = false;
            }
        }

        function changeAdminPw() {
            const newPw = document.getElementById('new-admin-pw').value;
            if (newPw.length < 4 || newPw.length > 8) {
                alert("비밀번호는 4~8자리 사이여야 합니다.");
                return;
            }
            localStorage.setItem("hansoll_admin_pw", newPw);
            alert("관리자 비밀번호가 성공적으로 변경되었습니다.");
            document.getElementById('new-admin-pw').value = "";
        }
    