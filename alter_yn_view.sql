-- 1. YN_view 필드 (비공개 여부) 추가. 기본값은 Y(비공개)로 설정합니다.
ALTER TABLE "MenuSetting" ADD COLUMN IF NOT EXISTS "YN_view" text DEFAULT 'Y';

-- 2. 기존 데이터는 모두 'N'(공개)로 업데이트 합니다.
UPDATE "MenuSetting" SET "YN_view" = 'N' WHERE "YN_view" IS NULL OR "YN_view" = 'Y';
