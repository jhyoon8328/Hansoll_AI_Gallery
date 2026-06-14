"use client";

import { ReactNode, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { MenuProvider } from "../providers/MenuProvider";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isIframe, setIsIframe] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsIframe(window.self !== window.top);
    }
  }, []);

  // To prevent hydration mismatch, we render a simple shell initially
  if (!mounted) {
    return <div className="flex h-screen w-full bg-[#f5f7fb]" />;
  }

  if (isIframe) {
    return (
      <div className="flex min-h-screen w-full bg-[#f5f5f0] overflow-y-auto">
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    );
  }

  return (
    <MenuProvider>
      <div className="flex h-screen w-full overflow-hidden bg-[#f5f7fb]">
        {/* Fixed Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col md:ml-[280px] w-full transition-all duration-300">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="mx-auto max-w-7xl w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </MenuProvider>
  );
}
