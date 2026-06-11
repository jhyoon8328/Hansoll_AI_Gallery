"use client";

import { Bell, Moon, Search, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { portalMenu } from "@/config/menu";

export default function Header() {
  const pathname = usePathname();

  // Simple breadcrumb logic based on the current path
  let breadcrumbPrimary = "대시보드";
  let breadcrumbSecondary = "";

  portalMenu.forEach((item) => {
    if (pathname === `/${item.slug}`) {
      breadcrumbPrimary = item.title;
      breadcrumbSecondary = "개요";
    } else {
      const subItem = item.subItems.find((sub) => sub.href && pathname.startsWith(sub.href));
      if (subItem) {
        breadcrumbPrimary = item.title;
        breadcrumbSecondary = subItem.title;
      }
    }
  });

  if (pathname === "/") {
    breadcrumbPrimary = "시스템 관리";
    breadcrumbSecondary = "대시보드";
  }

  return (
    <header className="sticky top-0 z-30 flex h-[70px] w-full items-center justify-between bg-white border-b border-slate-200/80 px-4 sm:px-8 transition-all duration-300">
      {/* Left section: Mobile menu toggle (future) + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center text-sm font-medium text-slate-500">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">
            {breadcrumbPrimary}
          </span>
          {breadcrumbSecondary && (
            <>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900 font-semibold">{breadcrumbSecondary}</span>
            </>
          )}
        </div>
      </div>

      {/* Right section: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="메뉴 검색..."
            className="h-9 w-48 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>

        <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
          <Moon className="h-5 w-5" />
        </button>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        <button className="ml-1 flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 hover:bg-slate-50 transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-slate-700 hidden sm:block">관리자</span>
        </button>
      </div>
    </header>
  );
}
