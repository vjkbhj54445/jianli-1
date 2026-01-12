/**
 * 从文本中提取经验年限区间
 * @param text 输入文本
 * @returns 经验年限区间: '0-1' | '1-3' | '3-5' | '5+' | 'unknown'
 */
export function extractExpBucket(text: string): '0-1' | '1-3' | '3-5' | '5+' | 'unknown' {
  // 转换为小写以便匹配
  const lowerText = text.toLowerCase();

  // 首先尝试直接匹配经验年限的模式
  // 匹配如 "X年经验", "X年工作", "X年从业", "X年以上" 等
  const expRegex = /(\d+(?:\.\d+)?)\s*年\s*(?:经验|工作|从业|以上|以内|开发|软件|编程|项目)/g;
  let match;
  while ((match = expRegex.exec(lowerText)) !== null) {
    const years = parseFloat(match[1]);
    if (years <= 1) {
      return '0-1';
    } else if (years <= 3) {
      return '1-3';
    } else if (years <= 5) {
      return '3-5';
    } else {
      return '5+';
    }
  }

  // 如果没有直接匹配到年限，尝试从年份区间推算
  // 匹配如 "2019年毕业" 或 "2018-2022" 的模式
  const graduationYearRegex = /(\d{4})\s*年?\s*毕业/g;
  let gradMatch;
  const currentYear = new Date().getFullYear();
  while ((gradMatch = graduationYearRegex.exec(lowerText)) !== null) {
    const graduationYear = parseInt(gradMatch[1], 10);
    if (graduationYear <= currentYear && graduationYear > 1900) {
      const yearsSinceGraduation = currentYear - graduationYear;
      if (yearsSinceGraduation <= 1) {
        return '0-1';
      } else if (yearsSinceGraduation <= 3) {
        return '1-3';
      } else if (yearsSinceGraduation <= 5) {
        return '3-5';
      } else {
        return '5+';
      }
    }
  }

  // 尝试匹配时间段，如 "2018-2022" 或 "2020至今"
  const periodRegex = /(\d{4})\s*[-–—]\s*(\d{4}|今|现在|present|to date|to now)/g;
  let periodMatch;
  while ((periodMatch = periodRegex.exec(lowerText)) !== null) {
    const startYear = parseInt(periodMatch[1], 10);
    let endYear: number;
    
    if (periodMatch[2].toLowerCase().includes('今') || 
        periodMatch[2].toLowerCase().includes('现在') ||
        periodMatch[2].toLowerCase().includes('present') ||
        periodMatch[2].toLowerCase().includes('to')) {
      endYear = currentYear;
    } else {
      endYear = parseInt(periodMatch[2], 10);
    }
    
    if (startYear <= currentYear && startYear > 1900 && 
        endYear <= currentYear && endYear >= startYear) {
      const experienceYears = endYear - startYear;
      if (experienceYears <= 1) {
        return '0-1';
      } else if (experienceYears <= 3) {
        return '1-3';
      } else if (experienceYears <= 5) {
        return '3-5';
      } else {
        return '5+';
      }
    }
  }

  // 如果没有找到任何匹配项，则返回unknown
  return 'unknown';
}