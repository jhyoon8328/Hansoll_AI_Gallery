-- 1. 기존 MenuSetting 테이블에 연결 키로 사용할 MenuId 컬럼 추가
ALTER TABLE "MenuSetting" ADD COLUMN IF NOT EXISTS "MenuId" text;

-- 2. MenuId 컬럼에 고유키(Unique) 제약조건 추가 (MenualPage와의 연결 무결성을 위해)
ALTER TABLE "MenuSetting" ADD CONSTRAINT "MenuSetting_MenuId_key" UNIQUE ("MenuId");

-- 3. 기존 메뉴 렌더링에 필요한 메타데이터(아이콘, 색상 등)를 담을 JSONB 컬럼 추가 (옵션이지만 화면 유지에 필요함)
ALTER TABLE "MenuSetting" ADD COLUMN IF NOT EXISTS "menu_meta" jsonb;
