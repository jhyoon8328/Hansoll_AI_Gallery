"use client";

import Image from "next/image";

export default function WelcomeCard() {
  return (
    <div className="relative mx-auto w-full max-w-[900px] overflow-hidden rounded-2xl bg-slate-900 shadow-xl shadow-blue-900/10 mb-8 h-[240px]">
      {/* Background Image / Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900" />
        {/* Placeholder for an actual background image. Next.js requires width/height for Image, 
            or layout="fill". We'll use a pure CSS gradient + pattern for the "actual enterprise portal" feel 
            if an image is not available, but the prompt asked for a background image. 
            We'll use a CSS pattern that looks like a high-tech overlay for now. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Dark Overlay as requested */}
      <div className="absolute inset-0 z-10 bg-black/30 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-end pb-8 text-center px-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
          Hansoll AI System
        </h2>
        <p className="mt-3 max-w-lg text-sm sm:text-base font-medium text-slate-200 drop-shadow">
          좌측 카테고리를 선택하여<br className="sm:hidden" /> 관리 시스템을 실행해 주세요.
        </p>
      </div>
    </div>
  );
}
