# Hansoll Portal - Next.js SaaS Web Application

본 프로젝트는 **Next.js App Router**, **TypeScript**, **Tailwind CSS** 기반의 깔끔하고 현대적인 SaaS 스타일의 웹 포털 애플리케이션입니다.

---

## 🚀 기술 스택 (Technology Stack)

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Linter**: [ESLint](https://eslint.org/)
- **Package Manager**: NPM

---

## ✨ 핵심 요구사항 및 기능

1. **현대적인 SaaS 스타일 디자인**: 흰색/연회색 배경 위주의 쾌적하고 넉넉한 레이아웃 설계, 직관적인 카드 기반 구조.
2. **반응형 디자인 (Responsive UI)**: 모바일, 태블릿, 데스크톱 PC 등 모든 기기 화면 크기를 완벽하게 지원.
3. **공통 컴포넌트 분리**: `Header` (클라이언트 모바일 메뉴 포함), `Footer` 컴포넌트를 분리하고 `layout.tsx`에서 자동 통합.
4. **유지보수가 편한 구조**: `src/` 폴더 기반으로 코드를 체계적으로 정돈.
5. **Tailwind CSS 스타일링**: 유연하고 트랜지션 효과를 가미한 고품질 커스텀 UI.

---

## 📁 프로젝트 폴더 구조 (Folder Structure)

```text
d:\0 Hansoll AI\Hansoll AI Portal TEST2
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css      # Tailwind v4 설정 및 글로벌 HSL/SaaS 테마 변수 정의
│   │   ├── layout.tsx       # 공통 레이아웃 (Header, Footer 바인딩)
│   │   └── page.tsx         # 메인 SaaS 랜딩 페이지 (Hero, Features, Stats, Testimonials, CTA)
│   └── components/
│       ├── Header.tsx       # 반응형 스티키 상단 헤더 & 모바일 토글 메뉴
│       └── Footer.tsx       # 상세한 링크 카테고리별 공통 하단 푸터
├── public/                  # 정적 파일 (Next.js 로고 등)
├── eslint.config.mjs        # ESLint 정적 분석 설정
├── next.config.ts           # Next.js 프레임워크 설정
├── package.json             # 라이브러리/의존성 및 실행 스크립트 정의
├── postcss.config.mjs       # CSS 후처리 설정
└── tsconfig.json            # TypeScript 세부 설정
```

---

## 🏃 실행 및 실행 방법 (How to Run)

### 1. 패키지 설치
프로젝트에 필요한 종속성 패키지들을 다운로드합니다.
```bash
npm install
```

### 2. 개발 서버 구동
로컬 개발 환경 서버를 시작합니다.
```bash
npm run dev
```
- 서버 구동 완료 후 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하시면 실시간으로 빌드된 프리미엄 SaaS 랜딩 페이지를 확인하실 수 있습니다.

### 3. 프로덕션 빌드 (배포용 빌드)
배포를 위한 정적 최적화 빌드를 수행합니다.
```bash
npm run build
```

### 4. 로컬 프로덕션 실행
빌드 완료된 파일을 이용해 로컬에서 배포된 버전을 시뮬레이션 구동합니다.
```bash
npm run start
```
