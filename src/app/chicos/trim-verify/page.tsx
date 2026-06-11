export default function ChicosTrimVerifyPage() {
  return (
    <div className="flex h-[calc(100vh-140px)] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <iframe 
        src="/chicos_trim_verify.html" 
        className="h-full w-full border-0"
        title="Chico's 부자재 교차 검증"
      />
    </div>
  );
}
