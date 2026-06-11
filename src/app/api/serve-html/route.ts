import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let filePath = "";
  if (type === "chicos") {
    filePath = path.join(
      process.cwd(),
      "Project files",
      "사업 3부",
      "Chicos 변경 내용 검토",
      "PO_Diff_Analyzer_Chico's.html"
    );
  } else if (type === "trim") {
    filePath = path.join(
      process.cwd(),
      "Project files",
      "사업 3부",
      "부자재 시트 교차 검증",
      "trim_verification_tool_v2.html"
    );
  } else {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (err: any) {
    console.error("Error serving HTML:", err);
    return new NextResponse(`Error reading file: ${err.message}`, { status: 500 });
  }
}
