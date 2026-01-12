import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10">简历优化工具</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/jd-match">
            <CardHeader>
              <CardTitle>职位匹配</CardTitle>
              <CardDescription>分析简历与职位的匹配度</CardDescription>
            </CardHeader>
            <CardContent>
              <p>智能评估您的简历与目标职位的匹配程度</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/bullet-rewrite">
            <CardHeader>
              <CardTitle>要点重写</CardTitle>
              <CardDescription>优化工作经历表述</CardDescription>
            </CardHeader>
            <CardContent>
              <p>提升工作经历的表达效果，突出成就</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/export">
            <CardHeader>
              <CardTitle>导出简历</CardTitle>
              <CardDescription>生成专业格式简历</CardDescription>
            </CardHeader>
            <CardContent>
              <p>将优化后的内容导出为标准简历格式</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          还有更多功能即将推出，敬请期待！
        </p>
      </div>
    </div>
  );
}