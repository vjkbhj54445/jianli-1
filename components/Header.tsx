import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-xl font-bold text-blue-600">
            简历优化工具
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">首页</Link>
          <Link href="/jd-match" className="text-gray-700 hover:text-blue-600">职位匹配</Link>
          <Link href="/bullet-rewrite" className="text-gray-700 hover:text-blue-600">要点重写</Link>
          <Link href="/export" className="text-gray-700 hover:text-blue-600">导出简历</Link>
          <Link href="/admin" className="text-gray-700 hover:text-blue-600">管理</Link>
        </nav>
        
        <div>
          <Button variant="outline" asChild>
            <Link href="/privacy">隐私政策</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}