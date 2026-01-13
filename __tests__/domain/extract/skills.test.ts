// __tests__/domain/extract/skills.test.ts
import { extractSkills } from '@/domain/extract/skills';

// 创建测试用的字典
const testDictionary = [
  { key: 'react', aliases: ['React', 'ReactJS'], category: 'frontend' },
  { key: 'typescript', aliases: ['TS', 'TypeScript'], category: 'frontend' },
  { key: 'node.js', aliases: ['Node', 'NodeJS'], category: 'backend' },
  { key: 'aws', aliases: ['Amazon Web Services'], category: 'cloud' },
  { key: 'docker', aliases: ['Docker'], category: 'devops' },
  { key: 'kubernetes', aliases: ['k8s'], category: 'devops' }
];

describe('extractSkills', () => {
  test('should extract skills from text using dictionary keys', () => {
    const text = '熟练掌握React和TypeScript开发';
    const result = extractSkills(text, testDictionary);
    
    expect(result).toContain('react');
    expect(result).toContain('typescript');
    expect(result.length).toBe(2);
  });

  test('should extract skills using aliases', () => {
    const text = '熟练掌握TS和Node开发';
    const result = extractSkills(text, testDictionary);
    
    expect(result).toContain('typescript');
    expect(result).toContain('node.js');
  });

  test('should handle case insensitive matching', () => {
    const text = '熟练掌握react和TYPESCRIPT开发';
    const result = extractSkills(text, testDictionary);
    
    expect(result).toContain('react');
    expect(result).toContain('typescript');
  });

  test('should return empty array for no matches', () => {
    const text = '没有任何技术词汇';
    const result = extractSkills(text, testDictionary);
    
    expect(result).toEqual([]);
  });

  test('should handle multiple occurrences of same skill', () => {
    const text = 'React和react和REACT开发经验';
    const result = extractSkills(text, testDictionary);
    
    expect(result).toEqual(['react']);
  });

  test('should handle punctuation and spacing variations', () => {
    const text = '熟悉 React、TypeScript、以及 AWS 云服务';
    const result = extractSkills(text, testDictionary);
    
    expect(result).toContain('react');
    expect(result).toContain('typescript');
    expect(result).toContain('aws');
  });

  test('should handle hyphenated skill names', () => {
    const text = '熟悉 node.js 和 kubernetes 部署';
    const result = extractSkills(text, testDictionary);
    
    expect(result).toContain('node.js');
    expect(result).toContain('kubernetes');
  });

  test('should handle skills with special characters', () => {
    const text = '使用 k8s 进行容器编排';
    const result = extractSkills(text, testDictionary);
    
    expect(result).toContain('kubernetes');
  });
});