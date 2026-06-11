import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <span className="text-lg font-bold">H</span>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Hansoll <span className="font-medium text-slate-500">Portal</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-md">
              더 효율적이고 완벽한 인공지능 협업 환경을 구축하여 비즈니스의 가치를 높이고 혁신을 선도합니다.
            </p>
            <div className="flex space-x-6">
              {/* Simple elegant social icon mockups */}
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-bold tracking-wider text-slate-800 uppercase">솔루션</h3>
                <ul role="list" className="mt-4 space-y-3">
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">데이터 시각화</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">AI 워크플로우</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">스마트 대시보드</a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-bold tracking-wider text-slate-800 uppercase">지원 서비스</h3>
                <ul role="list" className="mt-4 space-y-3">
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">도움말 센터</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">API 가이드</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">시스템 모니터링</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-bold tracking-wider text-slate-800 uppercase">회사 소개</h3>
                <ul role="list" className="mt-4 space-y-3">
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">회사 개요</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">채용 정보</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">보안 및 약관</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {currentYear} Hansoll Portal. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Made with ❤️ for Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
