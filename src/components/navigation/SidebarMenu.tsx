"use client";

import { portalMenu } from "@/config/menu";
import SidebarMenuItem from "./SidebarMenuItem";

export default function SidebarMenu() {
  return (
    <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      <div className="space-y-1">
        <p className="px-4 pb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
          Portal Menu
        </p>
        <div className="relative border-l border-slate-200 ml-4">
          <div className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
          <div className="-ml-4">
            {portalMenu.map((item) => (
              <SidebarMenuItem key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
