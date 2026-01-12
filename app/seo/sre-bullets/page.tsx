import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SRE简历要点 - 站点可靠性工程师工作经历写作指南 | 简历优化工具',
  description: '专业的SRE简历写作指南，包含必备技能、工作经历要点示例和常见缺失项清单，帮助您制作出色的站点可靠性工程师简历。',
  openGraph: {
    title: 'SRE简历要点 - 站点可靠性工程师工作经历写作指南',
    description: '专业的SRE简历写作指南，包含必备技能、工作经历要点示例和常见缺失项清单，帮助您制作出色的站点可靠性工程师简历。',
    type: 'article',
    url: 'https://yourdomain.com/seo/sre-bullets',
  },
};

export default function SreBulletsPage() {
  const sreBullets = [
    "设计并实施监控告警体系，集成Prometheus和Grafana，将故障平均发现时间缩短至2分钟内",
    "构建自动化运维平台，使用Ansible实现基础设施即代码，运维效率提升50%，人为错误减少70%",
    "优化服务性能和可用性，通过容量规划和性能调优，P99响应时间降低100ms，可用性提升至99.99%",
    "实施混沌工程实践，利用Chaos Monkey进行故障演练，系统韧性增强，MTBF延长50小时",
    "制定SLO/SIL/SLA指标体系，基于OpenTelemetry建立服务等级协议，客户满意度提升20%"
  ];

  const commonMissingItems = [
    "监控和告警系统设计",
    "自动化运维实践",
    "性能优化经验",
    "混沌工程实践",
    "SLO/SLI/SLA制定",
    "故障响应和复盘流程",
    "容量规划和资源优化",
    "安全和合规性保障"
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">SRE简历要点写作指南</h1>
      
      <p className="text-lg mb-8">
        专业的站点可靠性工程师简历写作指南，包含必备技能、工作经历要点示例和常见缺失项清单，帮助您制作出色的SRE简历。
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>SRE必备技能</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• 系统监控和可观测性</li>
              <li>• 自动化运维和脚本编写</li>
              <li>• 性能调优和容量规划</li>
              <li>• 故障响应和应急处理</li>
              <li>• CI/CD和GitOps实践</li>
              <li>• 云平台和容器技术</li>
              <li>• 安全和合规性保障</li>
              <li>• 分布式系统设计</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>常见缺失项</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {commonMissingItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>SRE工作经历要点示例</CardTitle>
        </CardHeader>
        <CardContent>
          {sreBullets.map((bullet, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50 flex justify-between items-start">
              <div className="flex-1">{bullet}</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(bullet)}
                className="ml-4"
              >
                <Copy className="w-4 h-4 mr-1" /> 复制
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>优化建议</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>• 强调量化成果：使用具体数据展示稳定性提升、故障减少等</li>
            <li>• 体现系统思维：描述如何平衡可靠性与功能开发</li>
            <li>• 突出自动化能力：展示您在提升运维效率方面的贡献</li>
            <li>• 展示问题解决能力：说明您如何处理复杂系统问题</li>
            <li>• 关注业务影响：说明SRE实践如何支持业务目标</li>
          </ul>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button asChild size="lg">
          <a href="/bullet-rewrite?role=sre&example=1">
            使用SRE简历优化工具 <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
        <p className="mt-4 text-gray-600">
          使用我们的工具生成更专业的SRE工作经历要点
        </p>
      </div>
    </div>
  );
}