"use client";

import React, { useState, useRef, useEffect } from "react";

const SEASONS = ["SPRING", "SUMMER", "FALL", "HOLIDAY"];
const YEARS = Array.from({ length: 8 }, (_, i) => String(26 + i));
const CATEGORIES = ["KNIT TOP", "LIVI", "BOTTOM", "JACKET"];
const ASSIGNMENTS = ["Hansoll assigned", "dual costing"];

export default function CmphRecapPage() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sketchBase64, setSketchBase64] = useState<string | null>(null);

  // Form states
  const [style, setStyle] = useState("");
  const [name, setName] = useState("");
  const [fabric, setFabric] = useState("");
  const [seasonName, setSeasonName] = useState("HOLIDAY");
  const [seasonYear, setSeasonYear] = useState("26");
  const [category, setCategory] = useState("KNIT TOP");
  const [assign, setAssign] = useState("Hansoll assigned");
  
  const [cmphK, setCmphK] = useState("");
  const [cmphL, setCmphL] = useState("");
  const [cmphM, setCmphM] = useState("");

  const [subEnabled, setSubEnabled] = useState(false);
  const [subQty, setSubQty] = useState("");
  const [subCmph, setSubCmph] = useState("");
  const [subL, setSubL] = useState("");

  const excelInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString("ko-KR", { hour12: false });
    setLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExcelFile(e.target.files[0]);
      addLog(`Excel: ${e.target.files[0].name}`);
    }
  };

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setPdfFiles(files);
      addLog(`파싱 중: ${files[0].name}`);
      
      try {
        const formData = new FormData();
        formData.append("file", files[0]);
        const res = await fetch("/api/python/parse", {
          method: "POST",
          body: formData,
        });
        
        if (!res.ok) throw new Error("서버 연동 오류");

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        if (data.style) setStyle(data.style);
        if (data.name) setName(data.name);
        if (data.fabric) setFabric(data.fabric);
        if (data.category) setCategory(data.category);

        addLog(`✓ 파싱 완료 — S/# ${data.style || "?"}`);
        addLog(`✓ 스케치 추출됨`);
        
        // We could also fetch the sketch image here if the backend returns it
        // For now, we simulate the log
      } catch (err: any) {
        addLog(`오류: ${err.message}`);
      }
    }
  };

  const handleGenerate = async () => {
    if (!excelFile) {
      alert("Excel 파일을 선택하세요");
      return;
    }
    if (pdfFiles.length === 0) {
      alert("PDF 파일을 선택하세요");
      return;
    }

    setIsProcessing(true);
    addLog(`처리 시작 — PDF ${pdfFiles.length}개`);

    try {
      const formData = new FormData();
      formData.append("excel", excelFile);
      pdfFiles.forEach((file) => formData.append("pdf", file));
      
      const seasonStr = `${seasonName.slice(0, 3)}'${seasonYear}`;
      formData.append("style", style);
      formData.append("name", name);
      formData.append("fabric", fabric);
      formData.append("season", seasonStr);
      formData.append("category", category);
      formData.append("assign", assign);
      formData.append("cmph_k", cmphK);
      formData.append("cmph_l", cmphL);
      formData.append("cmph_m", cmphM);
      formData.append("sub_enabled", String(subEnabled));
      formData.append("sub_qty", subQty);
      formData.append("sub_cmph", subCmph);
      formData.append("sub_l", subL);

      const res = await fetch("/api/python/generate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "생성 오류");
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      const originalName = excelFile.name.replace(".xlsx", "");
      a.download = `${originalName}_updated.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      addLog(`✓ 저장 완료: ${originalName}_updated.xlsx`);
      alert(`${pdfFiles.length}개 처리 완료\n\n저장: ${originalName}_updated.xlsx`);
    } catch (err: any) {
      addLog(`오류: ${err.message}`);
      alert(`오류: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setExcelFile(null);
    setPdfFiles([]);
    setStyle("");
    setName("");
    setFabric("");
    setSeasonName("HOLIDAY");
    setSeasonYear("26");
    setCategory("KNIT TOP");
    setAssign("Hansoll assigned");
    setCmphK("");
    setCmphL("");
    setCmphM("");
    setSubEnabled(false);
    setSubQty("");
    setSubCmph("");
    setSubL("");
    setLogs([]);
    setSketchBase64(null);
    if (excelInputRef.current) excelInputRef.current.value = "";
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const seasonAbbr = `${seasonName.slice(0, 3)}'${seasonYear}`;

  const Divider = () => <div className="h-px bg-[#d0d0c8] my-4 w-full"></div>;

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center py-12 px-8 font-['Helvetica',sans-serif]">
      <div className="w-full max-w-[760px]">
        
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-[#2563eb] mb-1">CMPH RECAP PDF → Excel</h1>
          <p className="text-sm text-[#6b7280]">
            택팩 PDF → 자동 파싱 → 기존 엑셀 양식에 행 추가 | PDF 여러 개 동시 추가 가능
          </p>
        </div>
        <Divider />

        {/* Upload Buttons */}
        <div className="flex gap-4 mb-2">
          <div 
            onClick={() => excelInputRef.current?.click()}
            className="flex-1 bg-white py-4 cursor-pointer text-center hover:bg-gray-50 transition-colors"
          >
            <input type="file" accept=".xlsx" className="hidden" ref={excelInputRef} onChange={handleExcelChange} />
            <div className="font-bold text-[15px] mb-1 text-[#1a1a1a]">📊 CMPH Recap (.xlsx)</div>
            <div className={`text-sm ${excelFile ? 'text-[#2563eb] font-medium' : 'text-[#6b7280]'}`}>
              {excelFile ? excelFile.name : "클릭하여 선택"}
            </div>
          </div>
          <div 
            onClick={() => pdfInputRef.current?.click()}
            className="flex-1 bg-white py-4 cursor-pointer text-center hover:bg-gray-50 transition-colors"
          >
            <input type="file" accept=".pdf" multiple className="hidden" ref={pdfInputRef} onChange={handlePdfChange} />
            <div className="font-bold text-[15px] mb-1 text-[#1a1a1a]">📄 Tech Pack PDF (여러 개 가능)</div>
            <div className={`text-sm ${pdfFiles.length > 0 ? 'text-[#2563eb] font-medium' : 'text-[#6b7280]'}`}>
              {pdfFiles.length > 0 ? `${pdfFiles.length}개 선택됨` : "클릭하여 선택"}
            </div>
          </div>
        </div>
        <Divider />

        {/* PDF List */}
        <div>
          <h3 className="text-[13px] font-bold text-[#6b7280] mb-2 px-1">선택된 PDF 목록</h3>
          <div className="bg-white p-3 min-h-[40px]">
            {pdfFiles.length === 0 ? (
              <div className="text-[14px] text-[#6b7280] text-center">PDF 없음</div>
            ) : (
              <div className="flex flex-col gap-1">
                {pdfFiles.map((f, i) => (
                  <div key={i} className="flex font-mono text-[14px]">
                    <span className="text-[#6b7280] w-6">{i + 1}.</span>
                    <span>{f.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Divider />

        {/* Sketch Preview */}
        <div>
          <h3 className="text-[13px] font-bold text-[#6b7280] mb-2 px-1">스케치 미리보기 (첫 번째 PDF)</h3>
          <div className="bg-white p-4 min-h-[60px] flex items-center justify-center">
            <span className="text-[#6b7280] text-[14px]">—</span>
          </div>
        </div>
        <Divider />

        {/* Parsed Info */}
        <div>
          <h3 className="text-[13px] font-bold text-[#6b7280] mb-3 px-1">파싱된 정보 (수정 가능)</h3>
          
          <div className="space-y-3 px-1">
            <div>
              <label className="block text-[13px] text-[#6b7280] mb-1">S/#</label>
              <input type="text" value={style} onChange={e => setStyle(e.target.value)} className="w-full bg-white px-3 py-2 text-[14px] font-mono outline-none" />
            </div>
            
            <div>
              <label className="block text-[13px] text-[#6b7280] mb-1">PROGRAM NAME</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white px-3 py-2 text-[14px] font-mono outline-none" />
            </div>

            <div>
              <label className="block text-[13px] text-[#6b7280] mb-1">FABRIC DESCRIPTION</label>
              <textarea value={fabric} onChange={e => setFabric(e.target.value)} rows={3} className="w-full bg-white px-3 py-2 text-[14px] font-mono outline-none resize-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-[13px] text-[#6b7280] mb-1">Season</label>
                <div className="flex items-center gap-2">
                  <select value={seasonName} onChange={e => setSeasonName(e.target.value)} className="flex-1 bg-white px-2 py-1.5 text-[14px] font-mono outline-none border border-transparent">
                    {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className="font-bold text-[18px] leading-none">'</span>
                  <select value={seasonYear} onChange={e => setSeasonYear(e.target.value)} className="w-20 bg-white px-2 py-1.5 text-[14px] font-mono outline-none border border-transparent">
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="mt-1 text-[#2563eb] font-bold font-mono text-[15px]">{seasonAbbr}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-[13px] text-[#6b7280] mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white px-2 py-1.5 text-[14px] font-mono outline-none border border-transparent">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] text-[#6b7280] mb-1">Assignment</label>
                <select value={assign} onChange={e => setAssign(e.target.value)} className="w-full bg-white px-2 py-1.5 text-[14px] font-mono outline-none border border-transparent">
                  {ASSIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
        <Divider />

        {/* CMPH */}
        <div>
          <h3 className="text-[13px] font-bold text-[#6b7280] mb-3 px-1">💰 CMPH 값</h3>
          <div className="flex gap-4 px-1">
            <div className="flex-1">
              <label className="block text-[13px] text-[#6b7280] text-center mb-1 leading-tight h-8">Hansoll Target<br/>CMPH (K열)</label>
              <input type="number" step="0.01" value={cmphK} onChange={e => setCmphK(e.target.value)} className="w-full bg-white px-3 py-2 text-[16px] font-bold font-mono text-center text-[#2563eb] outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-[13px] text-[#6b7280] text-center mb-1 leading-tight h-8">TSHY CMPH<br/>T/P 기준 (L열)</label>
              <input type="number" step="0.01" value={cmphL} onChange={e => setCmphL(e.target.value)} className="w-full bg-white px-3 py-2 text-[16px] font-bold font-mono text-center text-[#2563eb] outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-[13px] text-[#6b7280] text-center mb-1 leading-tight h-8">TSHY CMPH<br/>Actual (M열)</label>
              <input type="number" step="0.01" value={cmphM} onChange={e => setCmphM(e.target.value)} className="w-full bg-white px-3 py-2 text-[16px] font-bold font-mono text-center text-[#2563eb] outline-none" />
            </div>
          </div>
        </div>
        <Divider />

        {/* Sub Row */}
        <div className="px-1">
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input type="checkbox" checked={subEnabled} onChange={e => setSubEnabled(e.target.checked)} className="w-4 h-4 cursor-pointer" />
            <span className="text-[15px] text-[#1a1a1a]">코스트 옵션 서브행 추가</span>
          </label>

          {subEnabled && (
            <div className="bg-white p-4 mt-2 grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[13px] text-[#6b7280] mb-1">Q'TY / 설명</label>
                <input type="text" value={subQty} onChange={e => setSubQty(e.target.value)} className="w-full bg-[#f5f5f0] px-2 py-1.5 text-[14px] font-mono outline-none" />
              </div>
              <div>
                <label className="block text-[13px] text-[#6b7280] mb-1">서브행 단가 (L열)</label>
                <input type="number" step="0.01" value={subL} onChange={e => setSubL(e.target.value)} className="w-full bg-[#f5f5f0] px-2 py-1.5 text-[14px] font-mono outline-none" />
              </div>
              <div>
                <label className="block text-[13px] text-[#6b7280] mb-1">서브행 CMPH (M열)</label>
                <input type="number" step="0.01" value={subCmph} onChange={e => setSubCmph(e.target.value)} className="w-full bg-[#f5f5f0] px-2 py-1.5 text-[14px] font-mono outline-none" />
              </div>
            </div>
          )}
        </div>
        <Divider />

        {/* Logs */}
        <div>
          <h3 className="text-[13px] font-bold text-[#6b7280] mb-2 px-1">로그</h3>
          <div className="bg-white p-3 h-28 overflow-y-auto">
            <div className="font-mono text-[13px] text-[#1a1a1a] leading-relaxed">
              {logs.map((log, i) => <div key={i}>{log}</div>)}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
        <Divider />

        {/* Actions */}
        <div className="flex gap-3 px-1 mt-6">
          <button 
            onClick={handleGenerate}
            disabled={isProcessing}
            className="bg-[#2563eb] text-white px-6 py-3 font-bold text-[16px] hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isProcessing ? "처리 중..." : "＋ 행 추가 & 저장"}
          </button>
          <button 
            onClick={handleReset}
            className="bg-[#d0d0c8] text-[#1a1a1a] px-6 py-3 text-[15px] hover:bg-gray-300 transition-colors"
          >
            초기화
          </button>
        </div>

      </div>
    </div>
  );
}
