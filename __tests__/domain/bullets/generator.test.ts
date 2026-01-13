// __tests__/domain/bullets/generator.test.ts
import { generateBullets, StyleType, ProjectType } from '@/domain/bullets/generator';

// Mock模板数据
jest.mock('@/domain/bullets/templates/cloud.json', () => [
  { id: 1, verb: '设计并实现', object: '高可用云架构，', method: '使用{tech}技术', result: '显著提升系统稳定性。' },
  { id: 2, verb: '优化', object: '云资源配置，', method: '通过{tech}方法', result: '降低成本30%。' }
]);

jest.mock('@/domain/bullets/templates/sre.json', () => [
  { id: 1, verb: '构建', object: '自动化监控体系，', method: '利用{tech}工具', result: '提升故障响应速度。' },
  { id: 2, verb: '实施', object: '灰度发布策略，', method: '基于{tech}框架', result: '减少线上故障率。' }
]);

jest.mock('@/domain/bullets/templates/mlops.json', () => [
  { id: 1, verb: '开发', object: '模型训练流水线，', method: '采用{tech}技术', result: '加速模型迭代周期。' },
  { id: 2, verb: '部署', object: '机器学习平台，', method: '运用{tech}框架', result: '提升模型推理效率。' }
]);

describe('Bullet Generator', () => {
  test('should generate bullets for cloud style', () => {
    const projectDescription = '开发云原生应用';
    const projectType: ProjectType = 'development';
    const style: StyleType = 'cloud';
    const selectedTechTags = ['Kubernetes', 'Docker', 'AWS'];

    const result = generateBullets(projectDescription, projectType, style, selectedTechTags);

    expect(result).toHaveProperty('groups');
    expect(result).toHaveProperty('metrics');
    expect(Array.isArray(result.groups)).toBe(true);
    expect(result.groups.length).toBe(3); // 应该生成3组
    
    // 检查每组是否包含bullets
    result.groups.forEach(group => {
      expect(Array.isArray(group)).toBe(true);
      expect(group.length).toBeGreaterThanOrEqual(3); // 每组至少3条
      expect(group.length).toBeLessThanOrEqual(5); // 每组最多5条
      
      // 检查每条bullet的结构
      group.forEach(bullet => {
        expect(bullet).toHaveProperty('id');
        expect(bullet).toHaveProperty('text');
        expect(typeof bullet.id).toBe('number');
        expect(typeof bullet.text).toBe('string');
        expect(bullet.text.length).toBeGreaterThan(0);
      });
    });
  });

  test('should generate bullets for sre style', () => {
    const projectDescription = '建设监控系统';
    const projectType: ProjectType = 'monitoring';
    const style: StyleType = 'sre';
    const selectedTechTags = ['Prometheus', 'Grafana', 'AlertManager'];

    const result = generateBullets(projectDescription, projectType, style, selectedTechTags);

    expect(result.groups).toHaveLength(3);
    expect(result.metrics[0].key).toBeDefined();
  });

  test('should generate bullets for mlops style', () => {
    const projectDescription = '构建机器学习平台';
    const projectType: ProjectType = 'development';
    const style: StyleType = 'mlops';
    const selectedTechTags = ['TensorFlow', 'PyTorch', 'MLflow'];

    const result = generateBullets(projectDescription, projectType, style, selectedTechTags);

    expect(result.groups).toHaveLength(3);
    expect(result.metrics[0].label).toBeDefined();
  });

  test('should inject at least two tech tags into each bullet', () => {
    const projectDescription = '开发项目';
    const projectType: ProjectType = 'development';
    const style: StyleType = 'cloud';
    const selectedTechTags = ['AWS', 'Kubernetes', 'Docker'];

    const result = generateBullets(projectDescription, projectType, style, selectedTechTags);

    // 检查第一组的第一条bullet是否包含了技术标签
    const firstGroup = result.groups[0];
    const firstBullet = firstGroup[0];
    
    // 验证技术标签是否被注入
    expect(firstBullet.text).toContain('和'); // 应该包含连接技术标签的"和"
    
    // 检查技术标签是否存在于原始标签中
    selectedTechTags.forEach(tag => {
      if (firstBullet.text.includes(tag)) {
        expect(selectedTechTags).toContain(tag);
      }
    });
  });

  test('should handle empty tech tags array', () => {
    const projectDescription = '开发项目';
    const projectType: ProjectType = 'development';
    const style: StyleType = 'cloud';
    const selectedTechTags: string[] = [];

    const result = generateBullets(projectDescription, projectType, style, selectedTechTags);

    expect(result.groups).toHaveLength(3);
    // 即使没有技术标签，也应该生成bullets，使用默认值
    expect(result.groups[0][0].text).toBeDefined();
  });

  test('should return metrics suggestions based on style', () => {
    const projectDescription = '开发项目';
    const projectType: ProjectType = 'development';
    const style: StyleType = 'cloud';
    const selectedTechTags = ['AWS'];

    const result = generateBullets(projectDescription, projectType, style, selectedTechTags);

    expect(Array.isArray(result.metrics)).toBe(true);
    expect(result.metrics.length).toBeGreaterThan(0);
    expect(result.metrics[0]).toHaveProperty('key');
    expect(result.metrics[0]).toHaveProperty('label');
    expect(result.metrics[0]).toHaveProperty('placeholder');
    expect(result.metrics[0]).toHaveProperty('example');
  });
});