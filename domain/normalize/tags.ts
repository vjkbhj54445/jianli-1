/**
 * 将标签标准化（统一大小写等）
 * @param tag 原始标签
 * @returns 标准化的标签
 */
export function normalizeTag(tag: string): string {
  // 统一转换为小写并去除多余空格
  const normalized = tag.toLowerCase().trim();
  
  // 移除多余的空格
  return normalized.replace(/\s+/g, ' ');
}