import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MLOps简历模板 - 机器学习工程师技能要点与实例 | 简历优化工具',
  description: '专业的MLOps工程师简历模板，包含必备技能、工作经历要点示例和常见缺失项清单，帮助您制作出色的机器学习工程师简历。',
  openGraph: {
    title: 'MLOps简历模板 - 机器学习工程师技能要点与实例',
    description: '专业的MLOps工程师简历模板，包含必备技能、工作经历要点示例和常见缺失项清单，帮助您制作出色的机器学习工程师简历。',
    type: 'article',
    url: 'https://yourdomain.com/seo/mlops-template',
  },
};

export default function MlopsTemplatePage() {
  const mlopsBullets = [
    "构建端到端MLOps平台，集成MLflow实现模型训练到部署全流程，模型交付周期缩短80%，模型性能提升15%",
    "开发自动化特征工程管道，使用Feast进行数据预处理和特征提取，特征工程效率提升60%，模型准确率提高3%",
    "设计并实现模型版本管理和实验跟踪系统，基于Kubeflow构建模型生命周期管理，模型迭代速度提升2倍",
    "优化模型推理服务性能，采用TensorFlow Serving实现低延迟高并发推理，推理延迟降低100ms，吞吐量提升500 QPS",
    "建立了模型监控和漂移检测机制，利用Evidently实现模型健康监测，模型性能退化检测时间缩短至1小时"
  ];

  const commonMissingItems = [
    "端到端MLOps平台设计",
    "模型版本管理经验",
    "特征工程管道构建",
    "模型性能优化",
    "模型监控和漂移检测",
    "A/B测试和实验框架",
    "数据质量验证体系",
    "模型解释性和公平性"
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">MLOps工程师简历模板</h1>
      
      <p className="text-lg mb-8">
        专业的MLOps工程师简历写作指南，包含必备技能、工作经历要点示例和常见缺失项清单，帮助您制作出色的机器学习工程师简历。
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>MLOps必备技能</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• 机器学习模型开发</li>
              <li>• MLOps平台构建</li>
              <li>• 模型部署和推理优化</li>
              <li>• 特征工程和数据管道</li>
              <li>• 模型监控和管理</li>
              <li>• A/B测试和实验</li>
              <li>• 云平台和容器技术</li>
              <li>• 数据工程和ETL</li>
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
          <CardTitle>MLOps工作经历要点示例</CardTitle>
        </CardHeader>
        <CardContent>
          {mlopsBullets.map((bullet, index) => (
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
            <li>• 量化模型成果：使用具体数据展示模型性能提升</li>
            <li>• 强调端到端经验：描述从数据到模型上线的完整流程</li>
            <li>• 展示自动化能力：突出MLOps平台的自动化特性</li>
            <li>• 体现业务价值：说明模型如何为业务带来实际收益</li>
            <li>• 关注模型质量：提及模型监控和漂移检测措施</li>
          </ul>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button asChild size="lg">
          <a href="/bullet-rewrite?role=mlops&example=1">
            使用MLOps简历优化工具 <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
        <p className="mt-4 text-gray-600">
          使用我们的工具生成更专业的MLOps工程师简历要点
        </p>
      </div>
    </div>
  );
}