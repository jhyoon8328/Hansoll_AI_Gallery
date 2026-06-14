"use client";

import { useMenu } from "@/components/providers/MenuProvider";
import SidebarMenuItem from "./SidebarMenuItem";

export default function SidebarMenu() {
  const { menuData, isLoading } = useMenu();

  if (isLoading) {
    return (
      <nav className="flex-1 p-4">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-slate-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      <div className="space-y-1">
        <p className="px-4 pb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
          Portal Menu
        </p>
        <div className="relative border-l border-slate-200 ml-4">
          <div className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
          <div className="-ml-4">
            {menuData.map((item) => (
              <SidebarMenuItem key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
