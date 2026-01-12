import { normalizeTag } from '../normalize/tags';

// 定义词典项类型
export interface DictionaryItem {
  key: string;
  aliases: string[];
  category: string;
  weight: number;
}

/**
 * 从文本中提取技能标签
 * @param text 输入文本
 * @param dictionaries 词典数组
 * @returns 提取的技能标签数组（已去重和归一化）
 */
export function extractSkills(text: string, dictionaries: DictionaryItem[]): string[] {
  // 将所有词典合并为一个数组
  const allTerms = dictionaries.flatMap(dict => [
    { term: dict.key, normalizedTerm: normalizeTag(dict.key) },
    ...dict.aliases.map(alias => ({ term: alias, normalizedTerm: normalizeTag(alias) }))
  ]);

  // 使用 Set 来确保结果唯一性
  const matchedSkills = new Set<string>();

  // 遍历所有术语，检查是否在文本中出现
  for (const { term, normalizedTerm } of allTerms) {
    // 创建不区分大小写的正则表达式
    const regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi');
    
    // 检查文本中是否包含该术语
    if (regex.test(text)) {
      // 添加归一化的主键而不是匹配的别名
      const matchedDictItem = dictionaries.find(item => 
        item.key === normalizedTerm || item.aliases.some(alias => normalizeTag(alias) === normalizedTerm)
      ) || dictionaries.find(item => 
        item.aliases.some(alias => normalizeTag(alias) === normalizedTerm)
      );

      if (matchedDictItem) {
        matchedSkills.add(normalizeTag(matchedDictItem.key));
      }
    }
  }

  // 返回数组形式的结果
  return Array.from(matchedSkills);
}

/**
 * 转义正则表达式特殊字符
 * @param str 需要转义的字符串
 * @returns 转义后的字符串
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}