// __tests__/app/jd-match.test.tsx
import { render, screen } from '@testing-library/react';
import JdMatchPage from '@/app/jd-match/page';

// 模拟页面组件依赖
jest.mock('@/domain/extract/skills', () => ({
  extractSkills: (text: string, dictionaries: any[]) => {
    if (text.includes('react')) return ['react'];
    if (text.includes('typescript')) return ['typescript'];
    return [];
  }
}));

jest.mock('@/domain/extract/edu', () => ({
  extractEdu: (text: string) => {
    if (text.includes('本科')) return 'benke';
    if (text.includes('硕士')) return 'shuoshi_plus';
    return 'unknown';
  }
}));

jest.mock('@/domain/extract/exp', () => ({
  extractExpBucket: (text: string) => {
    if (text.includes('3年')) return '1-3';
    return 'unknown';
  }
}));

jest.mock('@/domain/extract/jd', () => ({
  extractRoleTags: (text: string) => {
    if (text.includes('前端')) return ['frontend'];
    return [];
  },
  extractSceneTags: (text: string) => {
    if (text.includes('云')) return ['cloud'];
    return [];
  }
}));

jest.mock('@/domain/scoring/score', () => ({
  calculateJdScore: (jdText: string, resumeProfile: any, dictionaries: any[]) => ({
    totalScore: 85,
    breakdown: {
      tech: 50,
      role: 10,
      scene: 10,
      bonus: 15
    },
    hit: {
      tech: ['react'],
      role: ['frontend'],
      scene: ['cloud']
    },
    missing: {
      tech: [],
      role: [],
      scene: []
    },
    techHitRate: 1,
    roleHitRate: 1,
    sceneHitRate: 1
  })
}));

jest.mock('@/domain/scoring/suggest', () => ({
  generateSuggestions: (scoringResult: any) => [
    '建议1',
    '建议2'
  ]
}));

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null),
  }),
}));

// Mock the shadcn/ui components
jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ children, ...props }: any) => (
    <textarea data-testid="textarea" {...props}>
      {children}
    </textarea>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div data-testid="card-content" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, ...props }: any) => (
    <div data-testid="card-header" {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, ...props }: any) => (
    <h3 data-testid="card-title" {...props}>
      {children}
    </h3>
  ),
}));

describe('JdMatchPage', () => {
  test('renders input fields and analyze button', () => {
    render(<JdMatchPage />);
    
    expect(screen.getByPlaceholderText('请输入职位描述...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入简历内容...')).toBeInTheDocument();
    expect(screen.getByText('开始分析')).toBeInTheDocument();
  });

  test('starts with empty results', () => {
    render(<JdMatchPage />);
    
    // 确保初始状态下没有显示结果
    expect(screen.queryByText('匹配度分析结果')).not.toBeInTheDocument();
  });
});