import { supabase } from "./supabase";
import { MenuItem, SubMenuItem } from "@/config/menu";
import { Briefcase, Users, Clipboard, Laptop, LayoutGrid, LucideIcon } from "lucide-react";

// Helper to map string icon names to actual Lucide components
function getIconComponent(iconName: string): LucideIcon {
  const lowerName = iconName?.toLowerCase();
  switch (lowerName) {
    case 'briefcase': return Briefcase;
    case 'users': return Users;
    case 'clipboard': return Clipboard;
    case 'laptop': return Laptop;
    default: return LayoutGrid;
  }
}

export async function fetchPortalMenu(): Promise<MenuItem[]> {
  try {
    const { data: flatData, error } = await supabase
      .from('MenuSetting')
      .select('*')
      .order('MenuId', { ascending: true }); // Base ordering

    if (error) {
      console.error("Error fetching menu from Supabase:", error);
      return [];
    }

    if (!flatData || flatData.length === 0) {
      return [];
    }

    // Filter out inactive items right at the beginning
    const activeData = flatData.filter(d => d.YN_use !== false);

    if (activeData.length === 0) {
      return [];
    }

    // 1. Get root categories
    const categories = activeData.filter(d => d.menu_type === 'category' || d.menu_type === '카테고리');
    categories.sort((a, b) => ((a.menu_meta && a.menu_meta.sortOrder) || 0) - ((b.menu_meta && b.menu_meta.sortOrder) || 0));

    const reconstructedData: MenuItem[] = categories.map(cat => {
      const meta = cat.menu_meta || {};
      
      // 2. Get direct children of this category
      const rawSubItems = activeData.filter(
        sub => sub.menu_type !== '카테고리' && 
               sub.menu_type !== 'category' && 
               sub.menu_meta?.parentCategory === cat.menu_name
      );

      const processedSubItems: SubMenuItem[] = [];
      const headers = rawSubItems.filter(sub => sub.menu_type === 'header' || sub.menu_type === '헤더');
      const itemsWithoutHeader = rawSubItems.filter(sub => sub.menu_type !== 'header' && sub.menu_type !== '헤더' && !sub.menu_meta?.parentHeader);

      // Handle Headers
      headers.forEach(header => {
        const headerMeta = header.menu_meta || {};
        const children = rawSubItems.filter(sub => sub.menu_meta?.parentHeader === header.menu_name).map(child => {
          const childMeta = child.menu_meta || {};
          return {
            title: child.menu_name,
            href: child.url_address || `/${meta.slug || 'brand'}/${childMeta.slug || child.MenuId}`,
            description: childMeta.description || "",
            showHelpIcon: childMeta.showHelpIcon !== false, // default true
          };
        });

        processedSubItems.push({
          title: header.menu_name,
          isHeader: true,
          href: header.url_address || `/${meta.slug || 'brand'}/${headerMeta.slug || header.MenuId}`,
          children: children,
        });
      });

      // Handle direct items
      itemsWithoutHeader.forEach(item => {
        const itemMeta = item.menu_meta || {};
        processedSubItems.push({
          title: item.menu_name,
          href: item.url_address || `/${meta.slug || 'brand'}/${itemMeta.slug || item.MenuId}`,
          description: itemMeta.description || "",
          showHelpIcon: itemMeta.showHelpIcon !== false,
        });
      });

      // Re-sort subItems if sortOrder exists
      processedSubItems.sort((a, b) => {
        const aOrder = rawSubItems.find(r => r.menu_name === a.title)?.menu_meta?.sortOrder || 0;
        const bOrder = rawSubItems.find(r => r.menu_name === b.title)?.menu_meta?.sortOrder || 0;
        return aOrder - bOrder;
      });

      return {
        title: cat.menu_name,
        slug: meta.slug || cat.menu_name.toLowerCase(),
        imageUrl: meta.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200",
        icon: getIconComponent(meta.icon),
        subItems: processedSubItems
      };
    });

    return reconstructedData;

  } catch (error) {
    console.error("Failed to fetch portal menu", error);
    return [];
  }
}
