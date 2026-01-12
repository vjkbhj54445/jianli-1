import Link from "next/link";
import PrivacySettings from './PrivacySettings';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">© {new Date().getFullYear()} 简历优化工具. 保留所有权利.</p>
          </div>
          
          <div className="flex flex-wrap justify-center space-x-6">
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600">隐私政策</Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600">使用条款</Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600">联系我们</Link>
            <PrivacySettings />
          </div>
        </div>
      </div>
    </footer>
  );
}