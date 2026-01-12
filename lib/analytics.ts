import { isTelemetryEnabled } from '@/infra/privacy';

// 定义事件类型枚举
export type EventType = 
  | 'page_view'
  | 'click_analyze'
  | 'click_export_pdf'
  | 'click_export_word'
  | 'click_save_draft'
  | 'click_load_draft'
  | 'click_clear_draft'
  | 'click_privacy_setting'
  | 'click_reset_anon_id'
  | 'click_clear_data';

// 定义事件属性类型
export interface EventProperties {
  page?: string;
  component?: string;
  action?: string;
  [key: string]: unknown;
}

// 上报事件
export async function trackEvent(
  eventType: EventType,
  eventProperties?: EventProperties
): Promise<void> {
  if (!isTelemetryEnabled()) {
    return; // 如果遥测未启用，直接返回
  }

  try {
    const anonId = localStorage.getItem('resume_lab_anon_id');
    
    if (!anonId) {
      console.warn('No anonId found, skipping event tracking');
      return;
    }

    // 只允许白名单内的属性
    const allowedProperties: EventProperties = {};
    if (eventProperties) {
      // 定义允许的属性白名单
      const allowedKeys = [
        'page', 'component', 'action', 'target_role', 'edu_level', 'exp_bucket', 
        'jd_match_score', 'skill_count', 'missing_count', 'button_type', 'tab'
      ];
      
      for (const [key, value] of Object.entries(eventProperties)) {
        if (allowedKeys.includes(key) && 
            (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
          allowedProperties[key] = value;
        }
      }
    }

    const response = await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        anonId,
        eventType,
        eventProperties: allowedProperties,
      }),
    });

    if (!response.ok) {
      console.error('Failed to track event:', await response.text());
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

// 上报简历统计数据
export async function trackResumeStats(
  targetRole?: string,
  eduLevel?: 'dazhuan' | 'benke' | 'shuoshi_plus' | 'unknown',
  expBucket?: '0-1' | '1-3' | '3-5' | '5+' | 'unknown',
  jdMatchScore?: number,
  skillTags?: string[],
  missingTags?: string[]
): Promise<void> {
  if (!isTelemetryEnabled()) {
    return; // 如果遥测未启用，直接返回
  }

  try {
    const anonId = localStorage.getItem('resume_lab_anon_id');
    
    if (!anonId) {
      console.warn('No anonId found, skipping resume stats tracking');
      return;
    }

    const response = await fetch('/api/resume-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        anonId,
        targetRole,
        eduLevel,
        expBucket,
        jdMatchScore,
        skillTags: skillTags || [],
        missingTags: missingTags || [],
      }),
    });

    if (!response.ok) {
      console.error('Failed to track resume stats:', await response.text());
    }
  } catch (error) {
    console.error('Error tracking resume stats:', error);
  }
}