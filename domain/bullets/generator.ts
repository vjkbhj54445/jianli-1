import cloudTemplates from './templates/cloud.json';
import sreTemplates from './templates/sre.json';
import mlopsTemplates from './templates/mlops.json';

// 定义模板结构
interface Template {
  id: number;
  verb: string;
  object: string;
  method: string;
  result: string;
}

// 定义项目类型枚举
export type ProjectType = 'development' | 'optimization' | 'migration' | 'monitoring' | 'security' | 'scaling' | 'data' | 'ml' | 'other';

// 定义风格枚举
export type StyleType = 'cloud' | 'sre' | 'mlops';

// 定义量化指标建议
export interface MetricSuggestion {
  key: string;
  label: string;
  placeholder: string;
  example: string;
}

// 定义生成的bullet结构
export interface GeneratedBullet {
  id: number;
  text: string;
}

// 定义生成结果
export interface BulletGenerationResult {
  groups: GeneratedBullet[][];
  metrics: MetricSuggestion[];
}

// 根据风格获取模板
function getTemplatesForStyle(style: StyleType): Template[] {
  switch (style) {
    case 'cloud':
      return cloudTemplates;
    case 'sre':
      return sreTemplates;
    case 'mlops':
      return mlopsTemplates;
    default:
      return cloudTemplates;
  }
}

// 获取量化指标建议
function getMetricSuggestions(style: StyleType): MetricSuggestion[] {
  switch (style) {
    case 'cloud':
      return [
        { key: 'availability', label: '可用性', placeholder: '如 99.99%', example: '99.95%' },
        { key: 'scale', label: '并发用户数', placeholder: '如 10万', example: '50万' },
        { key: 'time_before', label: '迁移前耗时', placeholder: '如 2小时', example: '4小时' },
        { key: 'time_after', label: '迁移后耗时', placeholder: '如 10分钟', example: '30分钟' },
        { key: 'cost_reduction', label: '成本降低比例', placeholder: '如 30%', example: '25%' },
        { key: 'migration_count', label: '迁移服务数量', placeholder: '如 50个', example: '30个' },
        { key: 'downtime', label: '停机时间', placeholder: '如 5分钟', example: '2分钟' },
        { key: 'rto_time', label: 'RTO时间', placeholder: '如 30分钟', example: '15分钟' },
        { key: 'detection_time', label: '故障检测时间', placeholder: '如 5分钟', example: '2分钟' },
        { key: 'mttr_reduction', label: 'MTTR降低比例', placeholder: '如 50%', example: '40%' },
        { key: 'response_time', label: '响应时间降低', placeholder: '如 30%', example: '20%' },
        { key: 'scalability_increase', label: '扩展性提升比例', placeholder: '如 200%', example: '150%' },
        { key: 'release_frequency', label: '发布频率提升', placeholder: '如 5倍', example: '3倍' },
        { key: 'failure_rate', label: '故障率降低', placeholder: '如 80%', example: '60%' },
        { key: 'annual_savings', label: '年度节省成本', placeholder: '如 100万元', example: '50万元' },
        { key: 'efficiency_improvement', label: '效率提升比例', placeholder: '如 60%', example: '40%' },
        { key: 'peak_traffic', label: '峰值流量', placeholder: '如 100万QPS', example: '50万QPS' },
        { key: 'sla_level', label: 'SLA等级', placeholder: '如 99.99%', example: '99.95%' }
      ];
    case 'sre':
      return [
        { key: 'detection_time', label: '故障发现时间', placeholder: '如 2分钟', example: '5分钟' },
        { key: 'stability_improvement', label: '稳定性提升比例', placeholder: '如 30%', example: '25%' },
        { key: 'efficiency_improvement', label: '运维效率提升', placeholder: '如 50%', example: '40%' },
        { key: 'error_reduction', label: '人为错误减少', placeholder: '如 70%', example: '60%' },
        { key: 'response_time', label: 'P99响应时间降低', placeholder: '如 100ms', example: '50ms' },
        { key: 'availability', label: '可用性提升至', placeholder: '如 99.99%', example: '99.95%' },
        { key: 'recovery_time', label: '故障恢复时间缩短', placeholder: '如 50%', example: '30%' },
        { key: 'mtbf_extension', label: 'MTBF延长', placeholder: '如 100小时', example: '50小时' },
        { key: 'satisfaction_improvement', label: '客户满意度提升', placeholder: '如 20%', example: '15%' },
        { key: 'incident_reduction', label: '服务中断事件减少', placeholder: '如 80%', example: '60%' },
        { key: 'success_rate', label: '发布成功率', placeholder: '如 99%', example: '95%' },
        { key: 'rollback_time', label: '回滚时间', placeholder: '如 2分钟', example: '5分钟' },
        { key: 'recurrence_reduction', label: '同类故障减少', placeholder: '如 90%', example: '80%' },
        { key: 'diagnosis_time', label: '问题定位时间减少', placeholder: '如 60%', example: '40%' },
        { key: 'vulnerability_reduction', label: '安全漏洞减少', placeholder: '如 80%', example: '70%' },
        { key: 'compliance_rate', label: '合规审计通过率', placeholder: '如 100%', example: '95%' },
        { key: 'utilization_improvement', label: '资源利用率提升', placeholder: '如 40%', example: '30%' },
        { key: 'cost_savings', label: '成本节约', placeholder: '如 50万元', example: '30万元' },
        { key: 'mttr_before', label: 'MTTR之前', placeholder: '如 30分钟', example: '60分钟' },
        { key: 'mttr_after', label: 'MTTR之后', placeholder: '如 5分钟', example: '10分钟' },
        { key: 'reliability_improvement', label: '可靠性提升', placeholder: '如 40%', example: '30%' }
      ];
    case 'mlops':
      return [
        { key: 'delivery_time', label: '模型交付周期缩短', placeholder: '如 80%', example: '70%' },
        { key: 'performance_improvement', label: '模型性能提升', placeholder: '如 20%', example: '15%' },
        { key: 'efficiency_improvement', label: '特征工程效率提升', placeholder: '如 60%', example: '50%' },
        { key: 'accuracy_improvement', label: '模型准确率提高', placeholder: '如 5%', example: '3%' },
        { key: 'iteration_speed', label: '模型迭代速度提升', placeholder: '如 3倍', example: '2倍' },
        { key: 'reproducibility_improvement', label: '实验复现效率提高', placeholder: '如 80%', example: '60%' },
        { key: 'latency_reduction', label: '推理延迟降低', placeholder: '如 100ms', example: '50ms' },
        { key: 'throughput_improvement', label: '吞吐量提升', placeholder: '如 1000 QPS', example: '500 QPS' },
        { key: 'detection_time', label: '模型性能退化检测时间', placeholder: '如 1小时', example: '2小时' },
        { key: 'maintenance_cost_reduction', label: '维护成本降低', placeholder: '如 40%', example: '30%' },
        { key: 'success_rate', label: '模型上线成功率', placeholder: '如 98%', example: '95%' },
        { key: 'business_improvement', label: '业务指标改善', placeholder: '如 15%', example: '10%' },
        { key: 'quality_detection_rate', label: '数据质量问题发现率', placeholder: '如 90%', example: '80%' },
        { key: 'development_efficiency', label: '模型开发效率提升', placeholder: '如 50%', example: '40%' },
        { key: 'consistency_rate', label: '模型一致性', placeholder: '如 99%', example: '98%' },
        { key: 'model_count', label: '支撑模型数量', placeholder: '如 100个', example: '50个' },
        { key: 'availability', label: '服务可用性', placeholder: '如 99.99%', example: '99.95%' },
        { key: 'trustworthiness_improvement', label: '模型可信度提升', placeholder: '如 30%', example: '25%' },
        { key: 'compliance_risk_reduction', label: '合规风险降低', placeholder: '如 80%', example: '70%' }
      ];
    default:
      return [];
  }
}

// 生成bullets函数
export function generateBullets(
  projectDescription: string,
  projectType: ProjectType,
  style: StyleType,
  selectedTechTags: string[]
): BulletGenerationResult {
  const templates = getTemplatesForStyle(style);
  const metrics = getMetricSuggestions(style);

  // 从模板中随机选择并生成3组bullets，每组3-5条
  const groups: GeneratedBullet[][] = [];

  for (let i = 0; i < 3; i++) {
    const group: GeneratedBullet[] = [];
    // 每组生成3-5条bullets
    const numBullets = Math.floor(Math.random() * 3) + 3; // 3 to 5 bullets
    
    for (let j = 0; j < numBullets; j++) {
      // 随机选择一个模板
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      
      // 注入至少两个技术标签
      const techTag1 = selectedTechTags.length > 0 ? selectedTechTags[Math.floor(Math.random() * selectedTechTags.length)] : '相关技术';
      const techTag2 = selectedTechTags.length > 1 ? selectedTechTags[Math.floor(Math.random() * selectedTechTags.length)] : '其他技术';
      
      // 生成bullet文本
      let bulletText = `${randomTemplate.verb}${randomTemplate.object}${randomTemplate.method.replace('{tech}', techTag1 + '和' + techTag2)}${randomTemplate.result}`;
      
      group.push({
        id: i * 10 + j,
        text: bulletText
      });
    }
    
    groups.push(group);
  }

  return {
    groups,
    metrics
  };
}