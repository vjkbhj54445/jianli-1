import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'K8s简历模板 - Kubernetes工程师技能要点与实例 | 简历优化工具',
  description: '专业的Kubernetes工程师简历模板，包含必备技能、工作经历要点示例和常见缺失项清单，帮助您制作出色的K8s工程师简历。',
  openGraph: {
    title: 'K8s简历模板 - Kubernetes工程师技能要点与实例',
    description: '专业的Kubernetes工程师简历模板，包含必备技能、工作经历要点示例和常见缺失项清单，帮助您制作出色的K8s工程师简历。',
    type: 'article',
    url: 'https://yourdomain.com/seo/k8s-resume',
  },
};

export default function K8sResumePage() {
  const k8sBullets = [
    "负责设计并部署高可用Kubernetes集群，使用Kubeadm工具支持500+节点，确保99.99%可用性",
    "构建基于GitOps的CI/CD流水线，使用ArgoCD和Helm管理应用部署，提升部署效率60%",
    "优化容器资源分配策略，通过HPA和VPA实现自动扩缩容，节省30%云资源成本",
    "实施服务网格架构，采用Istio实现微服务间的安全通信和流量控制",
    "建立K8s监控体系，集成Prometheus和Grafana，实现集群性能监控和告警"
  ];

  const commonMissingItems = [
    "Kubernetes集群管理经验",
    "容器编排和调度原理",
    "服务网格（Service Mesh）经验",
    "集群安全和权限管理",
    "存储和网络配置",
    "故障排查和性能优化",
    "CI/CD与GitOps实践"
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Kubernetes工程师简历模板</h1>
      
      <p className="text-lg mb-8">
        专业的K8s工程师简历写作指南，包含必备技能、工作经历要点示例和常见缺失项清单，帮助您制作出色的K8s工程师简历。
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>必备技能清单</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Kubernetes集群部署与管理</li>
              <li>• Docker容器化技术</li>
              <li>• CI/CD流水线设计与实施</li>
              <li>• 微服务架构设计</li>
              <li>• 云平台（AWS/GCP/Azure）</li>
              <li>• 监控与日志系统</li>
              <li>• 网络安全与权限管理</li>
              <li>• Helm包管理</li>
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
          <CardTitle>工作经历要点示例</CardTitle>
        </CardHeader>
        <CardContent>
          {k8sBullets.map((bullet, index) => (
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
            <li>• 量化您的成果：使用具体数字展示性能提升、成本节约等</li>
            <li>• 强调自动化：突出您在自动化部署、运维方面的经验</li>
            <li>• 体现安全意识：描述您在集群安全、权限管理方面的措施</li>
            <li>• 展示问题解决能力：举例说明您如何解决复杂的K8s问题</li>
            <li>• 关注最佳实践：提及您在生产环境中遵循的K8s最佳实践</li>
          </ul>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button asChild size="lg">
          <a href="/bullet-rewrite?role=k8s&example=1">
            使用简历优化工具 <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
        <p className="mt-4 text-gray-600">
          使用我们的工具生成更专业的K8s工程师简历要点
        </p>
      </div>
    </div>
  );
}