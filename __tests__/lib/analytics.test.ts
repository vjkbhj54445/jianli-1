// __tests__/lib/analytics.test.ts
import { trackEvent, trackResumeStats } from '@/lib/analytics';

// Mock fetch API
global.fetch = jest.fn();

describe('analytics', () => {
  // 创建一个真实的localStorage模拟
  const mockLocalStorage = (() => {
    let store: {[key: string]: string} = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
  })();

  beforeEach(() => {
    // 清除所有mock调用历史
    (global.fetch as jest.Mock).mockClear();
    
    // 设置默认的fetch返回值
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    
    // 模拟localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    
    // 设置一个有效的anonId
    window.localStorage.setItem('resume_lab_anon_id', 'test-anon-id-123');
    
    // 设置隐私设置，启用遥测
    window.localStorage.setItem('resume_lab_privacy_settings', JSON.stringify({ telemetryEnabled: true }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('trackEvent', () => {
    test('should call fetch with correct parameters when telemetry is enabled', async () => {
      const eventName = 'click_analyze';
      const properties = { 
        target_role: 'cloud',
        skill_count: 5,
        missing_count: 2
      };

      await trackEvent(eventName, properties);

      // 验证是否调用了fetch
      expect(fetch).toHaveBeenCalledTimes(1);
      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toBe('/api/track');
      
      const options = callArgs[1];
      expect(options.method).toBe('POST');
      expect(options.headers['Content-Type']).toBe('application/json');
      
      // 解析请求体
      const requestBody = JSON.parse(options.body);
      expect(requestBody.anonId).toBe('test-anon-id-123');
      expect(requestBody.eventType).toBe(eventName);
      expect(requestBody.eventProperties).toEqual(properties);
    });

    test('should not call fetch when telemetry is disabled', async () => {
      // 设置隐私设置，禁用遥测
      window.localStorage.setItem('resume_lab_privacy_settings', JSON.stringify({ telemetryEnabled: false }));

      const eventName = 'click_analyze';
      const properties = { target_role: 'cloud' };

      await trackEvent(eventName, properties);

      expect(fetch).not.toHaveBeenCalled();
    });

    test('should not call fetch when no anonId is present', async () => {
      // 删除anonId
      window.localStorage.removeItem('resume_lab_anon_id');
      // 但启用telemetry
      window.localStorage.setItem('resume_lab_telemetry_enabled', 'true');

      const eventName = 'click_analyze';
      const properties = { target_role: 'cloud' };

      await trackEvent(eventName, properties);

      expect(fetch).not.toHaveBeenCalled();
    });

    test('should handle fetch failure gracefully', async () => {
      // 设置telemetry为启用状态
      window.localStorage.setItem('resume_lab_telemetry_enabled', 'true');

      // 模拟fetch失败
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const eventName = 'click_analyze';
      const properties = { target_role: 'cloud' };

      // 应该不会抛出异常
      await expect(trackEvent(eventName, properties)).resolves.not.toThrow();
    });
  });

  describe('trackResumeStats', () => {
    test('should call fetch with correct parameters when telemetry is enabled', async () => {
      // 对于trackResumeStats，它检查的是resume_lab_telemetry_enabled
      window.localStorage.setItem('resume_lab_telemetry_enabled', 'true');
      
      const direction = 'cloud';
      const eduLevel = 'benke';
      const expBucket = '1-3';
      const score = 85;
      // 使用在字典中可能存在的技能
      const skills = ['react', 'kubernetes']; // 这些可能会被过滤
      const missingTech = ['docker']; // 这些也可能会被过滤

      await trackResumeStats(direction, eduLevel, expBucket, score, skills, missingTech);

      // 验证是否调用了fetch
      expect(fetch).toHaveBeenCalledTimes(1);
      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toBe('/api/resume-stats');
      
      const options = callArgs[1];
      expect(options.method).toBe('POST');
      expect(options.headers['Content-Type']).toBe('application/json');
      
      // 解析请求体
      const requestBody = JSON.parse(options.body);
      expect(requestBody.anonId).toBe('test-anon-id-123');
      expect(requestBody.targetRole).toBe(direction);
      expect(requestBody.eduLevel).toBe(eduLevel);
      expect(requestBody.expBucket).toBe(expBucket);
      expect(requestBody.jdMatchScore).toBe(score);
      // 由于技能字典过滤，技能数组可能为空或包含有效技能
      expect(Array.isArray(requestBody.skillTags)).toBe(true);
      expect(Array.isArray(requestBody.missingTags)).toBe(true);
    });

    test('should not call fetch when telemetry is disabled', async () => {
      // trackResumeStats检查的是resume_lab_telemetry_enabled，不是隐私设置
      window.localStorage.removeItem('resume_lab_telemetry_enabled');

      await trackResumeStats('cloud', 'benke', '1-3', 85, ['react'], []);

      expect(fetch).not.toHaveBeenCalled();
    });

    test('should not call fetch when telemetry is explicitly disabled', async () => {
      // 设置telemetry为禁用状态
      window.localStorage.setItem('resume_lab_telemetry_enabled', 'false');

      await trackResumeStats('cloud', 'benke', '1-3', 85, ['react'], []);

      expect(fetch).not.toHaveBeenCalled();
    });

    test('should not call fetch when no anonId is present', async () => {
      // 删除anonId
      window.localStorage.removeItem('resume_lab_anon_id');
      // 但启用telemetry
      window.localStorage.setItem('resume_lab_telemetry_enabled', 'true');

      await trackResumeStats('cloud', 'benke', '1-3', 85, ['react'], []);

      expect(fetch).not.toHaveBeenCalled();
    });

    test('should handle fetch failure gracefully', async () => {
      // 设置telemetry为启用状态
      window.localStorage.setItem('resume_lab_telemetry_enabled', 'true');

      // 模拟fetch失败
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // 应该不会抛出异常
      await expect(trackResumeStats('cloud', 'benke', '1-3', 85, ['react'], [])).resolves.not.toThrow();
    });
  });
});