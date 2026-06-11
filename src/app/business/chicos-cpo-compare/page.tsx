export default function ChicosCpoComparePage() {
  return (
    <div className="flex h-[calc(100vh-140px)] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <iframe 
        src="/api/serve-html?type=chicos" 
        className="h-full w-full border-0"
        title="Chico's CPO 파일 비교"
      />
    </div>
  );
}
