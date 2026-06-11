import { Hammer } from "lucide-react";

export default function Dept7Page() {
  return (
    <div className="flex h-[calc(100vh-140px)] w-full flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="flex flex-col items-center text-center p-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 mb-6 border border-blue-100 shadow-inner">
          <Hammer className="h-10 w-10 text-blue-500" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-800 mb-3">기능 준비중</h3>
        <p className="text-slate-500 max-w-sm leading-relaxed">
          현재 <strong>사업 7부</strong> 모듈은 기능 개발 및 테스트가 진행 중입니다.<br />
          보다 나은 서비스로 곧 찾아뵙겠습니다.
        </p>
      </div>
    </div>
  );
}
