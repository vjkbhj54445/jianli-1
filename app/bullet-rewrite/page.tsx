"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from 'next/navigation';

export default function BulletRewritePage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 获取URL参数
  const role = searchParams.get('role');
  const example = searchParams.get('example');

  // 根据URL参数设置示例文本
  useEffect(() => {
    if (role === 'sre' && example === '1') {
      setInputText("负责系统监控和故障处理，提升系统稳定性，优化性能");
    } else if (role === 'mlops' && example === '1') {
      setInputText("负责机器学习模型开发和部署，构建MLOps平台，优化模型性能");
    } else if (role === 'k8s' && example === '1') {
      setInputText("负责Kubernetes集群管理和容器化部署，优化资源利用率");
    }
  }, [role, example]);

  const handleProcess = () => {
    // 根据角色生成不同的优化结果
    let result = "";
    
    if (role === 'sre') {
      result = `优化后的工作经历要点：
      
- 建立了SRE监控告警体系，集成Prometheus和Grafana实现全方位可观测性，故障平均发现时间缩短至2分钟，系统稳定性提升30%
- 设计并实施了自动化运维平台，使用Ansible实现基础设施即代码，运维效率提升50%，人为错误减少70%
- 优化了服务性能和可用性，通过容量规划和性能调优，P99响应时间降低100ms，可用性提升至99.99%
- 实施了混沌工程实践，利用Chaos Monkey进行故障演练，系统韧性增强，故障恢复时间缩短50%，MTBF延长50小时
- 制定了SLO/SIL/SLA指标体系，基于OpenTelemetry建立服务等级协议，客户满意度提升20%，服务中断事件减少80%`;
    } else if (role === 'mlops') {
      result = `优化后的工作经历要点：
      
- 构建了端到端MLOps平台，集成MLflow实现模型训练到部署全流程，模型交付周期缩短80%，模型性能提升15%
- 开发了自动化特征工程管道，使用Feast进行数据预处理和特征提取，特征工程效率提升60%，模型准确率提高3%
- 设计并实现了模型版本管理和实验跟踪系统，基于Kubeflow构建模型生命周期管理，模型迭代速度提升2倍
- 优化了模型推理服务性能，采用TensorFlow Serving实现低延迟高并发推理，推理延迟降低100ms，吞吐量提升500 QPS
- 建立了模型监控和漂移检测机制，利用Evidently实现模型健康监测，模型性能退化检测时间缩短至1小时`;
    } else if (role === 'k8s') {
      result = `优化后的工作经历要点：
      
- 设计并实现了高可用Kubernetes集群，使用Kubeadm工具支持500+节点，确保99.99%可用性，支持50万并发用户
- 构建了基于GitOps的CI/CD流水线，使用ArgoCD和Helm管理应用部署，提升部署效率60%
- 优化了容器资源分配策略，通过HPA和VPA实现自动扩缩容，节省30%云资源成本
- 实施了服务网格架构，采用Istio实现微服务间的安全通信和流量控制
- 建立了K8s监控体系，集成Prometheus和Grafana，实现集群性能监控和告警`;
    } else {
      // 默认结果
      result = `优化后的工作经历要点：
      
- 负责开发并维护公司核心电商平台，使用React和Node.js技术栈，服务超过10万日活跃用户
- 通过引入微前端架构，将页面加载速度提升了40%，显著改善用户体验
- 主导API性能优化项目，使系统响应时间减少了35%，提高了整体系统稳定性
- 指导初级开发者，建立了代码审查机制，提高了团队整体代码质量`;
    }
    
    setOutputText(result);
  };

  const handleClearParams = () => {
    // 清除URL参数
    router.push('/bullet-rewrite', { scroll: false });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">工作经历要点重写</h1>
        {(role || example) && (
          <Button variant="outline" onClick={handleClearParams}>
            清除示例
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>输入工作经历描述</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="请输入工作经历描述..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
            className="mb-4"
          />
          <Button onClick={handleProcess} className="w-full md:w-auto">
            优化重写
          </Button>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>优化结果</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="优化结果将显示在这里..." 
            value={outputText}
            readOnly
            rows={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}