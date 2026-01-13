import { isTelemetryEnabled } from '@/infra/privacy';
import cloudDictionary from '@/lib/dictionaries/cloud.json';
import sreDictionary from '@/lib/dictionaries/sre.json';
import mlopsDictionary from '@/lib/dictionaries/mlops.json';

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

// 获取所有有效技能字典
const getAllSkillsDictionary = () => {
  const allDictionaries = [...cloudDictionary, ...sreDictionary, ...mlopsDictionary];
  return new Set(allDictionaries.map(item => item.key));
};

// 上报简历统计数据
export async function trackResumeStats(
  targetRole?: string,
  eduLevel?: 'dazhuan' | 'benke' | 'shuoshi_plus' | 'unknown',
  expBucket?: '0-1' | '1-3' | '3-5' | '5+' | 'unknown',
  jdMatchScore?: number,
  skillTags?: string[],
  missingTags?: string[]
): Promise<void> {
  // 实时检查遥测开关状态
  if (!localStorage.getItem('resume_lab_telemetry_enabled') || 
      localStorage.getItem('resume_lab_telemetry_enabled') !== 'true') {
    return;
  }

  try {
    const anonId = localStorage.getItem('resume_lab_anon_id');
    
    if (!anonId) {
      console.warn('No anonId found, skipping resume stats tracking');
      return;
    }

    // 过滤技能标签，只保留字典中存在的标签
    const validSkillTags = skillTags?.filter(tag => 
      getAllSkillsDictionary().has(tag)
    ) || [];

    const validMissingTags = missingTags?.filter(tag => 
      getAllSkillsDictionary().has(tag)
    ) || [];

    // 发送请求，带重试机制
    const MAX_RETRIES = 2;
    let retryCount = 0;
    
    const sendRequest = async (): Promise<Response> => {
      try {
        return await fetch('/api/resume-stats', {
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
            skillTags: validSkillTags,
            missingTags: validMissingTags,
          }),
        });
      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          // 等待1秒后重试
          await new Promise(resolve => setTimeout(resolve, 1000));
          return sendRequest();
        }
        throw error;
      }
    };

    const response = await sendRequest();

    if (!response.ok) {
      console.error('Failed to track resume stats:', await response.text());
    }
  } catch (error) {
    console.error('Error tracking resume stats:', error);
  }
}