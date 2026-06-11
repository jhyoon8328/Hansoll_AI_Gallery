@echo off
chcp 65001 >nul

echo CMPH Recap Tool 시작 중...

python -c "import openpyxl, fitz, PIL" 2>nul
if errorlevel 1 (
    echo 필요한 라이브러리 설치 중... 잠깐만요
    pip install openpyxl PyMuPDF Pillow
)

python "%~dp0CMPH_Recap_Tool.py"

pause
