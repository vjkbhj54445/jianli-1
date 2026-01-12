/**
 * 从文本中提取角色标签
 * @param text 输入文本
 * @returns 角色标签数组
 */
export function extractRoleTags(text: string): string[] {
  const lowerText = text.toLowerCase();
  const roleKeywords: Record<string, string[]> = {
    'software-engineer': ['软件工程师', 'software engineer', '开发工程师', 'developer', '程序员', 'programmer'],
    'senior-engineer': ['高级工程师', 'senior engineer', '高级开发', 'sr. developer', '资深工程师'],
    'architect': ['架构师', 'architect', 'solution architect', '技术专家', 'tech expert'],
    'team-lead': ['技术负责人', 'team lead', 'tech lead', '项目经理', 'project manager', 'tech manager'],
    'devops-engineer': ['devops工程师', 'devops engineer', '运维工程师', 'sre', 'site reliability engineer'],
    'data-engineer': ['数据工程师', 'data engineer', '大数据工程师', 'big data engineer'],
    'ml-engineer': ['机器学习工程师', 'ml engineer', '人工智能工程师', 'ai engineer', '算法工程师'],
    'fullstack-developer': ['全栈工程师', 'fullstack developer', 'full-stack', '全端工程师'],
    'frontend-developer': ['前端工程师', 'frontend developer', 'web developer', 'javascript developer'],
    'backend-developer': ['后端工程师', 'backend developer', 'server-side developer'],
    'mobile-developer': ['移动端开发', 'mobile developer', 'ios developer', 'android developer'],
    'qa-tester': ['测试工程师', 'qa', 'tester', 'quality assurance', '自动化测试'],
    'product-manager': ['产品经理', 'product manager', 'pm', '产品专员'],
    'technical-support': ['技术支持', 'technical support', 'support engineer', 'customer success']
  };

  const roles: string[] = [];
  for (const [role, keywords] of Object.entries(roleKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      roles.push(role);
    }
  }

  return [...new Set(roles)]; // 去重
}

/**
 * 从文本中提取场景标签
 * @param text 输入文本
 * @returns 场景标签数组
 */
export function extractSceneTags(text: string): string[] {
  const lowerText = text.toLowerCase();
  const sceneKeywords: Record<string, string[]> = {
    'ecommerce': ['电商', '电商系统', 'e-commerce', '零售', '在线销售', '交易平台'],
    'fintech': ['金融科技', 'fintech', '支付', '银行', '证券', '保险科技', '区块链'],
    'healthcare': ['医疗健康', 'healthcare', '电子病历', '远程医疗', '健康科技'],
    'education': ['教育', 'edtech', '在线教育', '学习平台', '教学系统'],
    'social-media': ['社交媒体', 'social media', '社区', '内容平台', '用户互动'],
    'logistics': ['物流', '物流系统', '供应链', '配送', '仓储', '运输'],
    'gaming': ['游戏', 'gaming', '游戏开发', '娱乐', '互动娱乐'],
    'video-streaming': ['视频流', 'video streaming', '直播', '媒体平台', '内容分发'],
    'iot': ['物联网', 'iot', '智能硬件', '传感器', '智能设备'],
    'automotive': ['汽车', 'automotive', '车联网', '自动驾驶', '智能交通'],
    'enterprise-software': ['企业软件', 'enterprise software', 'saas', 'paas', 'crm', 'erp'],
    'cybersecurity': ['网络安全', 'cybersecurity', '信息安全', '安全防护', '数据安全'],
    'cloud-computing': ['云计算', 'cloud computing', '云服务', '分布式计算', '弹性扩展'],
    'data-analytics': ['数据分析', 'data analytics', 'bi', '数据挖掘', '报表系统'],
    'ai-ml': ['人工智能', 'artificial intelligence', '机器学习', '深度学习', '算法模型']
  };

  const scenes: string[] = [];
  for (const [scene, keywords] of Object.entries(sceneKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      scenes.push(scene);
    }
  }

  return [...new Set(scenes)]; // 去重
}