// __tests__/domain/scoring/suggest.test.ts
import { generateSuggestions } from '@/domain/scoring/suggest';

// 创建测试用的评分结果
const mockScoringResult = {
  totalScore: 75,
  breakdown: {
    tech: 40,
    role: 10,
    scene: 10,
    bonus: 15
  },
  hit: {
    tech: ['react', 'typescript'],
    role: ['frontend-developer'],
    scene: ['ecommerce']
  },
  missing: {
    tech: ['node.js', 'postgresql'],
    role: [],
    scene: ['cloud-computing']
  },
  techHitRate: 0.6,
  roleHitRate: 0.8,
  sceneHitRate: 0.4
};

describe('generateSuggestions', () => {
  test('should generate suggestions based on missing items', () => {
    const suggestions = generateSuggestions(mockScoringResult);
    
    expect(Array.isArray(suggestions)).toBe(true);
    expect(suggestions.length).toBeGreaterThan(0);
    
    // 检查是否有针对缺失技术的建议
    const hasTechSuggestion = suggestions.some(suggestion => 
      suggestion.toLowerCase().includes('node') || 
      suggestion.toLowerCase().includes('postgre') ||
      suggestion.toLowerCase().includes('sql')
    );
    
    expect(hasTechSuggestion).toBe(true);
  });

  test('should return suggestions when missing items exist', () => {
    const resultWithMissing = {
      ...mockScoringResult,
      missing: {
        tech: ['aws', 'docker'],
        role: [],
        scene: []
      }
    };
    
    const suggestions = generateSuggestions(resultWithMissing);
    expect(suggestions.length).toBeGreaterThan(0);
  });

  test('should return suggestions for low hit rates', () => {
    const resultLowHitRates = {
      ...mockScoringResult,
      techHitRate: 0.2,  // 很低的技术命中率
      sceneHitRate: 0.1, // 很低的场景命中率
      missing: {
        tech: ['many', 'missing', 'technologies'],
        role: [],
        scene: ['missing', 'scenes']
      }
    };
    
    const suggestions = generateSuggestions(resultLowHitRates);
    expect(suggestions.length).toBeGreaterThan(0);
  });

  test('should handle case with no missing items', () => {
    const resultNoMissing = {
      ...mockScoringResult,
      missing: {
        tech: [],
        role: [],
        scene: []
      }
    };
    
    const suggestions = generateSuggestions(resultNoMissing);
    // 即使没有缺失项，也应该有一些通用建议
    expect(Array.isArray(suggestions)).toBe(true);
  });

  test('should return at least minimum number of suggestions', () => {
    const suggestions = generateSuggestions(mockScoringResult);
    // 至少应该有一些基本建议
    expect(suggestions.length).toBeGreaterThan(0);
  });
});