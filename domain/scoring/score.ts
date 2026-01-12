import { DictionaryItem } from '../extract/skills';
import { extractRoleTags, extractSceneTags } from '../extract/jd';

export interface ScoringResult {
  totalScore: number;
  breakdown: {
    tech: number;      // 0-60
    role: number;      // 0-12.5
    scene: number;     // 0-12.5
    bonus: number;     // 0-15
  };
  hit: {
    tech: string[];
    role: string[];
    scene: string[];
  };
  missing: {
    tech: string[];
    role: string[];
    scene: string[];
  };
  techHitRate: number;
  roleHitRate: number;
  sceneHitRate: number;
}

export interface ResumeProfile {
  tech: string[];
  role: string[];
  scene: string[];
}

/**
 * 计算JD与简历的匹配度
 * @param jdText 职位描述文本
 * @param resumeProfile 简历资料对象
 * @param dictionaries 技能词典
 * @returns 评分结果
 */
export function calculateJdScore(
  jdText: string,
  resumeProfile: ResumeProfile,
  dictionaries: DictionaryItem[]
): ScoringResult {
  // 从JD中提取期望的标签
  const expectedTech = extractTechFromJd(jdText, dictionaries);
  const expectedRole = extractRoleTags(jdText);
  const expectedScene = extractSceneTags(jdText);

  // 计算命中情况
  const techHit = resumeProfile.tech.filter(skill => expectedTech.includes(skill));
  const roleHit = resumeProfile.role.filter(role => expectedRole.includes(role));
  const sceneHit = resumeProfile.scene.filter(scene => expectedScene.includes(scene));

  // 计算缺失情况
  const techMissing = expectedTech.filter(skill => !resumeProfile.tech.includes(skill));
  const roleMissing = expectedRole.filter(role => !resumeProfile.role.includes(role));
  const sceneMissing = expectedScene.filter(scene => !resumeProfile.scene.includes(scene));

  // 计算命中率
  const techHitRate = expectedTech.length > 0 ? techHit.length / expectedTech.length : 0;
  const roleHitRate = expectedRole.length > 0 ? roleHit.length / expectedRole.length : 0;
  const sceneHitRate = expectedScene.length > 0 ? sceneHit.length / expectedScene.length : 0;

  // 计算各部分得分
  const techScore = Math.round(techHitRate * 60); // 最高60分
  const roleScore = Math.round(roleHitRate * 12.5); // 最高12.5分
  const sceneScore = Math.round(sceneHitRate * 12.5); // 最高12.5分

  // 检查是否满足量词加分条件
  const bonusScore = calculateBonusScore(jdText);

  // 总分计算（最高100分）
  const totalScore = Math.min(100, techScore + roleScore + sceneScore + bonusScore);

  return {
    totalScore,
    breakdown: {
      tech: techScore,
      role: roleScore,
      scene: sceneScore,
      bonus: bonusScore
    },
    hit: {
      tech: techHit,
      role: roleHit,
      scene: sceneHit
    },
    missing: {
      tech: techMissing,
      role: roleMissing,
      scene: sceneMissing
    },
    techHitRate,
    roleHitRate,
    sceneHitRate
  };
}

/**
 * 从JD中提取技术标签
 * @param jdText JD文本
 * @param dictionaries 技能词典
 * @returns 技术标签数组
 */
function extractTechFromJd(jdText: string, dictionaries: DictionaryItem[]): string[] {
  const allTerms = dictionaries.flatMap(dict => [
    dict.key,
    ...dict.aliases
  ]);

  const matchedTech = new Set<string>();

  for (const term of allTerms) {
    // 创建不区分大小写的正则表达式
    const regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi');
    
    if (regex.test(jdText)) {
      // 查找对应的主键
      const matchedDictItem = dictionaries.find(item => 
        item.key === term.toLowerCase() || item.aliases.some(alias => alias.toLowerCase() === term.toLowerCase())
      ) || dictionaries.find(item => 
        item.aliases.some(alias => alias.toLowerCase() === term.toLowerCase())
      );

      if (matchedDictItem) {
        matchedTech.add(matchedDictItem.key);
      }
    }
  }

  return Array.from(matchedTech);
}

/**
 * 计算加分项得分
 * @param jdText JD文本
 * @returns 加分值（0-15）
 */
function calculateBonusScore(jdText: string): number {
  let bonus = 0;
  const lowerText = jdText.toLowerCase();

  // 检查各种量词加分条件
  // 年数经验
  const yearMatches = lowerText.match(/(\d+)\s*年/);
  if (yearMatches) {
    const years = parseInt(yearMatches[1]);
    if (years >= 5) bonus += 5; // 5年以上经验要求加5分
    else if (years >= 3) bonus += 3; // 3年以上经验要求加3分
    else if (years >= 1) bonus += 1; // 1年以上经验要求加1分
  }

  // 规模相关的词
  const scaleWords = ['大规模', '海量', '高并发', '千万级', '百万级', '十万级', 'large scale', 'high volume', 'massive'];
  if (scaleWords.some(word => lowerText.includes(word))) {
    bonus += 3;
  }

  // 团队规模
  const teamSizeMatches = lowerText.match(/(\d+)\s*人\s*团\s*队/);
  if (teamSizeMatches) {
    const teamSize = parseInt(teamSizeMatches[1]);
    if (teamSize >= 10) bonus += 4; // 10人以上团队领导经验加4分
  }

  // 项目规模
  const projectScaleWords = ['大型项目', '复杂系统', '多业务线', '跨部门', 'enterprise', 'complex system'];
  if (projectScaleWords.some(word => lowerText.includes(word))) {
    bonus += 3;
  }

  return Math.min(15, bonus); // 最高15分
}

/**
 * 转义正则表达式特殊字符
 * @param str 需要转义的字符串
 * @returns 转义后的字符串
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}