"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { MenuItem, SubMenuItem } from "@/config/menu";

interface SidebarMenuItemProps {
  item: MenuItem;
}

function NestedSubMenuItem({ subItem, pathname }: { subItem: SubMenuItem; pathname: string }) {
  const isSubActive =
    pathname === subItem.href ||
    (subItem.children && subItem.children.some((child) => pathname === child.href));
  const [isOpen, setIsOpen] = useState(isSubActive || false);
  const router = useRouter();

  if (subItem.isHeader) {
    const handleHeaderClick = () => {
      setIsOpen(!isOpen);
      if (subItem.href) {
        router.push(subItem.href);
      }
    };

    return (
      <div className="mt-2 flex flex-col first:mt-0">
        <button
          onClick={handleHeaderClick}
          className={`relative flex items-center justify-between px-3 py-2 text-sm font-bold transition-colors select-none w-full text-left rounded-md ${
            pathname === subItem.href ? "text-blue-600 bg-blue-50" : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
          }`}
        >
          <div className="absolute left-[-16px] top-1/2 h-[1px] w-3 -translate-y-1/2 bg-slate-300" />
          <div className="absolute left-[-17px] top-[-16px] bottom-1/2 w-[1px] bg-slate-300" />
          <span className="truncate">{subItem.title}</span>
          {subItem.children && subItem.children.length > 0 && (
            isOpen ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          )}
        </button>
        {subItem.children && subItem.children.length > 0 && (
          <div
            className={`flex flex-col space-y-1 pl-4 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {subItem.children.map((child) => (
              <NestedSubMenuItem key={child.title} subItem={child} pathname={pathname} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = pathname === subItem.href;
  return (
    <Link
      href={subItem.href || "#"}
      className={`relative flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
        subItem.showHelpIcon ? "pl-6 text-[13px]" : ""
      } ${
        isActive
          ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
          : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
      }`}
    >
      <div
        className={`absolute top-1/2 h-[1px] -translate-y-1/2 bg-slate-300 ${
          subItem.showHelpIcon ? "left-[-8px] w-2" : "left-[-16px] w-3"
        }`}
      />
      <div className="absolute left-[-17px] top-[-16px] bottom-1/2 w-[1px] bg-slate-300" />

      <span className="truncate">{subItem.title}</span>
      {subItem.showHelpIcon && (
        <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-blue-500 transition-colors shrink-0 ml-1.5" />
      )}
    </Link>
  );
}

export default function SidebarMenuItem({ item }: SidebarMenuItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const Icon = item.icon;
  
  // Check if any sub-item or its children are currently active
  const isActive =
    pathname === `/${item.slug}` ||
    item.subItems.some(
      (sub) =>
        pathname.startsWith(sub.href || "") ||
        (sub.children && sub.children.some((child) => pathname.startsWith(child.href || "")))
    );
  
  const [isOpen, setIsOpen] = useState(isActive || false);

  const handleToggleClick = () => {
    setIsOpen(!isOpen);
    router.push(`/${item.slug}`);
  };

  return (
    <div className="mb-2 last:mb-0">
      <button
        onClick={handleToggleClick}
        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors duration-200 ${
          isActive || isOpen
            ? "bg-blue-50 text-blue-600"
            : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <span className="text-[15px] font-semibold">{item.title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {/* Accordion Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-1 flex flex-col space-y-1 pl-11 pr-3 pb-2 pt-1">
          {item.subItems.map((subItem) => (
            <NestedSubMenuItem key={subItem.title} subItem={subItem} pathname={pathname} />
          ))}
        </div>
      </div>
    </div>
  );
}
