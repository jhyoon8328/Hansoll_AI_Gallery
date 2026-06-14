import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    let body;
    try {
      body = await req.json();
    } catch(e) {
      body = {};
    }
    const fileName = body.fileName || "CMPH_Recap_Tool.py";

    // Only allow specific files for security
    if (fileName !== "CMPH_Recap_Tool.py" && fileName !== "CMPH_Recap_Tool_orig.py") {
      throw new Error("Invalid file name");
    }

    const projectDir = process.cwd();
    const pyPath = path.join(
      projectDir,
      "Project files",
      "사업 3부",
      "CMPH Recap Tool",
      fileName
    );
    const pyDir = path.dirname(pyPath);

    // Use Windows 'start' command via exec to launch the Python script in a new window
    // so it doesn't block the API route and has its own environment
    exec(`start "" python "${pyPath}"`, { cwd: pyDir }, (error) => {
      if (error) {
        console.error("실행 오류:", error);
      }
    });

    return NextResponse.json(
      { success: true, message: "프로그램이 성공적으로 실행되었습니다!" },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
