/**
 * 从文本中提取教育水平
 * @param text 输入文本
 * @returns 教育水平标识: dazhuan | benke | shuoshi_plus | unknown
 */
export function extractEdu(text: string): 'dazhuan' | 'benke' | 'shuoshi_plus' | 'unknown' {
  // 转换为小写以便匹配
  const lowerText = text.toLowerCase();

  // 定义学历关键词
  const dazhuanKeywords = ['大专', '专科'];
  const benkeKeywords = ['本科', '学士', 'undergraduate', 'bachelor'];
  const shuoshiPlusKeywords = ['硕士', '研究生', 'master', '博士', 'phd', 'doctor'];

  // 检查是否有大专/专科相关词汇
  for (const keyword of dazhuanKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return 'dazhuan';
    }
  }

  // 检查是否有本科相关词汇
  for (const keyword of benkeKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return 'benke';
    }
  }

  // 检查是否有硕士及以上相关词汇
  for (const keyword of shuoshiPlusKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return 'shuoshi_plus';
    }
  }

  // 如果没有找到匹配项，则返回unknown
  return 'unknown';
}