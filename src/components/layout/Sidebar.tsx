"use client";

import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import SidebarMenu from "../navigation/SidebarMenu";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-[280px] flex flex-col bg-white border-r border-slate-200/80 shadow-[1px_0_10px_rgba(0,0,0,0.02)] transition-transform duration-300 md:translate-x-0 -translate-x-full">
      {/* Sidebar Header / Logo */}
      <div className="flex h-[70px] shrink-0 items-center border-b border-slate-100 px-6">
        <Link href="/" className="flex items-center gap-3 group w-full">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-xs font-bold uppercase tracking-wider text-slate-500">
              Hansoll Textile
            </span>
            <span className="truncate text-[17px] font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
              AI PORTAL
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <SidebarMenu />

      {/* Sidebar Footer */}
      <div className="border-t border-slate-100 p-4 shrink-0 bg-slate-50/50">
        <div className="rounded-lg bg-blue-50 p-3 text-center border border-blue-100/50">
          <p className="text-xs font-semibold text-blue-700">시스템 지원이 필요하신가요?</p>
          <a href="mailto:support@hansoll.com" className="mt-1 block text-xs text-blue-500 hover:text-blue-700 hover:underline">
            IT Help Desk 문의
          </a>
        </div>
      </div>
    </aside>
  );
}
