import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: '云原生职位关键词 - 云计算工程师必备技能词库 | 简历优化工具',
  description: '云原生职位关键词词库，包含云计算工程师必备技能、热门技术栈和职位要求关键词，帮助您优化简历匹配度。',
  openGraph: {
    title: '云原生职位关键词 - 云计算工程师必备技能词库',
    description: '云原生职位关键词词库，包含云计算工程师必备技能、热门技术栈和职位要求关键词，帮助您优化简历匹配度。',
    type: 'article',
    url: 'https://yourdomain.com/seo/cloud-jd-keywords',
  },
};

export default function CloudJdKeywordsPage() {
  const cloudBullets = [
    "设计并实现高可用云原生基础设施，使用AWS和Terraform管理500+节点，确保99.99%可用性，支持50万并发用户",
    "构建容器化部署流水线，基于Kubernetes和GitLab CI/CD实现自动化部署，将部署时间从4小时缩短至30分钟",
    "优化云资源成本管理策略，通过Spot实例和自动扩缩容，节省30%的云资源成本",
    "主导混合云架构迁移项目，采用Istio服务网格实现无缝切换，成功迁移30个核心服务，停机时间小于2分钟",
    "实施多区域灾备方案，利用AWS CloudFormation实现异地容灾，RTO时间缩短至15分钟，RPO接近零"
  ];

  const commonMissingItems = [
    "多云/混合云架构经验",
    "容器编排和Kubernetes",
    "基础设施即代码",
    "微服务架构设计",
    "云安全和合规性",
    "监控和日志系统",
    "自动化运维实践",
    "成本优化策略"
  ];

  const cloudKeywords = [
    "AWS", "Azure", "GCP", "Kubernetes", "Docker", "Terraform", "IaC", "CI/CD",
    "DevOps", "SRE", "Microservices", "Serverless", "Lambda", "EKS", "AKS", "GKE",
    "VPC", "IAM", "CloudFormation", "ECS", "EC2", "S3", "RDS", "CloudWatch",
    "Prometheus", "Grafana", "Ansible", "Chef", "Puppet", "Jenkins", "GitLab CI",
    "Monitoring", "Observability", "Logging", "Tracing", "Load Balancer", "Auto Scaling"
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">云原生职位关键词词库</h1>
      
      <p className="text-lg mb-8">
        云原生职位关键词词库，包含云计算工程师必备技能、热门技术栈和职位要求关键词，帮助您优化简历匹配度。
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>热门云原生关键词</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {cloudKeywords.map((keyword, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
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
          <CardTitle>云原生工程师工作经历要点示例</CardTitle>
        </CardHeader>
        <CardContent>
          {cloudBullets.map((bullet, index) => (
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
            <li>• 包含职位关键词：确保简历中包含招聘要求中的关键词</li>
            <li>• 量化成果：使用具体数字展示性能提升、成本节约等</li>
            <li>• 突出云平台经验：明确提及AWS、Azure或GCP的具体服务</li>
            <li>• 体现架构设计能力：描述您设计的云架构和解决方案</li>
            <li>• 展示安全意识：提及您在云安全和合规性方面的措施</li>
          </ul>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button asChild size="lg">
          <a href="/jd-match?role=cloud&example=1">
            使用职位匹配工具 <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
        <p className="mt-4 text-gray-600">
          使用我们的工具分析简历与云原生职位的匹配度
        </p>
      </div>
    </div>
  );
}