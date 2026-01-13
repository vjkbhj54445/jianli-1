// __tests__/domain/extract/edu.test.ts
import { extractEdu } from '@/domain/extract/edu';

describe('extractEdu', () => {
  test('should extract 专科 education level', () => {
    expect(extractEdu('大专学历')).toBe('dazhuan');
    expect(extractEdu('专科毕业')).toBe('dazhuan');
    expect(extractEdu('大专学位')).toBe('dazhuan');
  });

  test('should extract 本科 education level', () => {
    expect(extractEdu('本科学历')).toBe('benke');
    expect(extractEdu('本科毕业')).toBe('benke');
    expect(extractEdu('学士学位')).toBe('benke');
  });

  test('should extract 硕士及以上 education level', () => {
    expect(extractEdu('硕士学历')).toBe('shuoshi_plus');
    expect(extractEdu('硕士毕业')).toBe('shuoshi_plus');
    expect(extractEdu('硕士学位')).toBe('shuoshi_plus');
    expect(extractEdu('博士学历')).toBe('shuoshi_plus');
    expect(extractEdu('博士毕业')).toBe('shuoshi_plus');
    expect(extractEdu('博士学位')).toBe('shuoshi_plus');
    expect(extractEdu('研究生学历')).toBe('shuoshi_plus');
  });

  test('should return unknown for unrecognized education levels', () => {
    expect(extractEdu('高中学历')).toBe('unknown');
    expect(extractEdu('小学毕业')).toBe('unknown');
    expect(extractEdu('没有任何教育信息')).toBe('unknown');
    expect(extractEdu('')).toBe('unknown');
  });

  test('should handle mixed text with education info', () => {
    expect(extractEdu('我是一名本科生，拥有学士学位')).toBe('benke');
    expect(extractEdu('研究生毕业后工作了5年')).toBe('shuoshi_plus');
    expect(extractEdu('大专学历，有丰富经验')).toBe('dazhuan');
  });
});