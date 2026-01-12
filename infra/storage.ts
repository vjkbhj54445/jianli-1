import { v4 as uuidv4 } from 'uuid';
import { Resume } from '@/domain/resume/schema';

// 版本号
export const STORAGE_VERSION = '1.0.0';

// 存储键定义
export const STORAGE_KEYS = {
  ANON_ID: 'resume_lab_anon_id',
  PRIVACY_SETTINGS: 'resume_lab_privacy_settings',
  VERSION: 'resume_lab_storage_version',
  RESUME_DRAFT: 'resume_lab_resume_draft'
} as const;

/**
 * 获取或创建匿名ID
 * @returns 匿名ID字符串
 */
export function getOrCreateAnonId(): string {
  let anonId = localStorage.getItem(STORAGE_KEYS.ANON_ID);
  
  if (!anonId) {
    anonId = uuidv4();
    localStorage.setItem(STORAGE_KEYS.ANON_ID, anonId);
  }
  
  return anonId;
}

/**
 * 获取当前存储的版本号
 * @returns 版本号字符串
 */
export function getStorageVersion(): string | null {
  return localStorage.getItem(STORAGE_KEYS.VERSION);
}

/**
 * 设置存储版本号
 * @param version 版本号
 */
export function setStorageVersion(version: string): void {
  localStorage.setItem(STORAGE_KEYS.VERSION, version);
}

/**
 * 清除本项目的本地存储数据
 */
export function clearProjectData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * 获取所有本项目的存储键名
 * @returns 存储键名数组
 */
export function getProjectStorageKeys(): string[] {
  const allKeys = Object.keys(localStorage);
  const projectKeyNames = Object.values(STORAGE_KEYS);
  
  return allKeys.filter(key => 
    projectKeyNames.includes(key as keyof typeof STORAGE_KEYS) || 
    key.startsWith('resume_lab_')
  );
}

/**
 * 保存简历草稿到本地存储
 * @param resume 简历对象
 */
export function saveResumeDraft(resume: Resume): void {
  try {
    const draftData = {
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      resume: resume
    };
    localStorage.setItem(STORAGE_KEYS.RESUME_DRAFT, JSON.stringify(draftData));
  } catch (error) {
    console.error('Error saving resume draft:', error);
  }
}

/**
 * 从本地存储获取简历草稿
 * @returns 简历对象或null
 */
export function getResumeDraft(): Resume | null {
  try {
    const draftString = localStorage.getItem(STORAGE_KEYS.RESUME_DRAFT);
    if (draftString) {
      const draftData = JSON.parse(draftString);
      
      // 检查版本兼容性
      if (draftData.version === STORAGE_VERSION) {
        return draftData.resume as Resume;
      } else {
        console.warn('Resume draft version mismatch, discarding old draft');
        return null;
      }
    }
  } catch (error) {
    console.error('Error loading resume draft:', error);
  }
  
  return null;
}

/**
 * 清除简历草稿
 */
export function clearResumeDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.RESUME_DRAFT);
  } catch (error) {
    console.error('Error clearing resume draft:', error);
  }
}