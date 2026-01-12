import { ScoringResult } from './score';

interface SuggestionTemplate {
  category: 'tech' | 'role' | 'scene' | 'experience';
  priority: number; // 1-5, 5为最高优先级
  template: string;
  condition: (result: ScoringResult) => boolean;
}

// 建议模板
const suggestionTemplates: SuggestionTemplate[] = [
  {
    category: 'tech',
    priority: 5,
    template: '在工作经历中突出使用 {tech} 的项目经验，特别是与 {related_tech} 相关的应用案例。',
    condition: (result) => result.missing.tech.length > 0
  },
  {
    category: 'tech',
    priority: 4,
    template: '详细描述您在 {tech} 方面的实践经验，包括解决的具体技术难题和取得的成果。',
    condition: (result) => result.missing.tech.length > 0
  },
  {
    category: 'tech',
    priority: 3,
    template: '补充关于 {tech} 技术栈的项目经验，展示您在该领域的深度理解和实际应用能力。',
    condition: (result) => result.missing.tech.length > 0
  },
  {
    category: 'role',
    priority: 4,
    template: '强调您在 {role} 角色中的职责和成就，特别是领导力、项目管理和团队协作方面的表现。',
    condition: (result) => result.missing.role.length > 0
  },
  {
    category: 'scene',
    priority: 4,
    template: '增加在 {scene} 领域的实际项目经验，展示您对该行业特定需求和技术挑战的理解。',
    condition: (result) => result.missing.scene.length > 0
  },
  {
    category: 'experience',
    priority: 5,
    template: '补充在 {scene} 或类似场景下的项目经验，特别是处理 {specific_challenge} 的解决方案。',
    condition: (result) => result.missing.scene.length > 0
  },
  {
    category: 'experience',
    priority: 3,
    template: '量化您的工作成果，例如："通过优化 {tech} 架构，使系统性能提升 {improvement_percentage}%"',
    condition: (result) => true
  },
  {
    category: 'tech',
    priority: 4,
    template: '展示您在 {tech} 生态系统中的全面技能，包括相关工具、框架和最佳实践的应用。',
    condition: (result) => result.missing.tech.length > 0
  },
  {
    category: 'role',
    priority: 3,
    template: '突出您在跨职能团队中的合作经验，特别是在担任 {role} 角色时推动项目进展的能力。',
    condition: (result) => result.missing.role.length > 0
  },
  {
    category: 'experience',
    priority: 5,
    template: '增加在 {scene} 领域的数据驱动决策经验，例如通过分析 {data_type} 来优化业务流程。',
    condition: (result) => result.missing.scene.length > 0
  }
];

/**
 * 生成简历优化建议
 * @param result 评分结果
 * @param maxSuggestions 最大建议数量，默认5
 * @returns 优化建议数组
 */
export function generateSuggestions(result: ScoringResult, maxSuggestions: number = 5): string[] {
  // 获取满足条件的建议模板
  const validTemplates = suggestionTemplates.filter(template => template.condition(result));
  
  // 根据优先级排序
  validTemplates.sort((a, b) => b.priority - a.priority);
  
  // 生成具体建议
  const suggestions: string[] = [];
  
  // 如果没有任何缺失项，提供通用建议
  if (result.missing.tech.length === 0 && result.missing.role.length === 0 && result.missing.scene.length === 0) {
    return [
      '恭喜！您的简历与职位要求高度匹配。建议进一步量化您的工作成果，例如性能提升百分比、项目规模等。',
      '考虑添加一些具体的项目细节，突出您在团队中的贡献和影响力。',
      '可以增加一些与目标岗位相关的关键词，让简历更贴合职位要求。',
      '在描述工作经验时，使用更具体的动词和量化的成果来展示您的能力。',
      '确保简历中的技能部分与职位要求完全对应，有助于通过ATS筛选。'
    ].slice(0, maxSuggestions);
  }
  
  // 填充模板变量
  for (const template of validTemplates) {
    if (suggestions.length >= maxSuggestions) break;
    
    let suggestion = template.template;
    
    // 替换变量
    if (template.category === 'tech' && result.missing.tech.length > 0) {
      suggestion = suggestion.replace('{tech}', result.missing.tech[0]);
      if (template.template.includes('{related_tech}') && result.hit.tech.length > 0) {
        suggestion = suggestion.replace('{related_tech}', result.hit.tech[0]);
      }
    } else if (template.category === 'role' && result.missing.role.length > 0) {
      suggestion = suggestion.replace('{role}', result.missing.role[0]);
    } else if (template.category === 'scene' && result.missing.scene.length > 0) {
      suggestion = suggestion.replace('{scene}', result.missing.scene[0]);
      if (template.template.includes('{specific_challenge}')) {
        suggestion = suggestion.replace('{specific_challenge}', '性能优化或架构设计');
      }
    } else if (template.category === 'experience') {
      if (template.template.includes('{scene}') && result.missing.scene.length > 0) {
        suggestion = suggestion.replace('{scene}', result.missing.scene[0]);
      }
      if (template.template.includes('{tech}') && result.missing.tech.length > 0) {
        suggestion = suggestion.replace('{tech}', result.missing.tech[0]);
      }
      if (template.template.includes('{improvement_percentage}')) {
        suggestion = suggestion.replace('{improvement_percentage}', '20-40');
      }
      if (template.template.includes('{data_type}')) {
        suggestion = suggestion.replace('{data_type}', '用户行为数据或业务指标');
      }
    }
    
    // 如果还有未替换的变量，使用默认值
    if (suggestion.includes('{tech}')) {
      const tech = result.missing.tech.length > 0 ? result.missing.tech[0] : (result.hit.tech.length > 0 ? result.hit.tech[0] : '相关技术');
      suggestion = suggestion.replace(/{tech}/g, tech);
    }
    if (suggestion.includes('{role}')) {
      const role = result.missing.role.length > 0 ? result.missing.role[0] : '相关角色';
      suggestion = suggestion.replace(/{role}/g, role);
    }
    if (suggestion.includes('{scene}')) {
      const scene = result.missing.scene.length > 0 ? result.missing.scene[0] : '相关场景';
      suggestion = suggestion.replace(/{scene}/g, scene);
    }
    
    // 确保建议不重复
    if (!suggestions.includes(suggestion)) {
      suggestions.push(suggestion);
    }
  }
  
  // 如果建议不够，填充通用模板
  while (suggestions.length < maxSuggestions) {
    const genericSuggestions = [
      `在描述工作经验时，使用更多量化数据来证明您的成就，例如提升效率、降低成本或增加收入等。`,
      `考虑添加更多与目标职位相关的关键词，这有助于通过简历筛选系统。`,
      `突出您在解决复杂技术问题方面的能力，特别是与职位要求相关的技术栈。`,
      `强调您在团队合作和项目管理方面的经验，特别是跨部门协作的经验。`,
      `在技能部分增加与职位最相关的核心技术，并在工作经历中体现实际应用。`
    ];
    
    // 随机选择一个通用建议，避免重复
    const randomIndex = Math.floor(Math.random() * genericSuggestions.length);
    const genericSuggestion = genericSuggestions[randomIndex];
    
    if (!suggestions.includes(genericSuggestion)) {
      suggestions.push(genericSuggestion);
    } else {
      break; // 避免无限循环
    }
  }
  
  return suggestions.slice(0, maxSuggestions);
}