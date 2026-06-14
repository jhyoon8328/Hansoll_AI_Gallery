import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchPortalMenu } from "@/lib/menuFetcher";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BrandPageProps {
  params: Promise<{ brand: string }>;
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand } = await params;
  
  // Fetch from Supabase
  const portalMenu = await fetchPortalMenu();
  const brandData = portalMenu.find((item) => item.slug === brand);

  if (!brandData) {
    notFound();
  }

  const Icon = brandData.icon;

  return (
    <div className="relative flex min-h-[calc(100vh-140px)] w-full flex-col items-center justify-center overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
      {/* Background Image with Blur & Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center transition-all duration-700 hover:scale-105 hover:blur-sm blur-md"
        style={{ backgroundImage: `url('${brandData.imageUrl}')` }}
      />
      <div className="absolute inset-0 z-10 bg-black/50 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Glassmorphism Content Area */}
      <div className="relative z-20 flex w-full max-w-3xl flex-col items-center px-6 py-12 text-center animate-fade-in-up">
        {/* Brand Icon & Title */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 p-4 text-white shadow-xl backdrop-blur-md ring-1 ring-white/20">
          <Icon className="h-10 w-10" />
        </div>
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-5xl">
          {brandData.title} <span className="font-light text-slate-300">Portal</span>
        </h1>
        <p className="mb-10 text-lg font-medium text-slate-300 drop-shadow max-w-xl">
          {brandData.title} 전용 통합 관리 시스템입니다. 아래 원하는 메뉴를 선택하여 작업을 시작하세요.
        </p>

        {/* Submenu Sections */}
        <div className="w-full flex flex-col gap-10">
          {brandData.subItems.map((sub, idx) => {
            if (sub.isHeader) {
              return (
                <div key={idx} className="w-full text-left">
                  <h3 className="text-xl font-bold text-white mb-5 border-b border-white/20 pb-2 pl-2">
                    {sub.title}
                  </h3>
                  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sub.children && sub.children.length > 0 ? (
                      sub.children.map((child, cIdx) => (
                        <Link
                          key={cIdx}
                          href={child.href || "#"}
                          className="group relative flex flex-col items-start justify-between overflow-hidden rounded-xl bg-white/10 px-5 py-5 text-white shadow-lg backdrop-blur-md ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-2xl hover:ring-white/40 text-left min-h-[120px]"
                        >
                          <div className="flex items-center gap-3 mb-2 w-full">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-500">
                              <ArrowRight className="h-4 w-4 opacity-80 group-hover:opacity-100" />
                            </div>
                            <span className="text-base font-bold tracking-wide leading-tight">{child.title}</span>
                          </div>
                          {child.description && (
                            <p className="text-xs text-slate-300 font-medium leading-relaxed opacity-80 mt-1 pl-11">
                              {child.description}
                            </p>
                          )}
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-full text-slate-400 text-sm italic pl-2 py-4">
                        등록된 하위 메뉴가 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // Fallback for non-header direct items
            return (
              <div key={idx} className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href={sub.href || "#"}
                  className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-white/10 px-4 py-6 text-white shadow-lg backdrop-blur-md ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-2xl hover:ring-white/40 mb-4"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-500">
                    <ArrowRight className="h-5 w-5 opacity-80 group-hover:opacity-100" />
                  </div>
                  <span className="text-sm font-bold tracking-wide">{sub.title}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
