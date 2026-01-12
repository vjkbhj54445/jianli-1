export const useMediaQuery = (query: string): boolean => {
  // 在测试环境中，默认返回桌面视图
  if (query.includes('min-width: 768px')) {
    return true; // 模拟桌面屏幕尺寸
  }
  return false;
};