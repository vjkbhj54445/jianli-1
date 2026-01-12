"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Dialog as AlertDialog,
  DialogContent as AlertDialogContent,
  DialogHeader as AlertDialogHeader,
  DialogTitle as AlertDialogTitle,
  DialogFooter as AlertDialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus,
  Minus,
  Download,
  FileText,
  Save,
  Upload,
  AlertTriangle
} from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, VerticalAlign } from "docx";
import { z } from "zod";
import { resumeSchema, Resume, Basics, Skill, Experience, Education, Project } from "@/domain/resume/schema";
import { saveResumeDraft, getResumeDraft, clearResumeDraft } from "@/infra/storage";
import { trackEvent } from "@/lib/analytics";

export default function ExportPage() {
  const [resume, setResume] = useState<Resume>({
    basics: {
      name: "",
      email: "",
      phone: "",
      website: "",
      location: "",
      headline: "",
      summary: ""
    },
    skills: [],
    projects: [],
    experience: [],
    education: []
  });
  const [activeTab, setActiveTab] = useState("basics");
  const [showLongBulletWarning, setShowLongBulletWarning] = useState(false);
  const [longBulletContent, setLongBulletContent] = useState("");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // 检查是否有草稿
  useEffect(() => {
    const draft = getResumeDraft();
    if (draft) {
      setResume(draft);
      setHasDraft(true);
    }
  }, []);

  // 生成PDF（保持原有功能）
  const generatePDF = () => {
    if (!checkLongBullets()) {
      return;
    }
    
    trackEvent('click_export_pdf');
    window.print();
  };

  // 生成DOCX文档
  const generateDocx = async () => {
    if (!checkLongBullets()) {
      return;
    }

    trackEvent('click_export_word');

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // 姓名
          new Paragraph({
            text: resume.basics.name,
            heading: HeadingLevel.HEADING_1,
            alignment: 1, // center
          }),
          
          // 联系信息
          new Paragraph({
            children: [
              new TextRun({
                text: [
                  resume.basics.email ? ` | ${resume.basics.email}` : "",
                  resume.basics.phone ? ` | ${resume.basics.phone}` : "",
                  resume.basics.location ? ` | ${resume.basics.location}` : "",
                  resume.basics.website ? ` | ${resume.basics.website}` : ""
                ].filter(Boolean).join(""),
                bold: true
              })
            ],
            alignment: 1 // center
          }),
          
          // 个人简介
          ...(resume.basics.summary ? [
            new Paragraph({
              text: "个人简介",
              heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
              text: resume.basics.summary
            })
          ] : []),
          
          // 技能
          ...(resume.skills.length > 0 ? [
            new Paragraph({
              text: "技能",
              heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: resume.skills.map(skill => skill.name).join(" | ")
                })
              ]
            })
          ] : []),
          
          // 工作经验
          ...(resume.experience.length > 0 ? [
            new Paragraph({
              text: "工作经验",
              heading: HeadingLevel.HEADING_2
            }),
            ...resume.experience.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({ text: exp.position, bold: true }),
                  new TextRun({ text: ` | ${exp.company}` }),
                  new TextRun({ text: ` | ${exp.startDate} - ${exp.endDate || "至今"}` })
                ]
              }),
              new Paragraph({
                text: exp.summary
              }),
              ...(exp.highlights && exp.highlights.length > 0 ? [
                new Paragraph({
                  children: exp.highlights.map((highlight, idx) => [
                    new TextRun({ text: `• ${highlight}` }),
                    ...(idx < exp.highlights!.length - 1 ? [new TextRun({ break: 1 })] : [])
                  ]).flat()
                })
              ] : [])
            ])
          ] : []),
          
          // 项目经验
          ...(resume.projects.length > 0 ? [
            new Paragraph({
              text: "项目经验",
              heading: HeadingLevel.HEADING_2
            }),
            ...resume.projects.flatMap(proj => [
              new Paragraph({
                children: [
                  new TextRun({ text: proj.name, bold: true }),
                  ...(proj.url ? [new TextRun({ text: ` (${proj.url})` })] : []),
                  new TextRun({ text: ` | ${proj.startDate} - ${proj.endDate || "至今"}` })
                ]
              }),
              new Paragraph({
                text: proj.description
              }),
              ...(proj.highlights && proj.highlights.length > 0 ? [
                new Paragraph({
                  children: proj.highlights.map((highlight, idx) => [
                    new TextRun({ text: `• ${highlight}` }),
                    ...(idx < proj.highlights!.length - 1 ? [new TextRun({ break: 1 })] : [])
                  ]).flat()
                })
              ] : [])
            ])
          ] : []),
          
          // 教育背景
          ...(resume.education.length > 0 ? [
            new Paragraph({
              text: "教育背景",
              heading: HeadingLevel.HEADING_2
            }),
            ...resume.education.map(edu => new Paragraph({
              children: [
                new TextRun({ text: edu.degree, bold: true }),
                new TextRun({ text: ` | ${edu.institution}` }),
                new TextRun({ text: ` | ${edu.field}` }),
                new TextRun({ text: ` | ${edu.startDate} - ${edu.endDate || "至今"}` })
              ]
            }))
          ] : [])
        ]
      }]
    });

    // 生成并下载
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.basics.name || '简历'}_导出.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 保存草稿
  const handleSaveDraft = () => {
    trackEvent('click_save_draft');
    setIsSavingDraft(true);
    saveResumeDraft(resume);
    setTimeout(() => {
      setIsSavingDraft(false);
      setHasDraft(true);
    }, 1000);
  };

  // 加载草稿
  const handleLoadDraft = () => {
    trackEvent('click_load_draft');
    const draft = getResumeDraft();
    if (draft) {
      setResume(draft);
    }
  };

  // 清除草稿
  const handleClearDraft = () => {
    trackEvent('click_clear_draft');
    clearResumeDraft();
    setHasDraft(false);
  };

  // 更新基本信息
  const updateBasics = (field: keyof Basics, value: string) => {
    setResume(prev => ({
      ...prev,
      basics: {
        ...prev.basics,
        [field]: value
      }
    }));
  };

  // 更新技能
  const updateSkill = (index: number, field: keyof Skill, value: string | undefined) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  // 添加技能
  const addSkill = () => {
    setResume(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        { id: Date.now().toString(), name: "", level: "intermediate", category: "" }
      ]
    }));
  };

  // 删除技能
  const removeSkill = (index: number) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // 更新经验
  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // 更新经验亮点
  const updateExperienceHighlight = (expIndex: number, highlightIndex: number, value: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? {
          ...exp,
          highlights: exp.highlights?.map((h, hi) => hi === highlightIndex ? value : h) || []
        } : exp
      )
    }));
  };

  // 添加经验亮点
  const addExperienceHighlight = (expIndex: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? {
          ...exp,
          highlights: [...(exp.highlights || []), ""]
        } : exp
      )
    }));
  };

  // 删除经验亮点
  const removeExperienceHighlight = (expIndex: number, highlightIndex: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? {
          ...exp,
          highlights: exp.highlights?.filter((_, hi) => hi !== highlightIndex) || []
        } : exp
      )
    }));
  };

  // 添加经验
  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { 
          id: Date.now().toString(), 
          company: "", 
          position: "", 
          startDate: "", 
          endDate: "", 
          summary: "",
          highlights: [""]
        }
      ]
    }));
  };

  // 删除经验
  const removeExperience = (index: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // 更新项目
  const updateProject = (index: number, field: keyof Project, value: string) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  // 更新项目亮点
  const updateProjectHighlight = (projIndex: number, highlightIndex: number, value: string) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === projIndex ? {
          ...proj,
          highlights: proj.highlights?.map((h, hi) => hi === highlightIndex ? value : h) || []
        } : proj
      )
    }));
  };

  // 添加项目亮点
  const addProjectHighlight = (projIndex: number) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === projIndex ? {
          ...proj,
          highlights: [...(proj.highlights || []), ""]
        } : proj
      )
    }));
  };

  // 删除项目亮点
  const removeProjectHighlight = (projIndex: number, highlightIndex: number) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === projIndex ? {
          ...proj,
          highlights: proj.highlights?.filter((_, hi) => hi !== highlightIndex) || []
        } : proj
      )
    }));
  };

  // 添加项目
  const addProject = () => {
    setResume(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { 
          id: Date.now().toString(), 
          name: "", 
          description: "", 
          startDate: "", 
          endDate: "", 
          url: "",
          highlights: [""]
        }
      ]
    }));
  };

  // 删除项目
  const removeProject = (index: number) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // 更新教育背景
  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // 添加教育背景
  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { 
          id: Date.now().toString(), 
          institution: "", 
          degree: "", 
          field: "", 
          startDate: "", 
          endDate: "" 
        }
      ]
    }));
  };

  // 删除教育背景
  const removeEducation = (index: number) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // 检查并处理超长bullets
  const checkLongBullets = () => {
    const allHighlights = [
      ...resume.experience.flatMap(exp => exp.highlights || []),
      ...resume.projects.flatMap(proj => proj.highlights || [])
    ];
    
    const longBullets = allHighlights.filter(bullet => bullet.length > 150);
    
    if (longBullets.length > 0) {
      setLongBulletContent(longBullets.join("\n"));
      setShowLongBulletWarning(true);
      return false;
    }
    return true;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">导出简历</h1>
        <div className="flex space-x-2">
          {hasDraft && (
            <Button variant="outline" onClick={handleLoadDraft} className="flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              加载草稿
            </Button>
          )}
          <Button onClick={handleSaveDraft} disabled={isSavingDraft} className="flex items-center">
            <Save className="w-4 h-4 mr-2" />
            {isSavingDraft ? '保存中...' : '保存草稿'}
          </Button>
          <Button onClick={generatePDF} className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            导出PDF
          </Button>
          <Button onClick={generateDocx} className="flex items-center bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            导出Word
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basics">基本信息</TabsTrigger>
          <TabsTrigger value="skills">技能</TabsTrigger>
          <TabsTrigger value="experience">工作经验</TabsTrigger>
          <TabsTrigger value="projects">项目经验</TabsTrigger>
          <TabsTrigger value="education">教育背景</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">姓名 *</Label>
                  <Input
                    id="name"
                    value={resume.basics.name}
                    onChange={(e) => updateBasics("name", e.target.value)}
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <Label htmlFor="email">邮箱 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resume.basics.email}
                    onChange={(e) => updateBasics("email", e.target.value)}
                    placeholder="请输入邮箱"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">电话</Label>
                  <Input
                    id="phone"
                    value={resume.basics.phone || ""}
                    onChange={(e) => updateBasics("phone", e.target.value)}
                    placeholder="请输入电话"
                  />
                </div>
                <div>
                  <Label htmlFor="website">网站</Label>
                  <Input
                    id="website"
                    value={resume.basics.website || ""}
                    onChange={(e) => updateBasics("website", e.target.value)}
                    placeholder="请输入个人网站或博客"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">位置</Label>
                <Input
                  id="location"
                  value={resume.basics.location || ""}
                  onChange={(e) => updateBasics("location", e.target.value)}
                  placeholder="请输入所在城市"
                />
              </div>
              <div>
                <Label htmlFor="headline">求职意向</Label>
                <Input
                  id="headline"
                  value={resume.basics.headline || ""}
                  onChange={(e) => updateBasics("headline", e.target.value)}
                  placeholder="请输入求职意向，如：前端开发工程师"
                />
              </div>
              <div>
                <Label htmlFor="summary">个人简介</Label>
                <Textarea
                  id="summary"
                  value={resume.basics.summary || ""}
                  onChange={(e) => updateBasics("summary", e.target.value)}
                  placeholder="请输入个人简介，概述您的专业背景和职业目标"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>技能</CardTitle>
              <Button onClick={addSkill} className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                添加技能
              </Button>
            </CardHeader>
            <CardContent>
              {resume.skills.length === 0 ? (
                <p className="text-gray-500 text-center py-4">暂无技能，请点击上方按钮添加</p>
              ) : (
                <div className="space-y-4">
                  {resume.skills.map((skill, index) => (
                    <div key={skill.id} className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Label>技能名称</Label>
                        <Input
                          value={skill.name}
                          onChange={(e) => updateSkill(index, "name", e.target.value)}
                          placeholder="如：JavaScript"
                        />
                      </div>
                      <div className="w-32">
                        <Label>技能等级</Label>
                        <Select
                          value={skill.level || "intermediate"}
                          onValueChange={(value) => updateSkill(index, "level", value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择等级" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">初级</SelectItem>
                            <SelectItem value="intermediate">中级</SelectItem>
                            <SelectItem value="advanced">高级</SelectItem>
                            <SelectItem value="expert">专家</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-32">
                        <Label>分类</Label>
                        <Input
                          value={skill.category || ""}
                          onChange={(e) => updateSkill(index, "category", e.target.value)}
                          placeholder="如：前端"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeSkill(index)}
                        className="h-9 w-9"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="experience" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>工作经验</CardTitle>
              <Button onClick={addExperience} className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                添加经验
              </Button>
            </CardHeader>
            <CardContent>
              {resume.experience.length === 0 ? (
                <p className="text-gray-500 text-center py-4">暂无工作经验，请点击上方按钮添加</p>
              ) : (
                <div className="space-y-6">
                  {resume.experience.map((exp, index) => (
                    <div key={exp.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">经验 {index + 1}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeExperience(index)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor={`exp-company-${index}`}>公司 *</Label>
                          <Input
                            id={`exp-company-${index}`}
                            value={exp.company}
                            onChange={(e) => updateExperience(index, "company", e.target.value)}
                            placeholder="请输入公司名称"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`exp-position-${index}`}>职位 *</Label>
                          <Input
                            id={`exp-position-${index}`}
                            value={exp.position}
                            onChange={(e) => updateExperience(index, "position", e.target.value)}
                            placeholder="请输入职位名称"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor={`exp-startDate-${index}`}>开始日期 *</Label>
                          <Input
                            id={`exp-startDate-${index}`}
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`exp-endDate-${index}`}>结束日期</Label>
                          <Input
                            id={`exp-endDate-${index}`}
                            type="month"
                            value={exp.endDate || ""}
                            onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <Label htmlFor={`exp-summary-${index}`}>工作摘要 *</Label>
                        <Textarea
                          id={`exp-summary-${index}`}
                          value={exp.summary}
                          onChange={(e) => updateExperience(index, "summary", e.target.value)}
                          placeholder="请简要描述您的工作职责和成就"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>工作亮点</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addExperienceHighlight(index)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            添加亮点
                          </Button>
                        </div>
                        
                        {exp.highlights && exp.highlights.length > 0 ? (
                          <div className="space-y-2">
                            {exp.highlights.map((highlight, hIndex) => (
                              <div key={hIndex} className="flex items-start">
                                <div className="flex-1">
                                  <Input
                                    value={highlight}
                                    onChange={(e) => updateExperienceHighlight(index, hIndex, e.target.value)}
                                    placeholder="描述具体成就，使用数据量化更佳"
                                  />
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeExperienceHighlight(index, hIndex)}
                                  className="ml-2 h-9 w-9"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">暂无工作亮点</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>项目经验</CardTitle>
              <Button onClick={addProject} className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                添加项目
              </Button>
            </CardHeader>
            <CardContent>
              {resume.projects.length === 0 ? (
                <p className="text-gray-500 text-center py-4">暂无项目经验，请点击上方按钮添加</p>
              ) : (
                <div className="space-y-6">
                  {resume.projects.map((project, index) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">项目 {index + 1}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProject(index)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor={`proj-name-${index}`}>项目名称 *</Label>
                          <Input
                            id={`proj-name-${index}`}
                            value={project.name}
                            onChange={(e) => updateProject(index, "name", e.target.value)}
                            placeholder="请输入项目名称"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`proj-url-${index}`}>项目链接</Label>
                          <Input
                            id={`proj-url-${index}`}
                            value={project.url || ""}
                            onChange={(e) => updateProject(index, "url", e.target.value)}
                            placeholder="请输入项目链接（可选）"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <Label htmlFor={`proj-description-${index}`}>项目描述 *</Label>
                        <Textarea
                          id={`proj-description-${index}`}
                          value={project.description}
                          onChange={(e) => updateProject(index, "description", e.target.value)}
                          placeholder="请简要描述项目背景、目标和技术栈"
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor={`proj-startDate-${index}`}>开始日期 *</Label>
                          <Input
                            id={`proj-startDate-${index}`}
                            type="month"
                            value={project.startDate}
                            onChange={(e) => updateProject(index, "startDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`proj-endDate-${index}`}>结束日期</Label>
                          <Input
                            id={`proj-endDate-${index}`}
                            type="month"
                            value={project.endDate || ""}
                            onChange={(e) => updateProject(index, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>项目亮点</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addProjectHighlight(index)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            添加亮点
                          </Button>
                        </div>
                        
                        {project.highlights && project.highlights.length > 0 ? (
                          <div className="space-y-2">
                            {project.highlights.map((highlight, hIndex) => (
                              <div key={hIndex} className="flex items-start">
                                <div className="flex-1">
                                  <Input
                                    value={highlight}
                                    onChange={(e) => updateProjectHighlight(index, hIndex, e.target.value)}
                                    placeholder="描述具体贡献和成果，使用数据量化更佳"
                                  />
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeProjectHighlight(index, hIndex)}
                                  className="ml-2 h-9 w-9"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">暂无项目亮点</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="education" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>教育背景</CardTitle>
              <Button onClick={addEducation} className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                添加教育经历
              </Button>
            </CardHeader>
            <CardContent>
              {resume.education.length === 0 ? (
                <p className="text-gray-500 text-center py-4">暂无教育背景，请点击上方按钮添加</p>
              ) : (
                <div className="space-y-6">
                  {resume.education.map((edu, index) => (
                    <div key={edu.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">教育经历 {index + 1}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEducation(index)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label htmlFor={`edu-institution-${index}`}>学校名称 *</Label>
                          <Input
                            id={`edu-institution-${index}`}
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, "institution", e.target.value)}
                            placeholder="请输入学校名称"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edu-degree-${index}`}>学位 *</Label>
                          <Input
                            id={`edu-degree-${index}`}
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                            placeholder="如：本科、硕士"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edu-field-${index}`}>专业 *</Label>
                          <Input
                            id={`edu-field-${index}`}
                            value={edu.field}
                            onChange={(e) => updateEducation(index, "field", e.target.value)}
                            placeholder="请输入专业名称"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`edu-startDate-${index}`}>开始日期 *</Label>
                          <Input
                            id={`edu-startDate-${index}`}
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edu-endDate-${index}`}>结束日期</Label>
                          <Input
                            id={`edu-endDate-${index}`}
                            type="month"
                            value={edu.endDate || ""}
                            onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 预览区域 */}
      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>简历预览</CardTitle>
            <div className="text-sm text-gray-500">此区域将用于打印/导出</div>
          </CardHeader>
          <CardContent className="print-area">
            <div className="bg-white p-8 rounded-lg shadow-none border">
              {/* 基本信息 */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2">{resume.basics.name}</h1>
                <div className="text-gray-600">
                  {resume.basics.email && ` | ${resume.basics.email}`}
                  {resume.basics.phone && ` | ${resume.basics.phone}`}
                  {resume.basics.location && ` | ${resume.basics.location}`}
                  {resume.basics.website && ` | ${resume.basics.website}`}
                </div>
                {resume.basics.headline && (
                  <h2 className="text-xl text-blue-600 mt-2">{resume.basics.headline}</h2>
                )}
              </div>

              {/* 个人简介 */}
              {resume.basics.summary && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold border-b pb-1 mb-2">个人简介</h2>
                  <p className="text-gray-700">{resume.basics.summary}</p>
                </div>
              )}

              {/* 技能 */}
              {resume.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold border-b pb-1 mb-2">技能</h2>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill.name} {skill.level && `(${skill.level})`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 工作经验 */}
              {resume.experience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold border-b pb-1 mb-2">工作经验</h2>
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium">{exp.position} | {exp.company}</h3>
                        <span className="text-gray-600">{exp.startDate} - {exp.endDate || "至今"}</span>
                      </div>
                      <p className="text-gray-700 my-2">{exp.summary}</p>
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="list-disc pl-5 space-y-1">
                          {exp.highlights.map((highlight, hIndex) => (
                            <li key={hIndex} className="text-gray-700">{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 项目经验 */}
              {resume.projects.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold border-b pb-1 mb-2">项目经验</h2>
                  {resume.projects.map((proj, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium">
                          {proj.name}
                          {proj.url && (
                            <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 text-base">
                              ({proj.url})
                            </a>
                          )}
                        </h3>
                        <span className="text-gray-600">{proj.startDate} - {proj.endDate || "至今"}</span>
                      </div>
                      <p className="text-gray-700 my-2">{proj.description}</p>
                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul className="list-disc pl-5 space-y-1">
                          {proj.highlights.map((highlight, hIndex) => (
                            <li key={hIndex} className="text-gray-700">{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 教育背景 */}
              {resume.education.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold border-b pb-1 mb-2">教育背景</h2>
                  {resume.education.map((edu, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium">{edu.degree} | {edu.field}</h3>
                        <span className="text-gray-600">{edu.startDate} - {edu.endDate || "至今"}</span>
                      </div>
                      <p className="text-gray-700">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 长文本警告对话框 */}
      <Dialog open={showLongBulletWarning} onOpenChange={setShowLongBulletWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
              检测到长文本内容
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="mb-3">我们检测到以下内容可能过长，可能会影响Word文档的格式：</p>
            <div className="bg-gray-100 p-3 rounded-md max-h-40 overflow-y-auto">
              {longBulletContent.split('\n').map((bullet, i) => (
                <div key={i} className="mb-2 last:mb-0">
                  {bullet.length > 150 ? (
                    <span className="text-red-600">{bullet}</span>
                  ) : (
                    <span>{bullet}</span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-600">
              建议将长文本拆分为多个要点，或缩短每个要点的长度以获得更好的文档格式。
            </p>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowLongBulletWarning(false)}
            >
              取消
            </Button>
            <Button 
              onClick={() => {
                // 用户确认后，直接生成文档
                generateDocx();
                setShowLongBulletWarning(false);
              }}
            >
              仍然导出
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}