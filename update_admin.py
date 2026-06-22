import os

with open('adminPage.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Modify window.onload
old_onload = 'window.onload = loadMenuData;'
new_onload = '''window.onload = async () => {
    await loadMenuData();
    const activeTab = sessionStorage.getItem('admin_active_tab') || 'home';
    switchTab(activeTab);
};'''
content = content.replace(old_onload, new_onload)

# 2. Modify switchTab
old_switch = '''        function switchTab(tabId) {
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
        }'''
new_switch = '''        function switchTab(tabId) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content, #tab-home, #tab-menu, #tab-password').forEach(c => {
                c.classList.remove('block');
                c.classList.add('hidden');
            });

            if (window.event && window.event.target && window.event.target.classList.contains('tab-btn')) {
                window.event.target.classList.add('active');
            } else {
                const btn = document.querySelector(`.tab-btn[onclick*="switchTab('${tabId}')"]`);
                if(btn) btn.classList.add('active');
            }

            const target = document.getElementById('tab-' + tabId);
            if(target) {
                target.classList.remove('hidden');
                target.classList.add('block');
            }
            
            sessionStorage.setItem('admin_active_tab', tabId);
            
            if(tabId === 'home') renderDashboard();
        }'''
content = content.replace(old_switch, new_switch)

# 3. Modify RELOAD_PORTAL to UPDATE_PORTAL_MENU and remove 'else' structure where necessary
content = content.replace("type: 'RELOAD_PORTAL'", "type: 'UPDATE_PORTAL_MENU'")

content = content.replace('''            try {
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'UPDATE_PORTAL_MENU' }, '*');
                } else {
                    window.location.reload();
                }
            } catch(e) {
                window.location.reload();
            }''', '''            try {
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'UPDATE_PORTAL_MENU' }, '*');
                }
                window.location.reload();
            } catch(e) {
                window.location.reload();
            }''')

content = content.replace('''                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'UPDATE_PORTAL_MENU' }, '*');
                } else {
                    window.location.reload();
                }''', '''                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'UPDATE_PORTAL_MENU' }, '*');
                }
                window.location.reload();''')

with open('adminPage.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
