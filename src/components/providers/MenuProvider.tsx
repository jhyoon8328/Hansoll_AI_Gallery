"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MenuItem } from "@/config/menu";
import { fetchPortalMenu } from "@/lib/menuFetcher";
import { portalMenu as defaultPortalMenu } from "@/config/menu";

interface MenuContextType {
  menuData: MenuItem[];
  isLoading: boolean;
}

const MenuContext = createContext<MenuContextType>({
  menuData: defaultPortalMenu,
  isLoading: true,
});

export const useMenu = () => useContext(MenuContext);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const fetchedMenu = await fetchPortalMenu();
        if (fetchedMenu && fetchedMenu.length > 0) {
          setMenuData(fetchedMenu);
        } else {
          console.warn("Supabase returned empty menu. Check .env variables or network.");
        }
      } catch (error) {
        console.error("Menu fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadMenu();
  }, []);

  return (
    <MenuContext.Provider value={{ menuData, isLoading }}>
      {children}
    </MenuContext.Provider>
  );
}
