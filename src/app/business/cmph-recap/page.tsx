"use client";

import { useState } from "react";
import { Play, CheckCircle, AlertTriangle, HelpCircle, Terminal } from "lucide-react";

export default function CmphRecapPage() {
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRun = async () => {
    setStatus("running");
    try {
      const res = await fetch("/api/run-py", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "실행 중 오류가 발생했습니다.");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "서버와 통신하는 동안 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-140px)] items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-2xl bg-white border border-slate-200/80 rounded-3xl shadow-xl p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Glow decoration */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-purple-100 rounded-full blur-3xl opacity-60 z-0" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-md border border-purple-100/50">
            <Terminal className="h-10 w-10 fill-purple-600/10" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">
            CMPH Recap 작성 도구 (Python)
          </h2>
          <p className="text-sm font-medium text-slate-500 max-w-md leading-relaxed mb-8">
            Python 스크립트를 직접 구동하여 데이터를 처리합니다.
          </p>

          <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-slate-400" />
              실행 안내 및 파일 경로
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="text-purple-500 font-bold shrink-0">·</span>
                <span><strong>실행 파일:</strong> <code className="bg-slate-200/60 px-1.5 py-0.5 rounded text-xs font-mono">Project files\\사업 3부\\CMPH Recap Tool\\CMPH_Recap_Tool.py</code></span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500 font-bold shrink-0">·</span>
                <span>실행 시 백그라운드 로컬 서버 환경에서 파이썬 스크립트가 실행됩니다.</span>
              </li>
            </ul>
          </div>

          {status === "idle" && (
            <button
              onClick={handleRun}
              className="flex items-center justify-center gap-2.5 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/20 hover:scale-[1.02] hover:shadow-xl transition-all duration-200 w-full max-w-sm"
            >
              <Play className="h-5 w-5 fill-white" />
              Python 스크립트 가동하기
            </button>
          )}

          {status === "running" && (
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600 mb-3" />
              <span className="text-sm font-semibold text-purple-600">프로그램 실행 요청 중...</span>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center animate-fade-in-up">
              <div className="flex items-center gap-2 px-6 py-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 mb-5">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-bold">로컬 파이썬 환경에서 프로그램이 정상 실행되었습니다.</span>
              </div>
              <button
                onClick={() => setStatus("idle")}
                className="text-xs font-semibold text-slate-400 hover:text-purple-600 transition-colors"
              >
                다시 실행하기
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center animate-fade-in-up">
              <div className="flex items-center gap-2 px-6 py-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 mb-5">
                <AlertTriangle className="h-5 w-5 animate-bounce" />
                <span className="text-sm font-bold">{errorMsg}</span>
              </div>
              <button
                onClick={handleRun}
                className="px-6 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 transition-colors"
              >
                재시도
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
