"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, BrainCircuit, Bot, FileText, ScanSearch, Wand2, 
  FileSpreadsheet, ArrowRight, UploadCloud, CheckCircle2, ListChecks 
} from "lucide-react";

// --- Mockup Components ---

const CMPHMockup = () => (
  <div className="w-full h-full min-h-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in-up">
    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
      <div className="flex items-center gap-2">
        <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
        <span className="font-bold text-slate-700 text-sm">CMPH Recap Auto-Parser</span>
      </div>
      <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
        Ready
      </div>
    </div>
    <div className="flex-1 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors cursor-pointer mb-6">
        <UploadCloud className="h-10 w-10 text-slate-400 mb-3" />
        <p className="text-sm font-bold text-slate-600">Tech Pack PDF 업로드</p>
        <p className="text-xs text-slate-400 mt-1">이곳에 파일을 드래그 앤 드롭 하세요</p>
      </div>
      <button className="w-full max-w-sm flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl shadow-md shadow-emerald-500/20 font-bold transition-all hover:-translate-y-0.5">
        <Wand2 className="h-4 w-4" />
        데이터 추출 및 엑셀 작성
      </button>
    </div>
  </div>
);

const PODiffMockup = () => (
  <div className="w-full h-full min-h-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in-up">
    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
      <div className="flex items-center gap-2">
        <ScanSearch className="h-5 w-5 text-blue-600" />
        <span className="font-bold text-slate-700 text-sm">PO Diff Analyzer</span>
      </div>
      <div className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
        Analyzing
      </div>
    </div>
    <div className="flex-1 p-6 flex flex-col">
      <div className="grid grid-cols-2 gap-4 mb-6 flex-1">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col relative overflow-hidden">
          <span className="text-xs font-bold text-slate-400 mb-2 uppercase">Old Version (PO)</span>
          <div className="w-full h-4 bg-slate-200 rounded mb-2"></div>
          <div className="w-3/4 h-4 bg-slate-200 rounded mb-2"></div>
          <div className="w-5/6 h-4 bg-rose-100 rounded mb-2 border border-rose-200"></div>
          <div className="w-full h-4 bg-slate-200 rounded"></div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col relative overflow-hidden">
          <span className="text-xs font-bold text-slate-400 mb-2 uppercase">New Version (CPO)</span>
          <div className="w-full h-4 bg-slate-200 rounded mb-2"></div>
          <div className="w-3/4 h-4 bg-slate-200 rounded mb-2"></div>
          <div className="w-5/6 h-4 bg-emerald-100 rounded mb-2 border border-emerald-200 relative">
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div className="w-full h-4 bg-slate-200 rounded"></div>
        </div>
      </div>
      <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl shadow-md shadow-blue-500/20 font-bold transition-all hover:-translate-y-0.5">
        <ScanSearch className="h-4 w-4" />
        변경 내역 리포트 생성
      </button>
    </div>
  </div>
);

const TrimVerifyMockup = () => (
  <div className="w-full h-full min-h-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in-up">
    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
      <div className="flex items-center gap-2">
        <ListChecks className="h-5 w-5 text-purple-600" />
        <span className="font-bold text-slate-700 text-sm">Trim Data Verifier</span>
      </div>
      <div className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
        Verified
      </div>
    </div>
    <div className="flex-1 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-6 bg-purple-50 p-4 rounded-xl border border-purple-100">
        <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-5 w-5 text-purple-700" />
        </div>
        <div>
          <p className="text-sm font-bold text-purple-900">교차 검증 완료</p>
          <p className="text-xs text-purple-700/80">공임 차트와 부자재 시트 간 3개의 불일치 항목 발견</p>
        </div>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 border border-slate-100 rounded-lg flex items-start justify-between hover:bg-slate-50 transition-colors">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-700">Button Item #{1042 + i}</span>
              <span className="text-[11px] text-slate-500">BOM 수량: 120ea / Excel 수량: 100ea</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-600">Mismatch</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Main Page Component ---

export default function Dept3PlaygroundPage() {
  const [activeTab, setActiveTab] = useState("cmph");

  const tabs = [
    { id: "cmph", label: "CMPH Recap", icon: FileSpreadsheet, mockup: CMPHMockup },
    { id: "po", label: "PO Analyzer", icon: ScanSearch, mockup: PODiffMockup },
    { id: "trim", label: "Trim Verify", icon: ListChecks, mockup: TrimVerifyMockup },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-[#fdfbf7] relative overflow-hidden flex flex-col items-center">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/30 blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-200/30 blur-[120px] pointer-events-none mix-blend-multiply" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_70%,transparent_100%)]"></div>

      <div className="w-full max-w-6xl px-6 py-12 relative z-10 flex flex-col items-center" style={{ zoom: 0.7 }}>
        
        {/* Floating Badges */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-10 left-10 hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-white/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-bold text-slate-600">Vibe Coding</span>
        </motion.div>
        
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-24 right-10 hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-white/40"
        >
          <Bot className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-bold text-slate-600">Internal AI Lab</span>
        </motion.div>

        {/* Hero Section */}
        <div className="text-center mb-16 mt-8 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 shadow-inner border border-white"
          >
            <BrainCircuit className="h-10 w-10 text-indigo-600" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4 font-cafe24 leading-tight"
          >
            Business Division 3 <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI Playground</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 font-medium max-w-2xl font-sans"
          >
            사업 3부에서 직접 만든 <strong className="text-slate-700">바이브코딩 결과물</strong>입니다.<br />
            업무를 더 편하게 만드는 작은 AI 도구들을 체험해 보세요.
          </motion.p>
        </div>

        {/* Interactive Layout Area */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation / Intro Side */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">어떤 작업을 자동화할까요?</h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                PDF 파싱부터 엑셀 비교 검증까지, 실무에서 발생하는 반복 작업을 AI가 똑똑하게 해결해 줍니다.
              </p>
              
              <div className="flex flex-col gap-3">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left overflow-hidden ${
                        isActive 
                          ? "bg-white shadow-md border-transparent text-blue-700 ring-1 ring-blue-100" 
                          : "bg-transparent hover:bg-white/50 border border-slate-200/50 text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="active-tab-indicator"
                          className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 z-0"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="relative z-10 flex-1">
                        <span className="font-bold block">{tab.label}</span>
                      </div>
                      <div className={`relative z-10 transition-transform duration-300 ${isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Main Showcase Area */}
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7 flex flex-col"
          >
            <div className="relative w-full h-[500px] bg-slate-100/50 rounded-3xl border-2 border-white shadow-xl p-2 sm:p-6 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {tabs.map((tab) => (
                  activeTab === tab.id && (
                    <motion.div
                      key={tab.id}
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="w-full max-w-md"
                    >
                      <tab.mockup />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 mb-8 text-center"
        >
          <p className="text-2xl font-nanum text-slate-600 tracking-wider">
            "사업 3부는 오늘도 실무를 더 편하게 만드는 AI를 연구중입니다 ✨"
          </p>
        </motion.div>

      </div>
    </div>
  );
}
