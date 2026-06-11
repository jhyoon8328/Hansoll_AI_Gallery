"use client";

export default function MainPageTest() {
  return (
    <div className="w-full h-[calc(100vh-130px)] rounded-3xl mt-4 shadow-xl border border-slate-200 overflow-hidden bg-white">
      <iframe 
        src="/mainPageTest.html" 
        className="w-full h-full border-none"
        title="Main Page TEST"
      />
    </div>
  );
}
