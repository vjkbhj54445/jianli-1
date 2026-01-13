// __tests__/domain/scoring/score.test.ts
import { calculateJdScore, ResumeProfile } from '@/domain/scoring/score';
import { DictionaryItem } from '@/domain/extract/skills';

describe('calculateJdScore', () => {
  // 创建测试用的词典
  const testDictionaries: DictionaryItem[] = [
    { key: 'react', aliases: ['React', 'ReactJS'], category: 'frontend' },
    { key: 'typescript', aliases: ['TS', 'TypeScript'], category: 'frontend' },
    { key: 'node.js', aliases: ['Node', 'NodeJS'], category: 'backend' },
    { key: 'aws', aliases: ['Amazon Web Services'], category: 'cloud' },
    { key: 'docker', aliases: ['Docker'], category: 'devops' },
    { key: 'kubernetes', aliases: ['k8s'], category: 'devops' }
  ];

  test('should calculate score based on tech matching', () => {
    const jdText = '需要熟练掌握React和TypeScript';
    const resumeProfile: ResumeProfile = {
      tech: ['react', 'typescript'],
      role: [],
      scene: []
    };

    const result = calculateJdScore(jdText, resumeProfile, testDictionaries);

    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.breakdown.tech).toBeGreaterThan(0);
    expect(result.hit.tech).toContain('react');
    expect(result.hit.tech).toContain('typescript');
  });

  test('should handle partial matching', () => {
    const jdText = '需要熟练掌握React、TypeScript和Node.js';
    const resumeProfile: ResumeProfile = {
      tech: ['react', 'typescript'], // 缺少 node.js
      role: [],
      scene: []
    };

    const result = calculateJdScore(jdText, resumeProfile, testDictionaries);

    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.hit.tech.length).toBe(2); // react 和 typescript
    expect(result.missing.tech.length).toBe(1); // node.js
  });

  test('should handle no matching case', () => {
    const jdText = '需要熟练掌握React和TypeScript';
    const resumeProfile: ResumeProfile = {
      tech: ['vue', 'javascript'], // 与JD不匹配
      role: [],
      scene: []
    };

    const result = calculateJdScore(jdText, resumeProfile, testDictionaries);

    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.hit.tech.length).toBe(0);
    expect(result.missing.tech.length).toBeGreaterThan(0);
  });

  test('should handle empty inputs', () => {
    const jdText = '';
    const resumeProfile: ResumeProfile = {
      tech: [],
      role: [],
      scene: []
    };

    const result = calculateJdScore(jdText, resumeProfile, testDictionaries);

    expect(result.totalScore).toBe(0);
    expect(result.breakdown.tech).toBe(0);
    expect(result.breakdown.role).toBe(0);
    expect(result.breakdown.scene).toBe(0);
  });

  test('should calculate hit rates correctly', () => {
    const jdText = '需要熟练掌握React、TypeScript和Node.js';
    const resumeProfile: ResumeProfile = {
      tech: ['react', 'typescript'], // 2/3 匹配
      role: [],
      scene: []
    };

    const result = calculateJdScore(jdText, resumeProfile, testDictionaries);

    expect(result.techHitRate).toBe(2/3); // 2 out of 3
  });
});