"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <span className="text-xl font-bold tracking-tight">H</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-indigo-600">
                Hansoll <span className="font-medium text-slate-500">Portal</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-200"
            >
              핵심 기능
            </Link>
            <Link
              href="#metrics"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-200"
            >
              성과 지표
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-200"
            >
              고객 후기
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors duration-200">
              로그인
            </button>
            <button className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95 transition-all duration-200">
              시작하기
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none transition-colors duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">메뉴 열기</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-slate-100 bg-white ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        id="mobile-menu"
      >
        <div className="space-y-1.5 px-4 pt-2 pb-5">
          <Link
            href="#features"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
          >
            핵심 기능
          </Link>
          <Link
            href="#metrics"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
          >
            성과 지표
          </Link>
          <Link
            href="#testimonials"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
          >
            고객 후기
          </Link>
          <div className="mt-4 flex flex-col gap-2.5 px-3 border-t border-slate-100 pt-4">
            <button className="w-full text-center py-2.5 text-base font-semibold text-slate-700 hover:text-indigo-600 transition-colors duration-200">
              로그인
            </button>
            <button className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 py-3 text-base font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition-all duration-200">
              시작하기
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
