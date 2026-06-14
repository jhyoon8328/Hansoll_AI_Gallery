import { LucideIcon, Briefcase, Users, Clipboard, Laptop } from "lucide-react";

export interface SubMenuItem {
  title: string;
  href?: string;
  isHeader?: boolean;
  showHelpIcon?: boolean;
  description?: string;
  children?: SubMenuItem[];
}

export interface MenuItem {
  title: string;
  slug: string;
  imageUrl: string;
  icon: LucideIcon;
  subItems: SubMenuItem[];
}

export const portalMenu: MenuItem[] = [
  {
    title: "사업부",
    slug: "business",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200",
    icon: Briefcase,
    subItems: [
      { 
        title: "사업 3부", 
        href: "/business/dept3", 
        isHeader: true,
        children: [
          { title: "CMPH recap 작성", href: "/business/cmph-recap", showHelpIcon: true, description: "테크팩 PDF에서 데이터를 추출하여 리캡 엑셀 자동 작성" },
          { title: "CMPH recap 작성 (orig)", href: "/business/cmph-recap-backup", showHelpIcon: true, description: "테크팩 PDF에서 데이터를 추출하여 리캡 엑셀 자동 작성 (원본 로컬앱 방식)" },
          { title: "Chico's CPO파일 비교", href: "/business/chicos-cpo-compare", showHelpIcon: true, description: "PO 파일과 CPO 파일 간의 데이터 변경 내역 자동 검토" },
          { title: "부자재 공임차트 비교", href: "/business/trim-chart-compare", showHelpIcon: true, description: "공임 차트와 부자재 시트 데이터 간의 수량/단가 교차 검증" },
        ]
      },
      { 
        title: "사업 7부", 
        href: "/business/dept7",
        isHeader: true,
        children: []
      },
    ],
  },
  {
    title: "HR부",
    slug: "hr",
    imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200",
    icon: Users,
    subItems: [],
  },
  {
    title: "총무부",
    slug: "general",
    imageUrl: "https://images.unsplash.com/photo-1555529771-835f59bfc50c?auto=format&fit=crop&q=80&w=1200",
    icon: Clipboard,
    subItems: [],
  },
  {
    title: "IT부",
    slug: "it",
    imageUrl: "https://images.unsplash.com/photo-1604719312566-8fa2461e1b12?auto=format&fit=crop&q=80&w=1200",
    icon: Laptop,
    subItems: [
      {
        title: "Main page TEST",
        href: "/it/main-page-test",
        isHeader: false,
        showHelpIcon: false,
        description: "메인 페이지 테스트 화면"
      }
    ],
  },
];
