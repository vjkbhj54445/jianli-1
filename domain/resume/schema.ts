import { z } from 'zod';

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, '技能名称不能为空'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
    required_error: '请选择技能等级'
  }).optional(),
  category: z.string().optional()
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, '项目名称不能为空'),
  description: z.string().min(1, '项目描述不能为空'),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, '开始日期格式应为YYYY-MM'),
  endDate: z.string().regex(/^\d{4}-\d{2}$/, '结束日期格式应为YYYY-MM').optional().or(z.literal('')),
  url: z.string().url('URL格式不正确').optional().or(z.literal('')),
  highlights: z.array(z.string()).optional()
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, '公司名称不能为空'),
  position: z.string().min(1, '职位名称不能为空'),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, '开始日期格式应为YYYY-MM'),
  endDate: z.string().regex(/^\d{4}-\d{2}$/, '结束日期格式应为YYYY-MM').optional().or(z.literal('')),
  summary: z.string().min(1, '工作摘要不能为空'),
  highlights: z.array(z.string()).optional()
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, '机构名称不能为空'),
  degree: z.string().min(1, '学位不能为空'),
  field: z.string().min(1, '专业不能为空'),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, '开始日期格式应为YYYY-MM'),
  endDate: z.string().regex(/^\d{4}-\d{2}$/, '结束日期格式应为YYYY-MM').optional().or(z.literal(''))
});

export const basicsSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  email: z.string().email('邮箱格式不正确'),
  phone: z.string().optional(),
  website: z.string().url('网站URL格式不正确').optional().or(z.literal('')),
  location: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional()
});

export const resumeSchema = z.object({
  basics: basicsSchema,
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema)
});

export type Resume = z.infer<typeof resumeSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Basics = z.infer<typeof basicsSchema>;