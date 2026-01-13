// __tests__/domain/extract/jd.test.ts
import { extractRoleTags, extractSceneTags } from '@/domain/extract/jd';

describe('extractRoleTags', () => {
  test('should extract frontend developer role', () => {
    expect(extractRoleTags('招聘前端工程师')).toContain('frontend-developer');
    expect(extractRoleTags('Web Developer')).toContain('frontend-developer');
    expect(extractRoleTags('javascript developer')).toContain('frontend-developer');
  });

  test('should extract backend developer role', () => {
    expect(extractRoleTags('招聘后端工程师')).toContain('backend-developer');
    expect(extractRoleTags('Backend Developer')).toContain('backend-developer');
    expect(extractRoleTags('server-side developer')).toContain('backend-developer');
  });

  test('should extract fullstack developer role', () => {
    expect(extractRoleTags('招聘全栈工程师')).toContain('fullstack-developer');
    expect(extractRoleTags('Fullstack Developer')).toContain('fullstack-developer');
    expect(extractRoleTags('Full-Stack Engineer')).toContain('fullstack-developer');
  });

  test('should extract devops/sre role', () => {
    expect(extractRoleTags('招聘DevOps工程师')).toContain('devops-engineer');
    expect(extractRoleTags('SRE Engineer')).toContain('devops-engineer');
    expect(extractRoleTags('Site Reliability Engineer')).toContain('devops-engineer');
  });

  test('should extract architect role', () => {
    expect(extractRoleTags('招聘架构师')).toContain('architect');
    expect(extractRoleTags('Solution Architect')).toContain('architect');
  });

  test('should extract qa/tester role', () => {
    expect(extractRoleTags('招聘测试工程师')).toContain('qa-tester');
    expect(extractRoleTags('QA Engineer')).toContain('qa-tester');
    expect(extractRoleTags('Tester')).toContain('qa-tester');
  });

  test('should return empty array for no matches', () => {
    expect(extractRoleTags('没有任何角色信息')).toEqual([]);
    expect(extractRoleTags('')).toEqual([]);
  });
});

describe('extractSceneTags', () => {
  test('should extract ecommerce scene', () => {
    expect(extractSceneTags('电商系统开发')).toContain('ecommerce');
    expect(extractSceneTags('e-commerce platform')).toContain('ecommerce');
    expect(extractSceneTags('零售业务')).toContain('ecommerce');
  });

  test('should extract fintech scene', () => {
    expect(extractSceneTags('金融科技项目')).toContain('fintech');
    expect(extractSceneTags('Fintech application')).toContain('fintech');
    expect(extractSceneTags('支付系统')).toContain('fintech');
  });

  test('should extract healthcare scene', () => {
    expect(extractSceneTags('医疗健康应用')).toContain('healthcare');
    expect(extractSceneTags('Healthcare system')).toContain('healthcare');
  });

  test('should extract education scene', () => {
    expect(extractSceneTags('在线教育平台')).toContain('education');
    expect(extractSceneTags('EdTech solution')).toContain('education');
  });

  test('should extract social media scene', () => {
    expect(extractSceneTags('社交媒体应用')).toContain('social-media');
    expect(extractSceneTags('Social Media platform')).toContain('social-media');
  });

  test('should extract ai/ml scene', () => {
    expect(extractSceneTags('人工智能项目')).toContain('ai-ml');
    expect(extractSceneTags('机器学习')).toContain('ai-ml');
    expect(extractSceneTags('深度学习')).toContain('ai-ml');
  });

  test('should extract cloud computing scene', () => {
    expect(extractSceneTags('云计算平台')).toContain('cloud-computing');
    expect(extractSceneTags('云服务')).toContain('cloud-computing');
  });

  test('should return empty array for no matches', () => {
    expect(extractSceneTags('没有任何场景信息')).toEqual([]);
    expect(extractSceneTags('')).toEqual([]);
  });
});