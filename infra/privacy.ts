import { STORAGE_KEYS } from './storage';

interface PrivacySettings {
  telemetryEnabled: boolean; // 遥测数据是否启用
}

const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  telemetryEnabled: false
};

/**
 * 获取隐私设置
 * @returns 当前隐私设置
 */
export function getPrivacySettings(): PrivacySettings {
  try {
    const settingsString = localStorage.getItem(STORAGE_KEYS.PRIVACY_SETTINGS);
    if (settingsString) {
      return JSON.parse(settingsString);
    }
  } catch (error) {
    console.error('Error reading privacy settings:', error);
  }
  
  return DEFAULT_PRIVACY_SETTINGS;
}

/**
 * 保存隐私设置
 * @param settings 新的隐私设置
 */
export function savePrivacySettings(settings: Partial<PrivacySettings>): void {
  try {
    const currentSettings = getPrivacySettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem(STORAGE_KEYS.PRIVACY_SETTINGS, JSON.stringify(updatedSettings));
  } catch (error) {
    console.error('Error saving privacy settings:', error);
  }
}

/**
 * 检查遥测数据是否已启用
 * @returns 是否启用遥测数据
 */
export function isTelemetryEnabled(): boolean {
  const settings = getPrivacySettings();
  return settings.telemetryEnabled;
}

/**
 * 设置遥测数据启用状态
 * @param enabled 是否启用遥测数据
 */
export function setTelemetryEnabled(enabled: boolean): void {
  savePrivacySettings({ telemetryEnabled: enabled });
}