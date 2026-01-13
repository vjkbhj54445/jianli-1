# 变更日志 (Changelog)

## [最新版本] - 2026-01-13

### 🚀 功能增强

#### JD匹配页面优化 (app/jd-match/page.tsx)
- 添加了加载状态指示器，提升用户体验
- 实现了长标签的截断和省略号显示，改善UI布局
- 优化了响应式设计，确保在各种屏幕尺寸下的良好显示
- 增加了无障碍访问支持（ARIA标签、颜色对比度等）

#### 简历技能提取优化 (domain/extract/skills.ts)
- 修复了正则表达式匹配精度问题，避免了误匹配
- 优化了技能提取算法，提高了匹配准确性
- 重构了匹配逻辑，使其更加高效和准确

#### 简历经验提取优化 (domain/extract/exp.ts)
- 修复了经验年限提取的边界条件问题
- 优化了日期解析逻辑，支持更多格式
- 增强了提取结果的准确性

#### 评分算法优化 (domain/scoring/score.ts)
- 修复了评分计算中的边界条件问题
- 优化了匹配算法，提升了评分准确性
- 改进了命中率计算逻辑

#### 数据追踪优化 (lib/analytics.ts)
- 增强了遥测数据的安全性和隐私保护
- 优化了数据上报逻辑，确保符合隐私规范
- 添加了错误处理和重试机制

### ✅ 测试覆盖增强

#### 新增测试文件
- `__tests__/domain/extract/exp.test.ts` - 经验提取模块测试
- `__tests__/domain/scoring/score.test.ts` - 评分模块测试
- `__tests__/app/jd-match.test.tsx` - JD匹配页面组件测试
- `__tests__/domain/extract/skills.test.ts` - 技能提取模块测试
- `__tests__/domain/extract/edu.test.ts` - 教育背景提取测试
- `__tests__/domain/extract/jd.test.ts` - JD信息提取测试
- `__tests__/domain/scoring/suggest.test.ts` - 建议生成模块测试
- `__tests__/lib/analytics.test.ts` - 数据追踪模块测试
- `__tests__/domain/bullets/generator.test.ts` - Bullets生成器测试

#### 测试覆盖率显著提升
- domain/extract 模块达到 96.11% 的语句覆盖率
- analytics.ts 达到 96.22% 的语句覆盖率
- 整体代码覆盖率从约17%提升至约25%

### 🔧 项目配置更新

#### package.json 更新
- 添加了测试相关依赖 (jest, @testing-library 等)
- 添加了测试脚本 ("test", "test:watch", "test:coverage")

#### Jest 配置
- 添加了 jest.config.js 配置文件
- 配置了覆盖率阈值和测试环境
- 设置了模块映射和路径别名支持

#### 测试设置
- 添加了 jest.setup.js 初始化文件
- 配置了 DOM 环境和 localStorage 模拟

### 🔒 安全与隐私增强
- 确保所有数据处理都在客户端进行，不上传原始简历文本
- 优化了遥测数据收集，仅收集匿名统计信息
- 加强了隐私保护措施

### 📝 文档更新
- 更新了 README.md 文件，包含项目介绍、安装和运行说明
- 创建了详细的变更日志 (CHANGELOG.md)

---

## 项目结构说明

### 核心目录
- `app/` - Next.js 14 App Router 页面组件
- `domain/` - 业务逻辑层，包含提取、评分、建议等功能
- `lib/` - 通用工具库
- `components/` - React UI 组件
- `__tests__/` - 测试文件
- `infra/` - 基础设施相关代码

### 技术栈
- Next.js 14.2.35 (App Router)
- React 18.2.0
- TypeScript 5.3.3
- Tailwind CSS 3.4.1
- Jest 29.x 用于测试