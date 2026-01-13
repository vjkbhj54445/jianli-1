"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractSkills } from "@/domain/extract/skills";
import { extractEdu } from "@/domain/extract/edu";
import { extractExpBucket } from "@/domain/extract/exp";
import { extractRoleTags, extractSceneTags } from "@/domain/extract/jd";
import { calculateJdScore, ResumeProfile } from "@/domain/scoring/score";
import { generateSuggestions } from "@/domain/scoring/suggest";
import { trackEvent, trackResumeStats } from "@/lib/analytics";
import cloudDictionary from "@/lib/dictionaries/cloud.json";
import sreDictionary from "@/lib/dictionaries/sre.json";
import mlopsDictionary from "@/lib/dictionaries/mlops.json";
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react'; // 导入加载图标

export default function JdMatchPage() {
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [selectedDirection, setSelectedDirection] = useState<"cloud" | "sre" | "mlops">("cloud");
  const [outputText, setOutputText] = useState("");
  const [jdSkillTags, setJdSkillTags] = useState<string[]>([]);
  const [resumeSkillTags, setResumeSkillTags] = useState<string[]>([]);
  const [eduLevel, setEduLevel] = useState<'dazhuan' | 'benke' | 'shuoshi_plus' | 'unknown'>('unknown');
  const [expBucket, setExpBucket] = useState<'0-1' | '1-3' | '3-5' | '5+' | 'unknown'>('unknown');
  const [roleTags, setRoleTags] = useState<string[]>([]);
  const [sceneTags, setSceneTags] = useState<string[]>([]);
  const [jdRoleTags, setJdRoleTags] = useState<string[]>([]);
  const [jdSceneTags, setJdSceneTags] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<{ tech: number; role: number; scene: number; bonus: number }>({ tech: 0, role: 0, scene: 0, bonus: 0 });
  const [hitItems, setHitItems] = useState<{ tech: string[]; role: string[]; scene: string[] }>({ tech: [], role: [], scene: [] });
  const [missingItems, setMissingItems] = useState<{ tech: string[]; role: string[]; scene: string[] }>({ tech: [], role: [], scene: [] });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false); // 添加加载状态
  const searchParams = useSearchParams();
  const router = useRouter();

  const dictionaries = [...cloudDictionary, ...sreDictionary, ...mlopsDictionary];

  // 获取URL参数并设置示例
  useEffect(() => {
    const role = searchParams.get('role');
    const example = searchParams.get('example');
    
    if (role === 'cloud' && example === '1') {
      setJdText("我们正在寻找一位云原生工程师，需要具备以下技能：AWS/Azure/GCP云平台经验，Kubernetes容器编排，Docker容器化，Terraform基础设施即代码，CI/CD流水线经验，微服务架构设计，监控和日志系统，安全和合规性知识。");
      setResumeText("我有3年云平台开发经验，熟悉AWS和Kubernetes，参与过多个微服务项目，具备Docker和CI/CD经验。");
      setSelectedDirection('cloud');
    }
  }, [searchParams]);

  const handleProcess = async () => {
    setIsProcessing(true); // 设置加载状态
    try {
      // 提取JD的技能、角色和场景标签
      const extractedJdTags = extractSkills(jdText, dictionaries);
      setJdSkillTags(extractedJdTags);
      setJdRoleTags(extractRoleTags(jdText));
      setJdSceneTags(extractSceneTags(jdText));

      // 提取简历的技能、角色和场景标签
      const extractedResumeTags = extractSkills(resumeText, dictionaries);
      setResumeSkillTags(extractedResumeTags);
      
      // 提取学历和经验桶
      setEduLevel(extractEdu(resumeText));
      setExpBucket(extractExpBucket(resumeText));
      
      // 提取简历的角色和场景标签
      setRoleTags(extractRoleTags(resumeText));
      setSceneTags(extractSceneTags(resumeText));

      // 创建简历资料对象
      const resumeProfile: ResumeProfile = {
        tech: extractedResumeTags,
        role: extractRoleTags(resumeText),
        scene: extractSceneTags(resumeText)
      };

      // 计算匹配度
      const scoringResult = calculateJdScore(jdText, resumeProfile, dictionaries);
      setTotalScore(scoringResult.totalScore);
      setBreakdown(scoringResult.breakdown);
      setHitItems(scoringResult.hit);
      setMissingItems(scoringResult.missing);

      // 生成建议
      const generatedSuggestions = generateSuggestions(scoringResult);
      setSuggestions(generatedSuggestions);

      // 更新输出文本
      setOutputText(`匹配度分析结果：
      
总分: ${scoringResult.totalScore}/100

详细评分:
- 技术匹配度: ${scoringResult.breakdown.tech}/60 (${(scoringResult.techHitRate * 100).toFixed(1)}%命中率)
- 角色匹配度: ${scoringResult.breakdown.role}/12.5 (${(scoringResult.roleHitRate * 100).toFixed(1)}%命中率)
- 场景匹配度: ${scoringResult.breakdown.scene}/12.5 (${(scoringResult.sceneHitRate * 100).toFixed(1)}%命中率)
- 加分项: ${scoringResult.breakdown.bonus}/15

命中项:
- 技术: ${scoringResult.hit.tech.join(', ') || '无'}
- 角色: ${scoringResult.hit.role.join(', ') || '无'}
- 场景: ${scoringResult.hit.scene.join(', ') || '无'}

缺失项:
- 技术: ${scoringResult.missing.tech.join(', ') || '无'}
- 角色: ${scoringResult.missing.role.join(', ') || '无'}
- 场景: ${scoringResult.missing.scene.join(', ') || '无'}`);

      // 上报事件和简历统计数据
      trackEvent('click_analyze', {
        target_role: selectedDirection,
        skill_count: extractedResumeTags.length,
        missing_count: scoringResult.missing.tech.length
      });

      trackResumeStats(
        selectedDirection,
        extractEdu(resumeText),
        extractExpBucket(resumeText),
        scoringResult.totalScore,
        extractedResumeTags,
        scoringResult.missing.tech
      );
    } finally {
      setIsProcessing(false); // 移除加载状态
    }
  };

  const handleClearParams = () => {
    // 清除URL参数
    router.push('/jd-match', { scroll: false });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">职位匹配分析</h1>
        {(searchParams.get('role') || searchParams.get('example')) && (
          <Button variant="outline" onClick={handleClearParams}>
            清除示例
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>职位描述 (JD)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="请输入职位描述..." 
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={8}
              className="mb-4"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>简历内容</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="请输入简历内容..." 
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={8}
              className="mb-4"
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">目标方向</label>
              <select
                value={selectedDirection}
                onChange={(e) => {
                  setSelectedDirection(e.target.value as any);
                  trackEvent('click_analyze', { action: 'change_direction', target_role: e.target.value });
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="cloud">Cloud (云原生)</option>
                <option value="sre">SRE (站点可靠性)</option>
                <option value="mlops">MLOps (机器学习运维)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mb-6">
        <Button 
          onClick={handleProcess} 
          disabled={isProcessing}
          className="w-full md:w-auto"
        >
          {isProcessing ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              分析中...
            </span>
          ) : '开始分析'}
        </Button>
      </div>
      
      {outputText && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>匹配度分析结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-blue-600">{totalScore}<span className="text-xl">/100</span></div>
              <div className="text-gray-600 mt-1">总体匹配度</div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{breakdown.tech}<span className="text-sm">/60</span></div>
                <div className="text-gray-600">技术匹配</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{breakdown.role}<span className="text-sm">/12.5</span></div>
                <div className="text-gray-600">角色匹配</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{breakdown.scene}<span className="text-sm">/12.5</span></div>
                <div className="text-gray-600">场景匹配</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">{breakdown.bonus}<span className="text-sm">/15</span></div>
                <div className="text-gray-600">加分项</div>
              </div>
            </div>
            
            <Textarea 
              placeholder="分析结果将显示在这里..." 
              value={outputText}
              readOnly
              rows={12}
            />
          </CardContent>
        </Card>
      )}

      {suggestions.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>优化建议</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-decimal list-inside space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="p-2 bg-gray-50 rounded-md">{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 仅本地展示的调试区 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>调试区 - 详细分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2 text-lg">JD 分析</h3>
              
              <div className="mb-4">
                <h4 className="font-medium mb-1">JD 技能标签:</h4>
                {jdSkillTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {jdSkillTags.map((tag, index) => (
                      <span 
                        key={index} 
                        title={tag} // 鼠标悬停显示完整标签
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm truncate max-w-48"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">暂无识别到的技能标签</p>
                )}
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-1">JD 角色标签:</h4>
                {jdRoleTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {jdRoleTags.map((tag, index) => (
                      <span 
                        key={index} 
                        title={tag} // 鼠标悬停显示完整标签
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm truncate max-w-48"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">暂无识别到的角色标签</p>
                )}
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-1">JD 场景标签:</h4>
                {jdSceneTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {jdSceneTags.map((tag, index) => (
                      <span 
                        key={index} 
                        title={tag} // 鼠标悬停显示完整标签
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm truncate max-w-48"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">暂无识别到的场景标签</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 text-lg">简历分析</h3>
              
              <div className="mb-4">
                <h4 className="font-medium mb-1">简历技能标签:</h4>
                {resumeSkillTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {resumeSkillTags.map((tag, index) => (
                      <span 
                        key={index} 
                        title={tag} // 鼠标悬停显示完整标签
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm truncate max-w-48"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">暂无识别到的技能标签</p>
                )}
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-1">简历角色标签:</h4>
                {roleTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {roleTags.map((tag, index) => (
                      <span 
                        key={index} 
                        title={tag} // 鼠标悬停显示完整标签
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm truncate max-w-48"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">暂无识别到的角色标签</p>
                )}
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-1">简历场景标签:</h4>
                {sceneTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {sceneTags.map((tag, index) => (
                      <span 
                        key={index} 
                        title={tag} // 鼠标悬停显示完整标签
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm truncate max-w-48"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">暂无识别到的场景标签</p>
                )}
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-1">学历等级 (edu_level):</h4>
                <p className={`px-3 py-1 inline-block rounded-full text-sm ${
                  eduLevel === 'dazhuan' ? 'bg-purple-100 text-purple-800' :
                  eduLevel === 'benke' ? 'bg-green-100 text-green-800' :
                  eduLevel === 'shuoshi_plus' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {eduLevel === 'dazhuan' ? '大专' :
                   eduLevel === 'benke' ? '本科' :
                   eduLevel === 'shuoshi_plus' ? '硕士及以上' : '未知'}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">经验区间 (exp_bucket):</h4>
                <p className={`px-3 py-1 inline-block rounded-full text-sm ${
                  expBucket === '0-1' ? 'bg-red-100 text-red-800' :
                  expBucket === '1-3' ? 'bg-orange-100 text-orange-800' :
                  expBucket === '3-5' ? 'bg-blue-100 text-blue-800' :
                  expBucket === '5+' ? 'bg-indigo-100 text-indigo-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {expBucket === '0-1' ? '0-1年' :
                   expBucket === '1-3' ? '1-3年' :
                   expBucket === '3-5' ? '3-5年' :
                   expBucket === '5+' ? '5年以上' : '未知'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2 text-lg">命中/缺失分析</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-1 text-blue-600">技术命中: {hitItems.tech.length}/{hitItems.tech.length + missingItems.tech.length}</h4>
                <div className="max-h-32 overflow-y-auto">
                  {hitItems.tech.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {hitItems.tech.map((item, index) => (
                        <span 
                          key={index} 
                          title={item} // 鼠标悬停显示完整标签
                          className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs truncate max-w-48"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">无</p>
                  )}
                </div>
                
                <h4 className="font-medium mb-1 text-red-600 mt-3">技术缺失: {missingItems.tech.length}</h4>
                <div className="max-h-32 overflow-y-auto">
                  {missingItems.tech.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {missingItems.tech.map((item, index) => (
                        <span 
                          key={index} 
                          title={item} // 鼠标悬停显示完整标签
                          className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs truncate max-w-48"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">无</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1 text-green-600">角色命中: {hitItems.role.length}/{hitItems.role.length + missingItems.role.length}</h4>
                <div className="max-h-32 overflow-y-auto">
                  {hitItems.role.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {hitItems.role.map((item, index) => (
                        <span 
                          key={index} 
                          title={item} // 鼠标悬停显示完整标签
                          className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs truncate max-w-48"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">无</p>
                  )}
                </div>
                
                <h4 className="font-medium mb-1 text-red-600 mt-3">角色缺失: {missingItems.role.length}</h4>
                <div className="max-h-32 overflow-y-auto">
                  {missingItems.role.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {missingItems.role.map((item, index) => (
                        <span 
                          key={index} 
                          title={item} // 鼠标悬停显示完整标签
                          className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs truncate max-w-48"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">无</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1 text-purple-600">场景命中: {hitItems.scene.length}/{hitItems.scene.length + missingItems.scene.length}</h4>
                <div className="max-h-32 overflow-y-auto">
                  {hitItems.scene.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {hitItems.scene.map((item, index) => (
                        <span 
                          key={index} 
                          title={item} // 鼠标悬停显示完整标签
                          className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs truncate max-w-48"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">无</p>
                  )}
                </div>
                
                <h4 className="font-medium mb-1 text-red-600 mt-3">场景缺失: {missingItems.scene.length}</h4>
                <div className="max-h-32 overflow-y-auto">
                  {missingItems.scene.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {missingItems.scene.map((item, index) => (
                        <span 
                          key={index} 
                          title={item} // 鼠标悬停显示完整标签
                          className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs truncate max-w-48"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">无</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}