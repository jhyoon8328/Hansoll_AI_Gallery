const fs = require('fs/promises');
const path = require('path');

const SUPABASE_URL = 'https://yuklsrhmcbdanswxysrw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1a2xzcmhtY2JkYW5zd3h5c3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTgwODQsImV4cCI6MjA5NjYzNDA4NH0.PEgzBsLD6Or7P32ao6LaKgSmf-SE1ay829eFQpkzhgE';

async function migrate() {
    const filePath = path.join(process.cwd(), '.data', 'menuData.json');
    let menuData;
    try {
        const raw = await fs.readFile(filePath, 'utf-8');
        menuData = JSON.parse(raw);
    } catch (e) {
        console.error("Failed to read menuData.json:", e.message);
        return;
    }

    const records = [];

    // Flatten to rows for MenuSetting table
    menuData.forEach((cat, index) => {
        // Category row
        records.push({
            MenuId: 'cat_' + Date.now() + '_' + index,
            menu_path: cat.title,
            menu_name: cat.title,
            menu_type: 'category',
            file_path: null,
            url_address: null,
            YN_use: (cat.status || 'Y') === 'Y',
            menu_meta: {
                slug: cat.slug,
                imageUrl: cat.imageUrl,
                icon: cat.icon,
                displayPhrase: cat.displayPhrase,
                bgColor: cat.bgColor,
                textColor: cat.textColor
            }
        });

        // Subitem rows
        if (cat.subItems) {
            cat.subItems.forEach((sub, subIndex) => {
                let subTitle = typeof sub === 'string' ? sub : sub.title;
                let subDesc = typeof sub === 'string' ? null : sub.description;
                let subStatus = typeof sub === 'string' ? 'Y' : (sub.status || 'Y');
                let subFile = typeof sub === 'string' ? null : sub.fileName;
                let menuId = (typeof sub === 'object' && sub.menuId) ? sub.menuId : subTitle;

                records.push({
                    MenuId: menuId,
                    menu_path: cat.title,
                    menu_name: subTitle,
                    menu_type: 'subitem',
                    file_path: subFile,
                    url_address: null,
                    YN_use: subStatus === 'Y',
                    menu_meta: {
                        description: subDesc
                    }
                });
            });
        }
    });

    console.log(`Migrating ${records.length} records to MenuSetting table...`);

    // UPSERT
    const res = await fetch(`${SUPABASE_URL}/rest/v1/MenuSetting`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(records)
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("Migration failed:", text);
    } else {
        console.log("Migration successful!");
    }
}

migrate();
