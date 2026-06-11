export default function TrimChartComparePage() {
  return (
    <div className="flex h-[calc(100vh-140px)] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <iframe 
        src="/api/serve-html?type=trim" 
        className="h-full w-full border-0"
        title="부자재 공임차트 비교"
      />
    </div>
  );
}
