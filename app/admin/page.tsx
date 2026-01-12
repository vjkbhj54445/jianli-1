"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface OverviewData {
  pv: number;
  uv: number;
  analyzeCount: number;
}

interface ScoreDistribution {
  scoreRange: string;
  count: number;
}

interface TopSkill {
  name: string;
  count: number;
}

type ChartData = OverviewData[] | ScoreDistribution[] | TopSkill[];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminPage() {
  const [token, setToken] = useState<string>('');
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // 数据状态
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [scoreDistData, setScoreDistData] = useState<ScoreDistribution[]>([]);
  const [topSkillsData, setTopSkillsData] = useState<TopSkill[]>([]);
  const [topMissingData, setTopMissingData] = useState<TopSkill[]>([]);
  
  // 时间范围状态
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');
  
  // 加载存储的token
  useEffect(() => {
    const storedToken = sessionStorage.getItem('admin_token');
    if (storedToken) {
      setToken(storedToken);
      validateToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);
  
  // 验证token
  const validateToken = async (token: string) => {
    try {
      const response = await fetch('/api/admin/overview', {
        headers: {
          'x-admin-token': token,
          'range': timeRange
        }
      });
      
      if (response.status === 401) {
        setIsValidToken(false);
        setLoading(false);
        return;
      }
      
      setIsValidToken(true);
      setLoading(false);
    } catch (error) {
      console.error('Token validation error:', error);
      setIsValidToken(false);
      setLoading(false);
    }
  };
  
  // 提交token
  const handleSubmitToken = async () => {
    setLoading(true);
    sessionStorage.setItem('admin_token', token);
    await validateToken(token);
  };
  
  // 获取数据
  const fetchData = async () => {
    if (!isValidToken) return;
    
    const headers = {
      'x-admin-token': token,
      'range': timeRange
    };
    
    try {
      // 获取概览数据
      const overviewResponse = await fetch('/api/admin/overview', { headers });
      if (overviewResponse.ok) {
        const overview = await overviewResponse.json();
        setOverviewData(overview);
      }
      
      // 获取分数分布数据
      const scoreDistResponse = await fetch('/api/admin/score-dist', { headers });
      if (scoreDistResponse.ok) {
        const scoreDist = await scoreDistResponse.json();
        setScoreDistData(scoreDist);
      }
      
      // 获取技能TOP数据
      const topSkillsResponse = await fetch('/api/admin/top-skills', { headers });
      if (topSkillsResponse.ok) {
        const topSkills = await topSkillsResponse.json();
        setTopSkillsData(topSkills);
      }
      
      // 获取缺失技能TOP数据
      const topMissingResponse = await fetch('/api/admin/top-missing', { headers });
      if (topMissingResponse.ok) {
        const topMissing = await topMissingResponse.json();
        setTopMissingData(topMissing);
      }
    } catch (error) {
      console.error('Fetch data error:', error);
    }
  };
  
  // 当token有效且时间范围变化时获取数据
  useEffect(() => {
    if (isValidToken) {
      fetchData();
    }
  }, [isValidToken, timeRange]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Skeleton className="h-16 w-1/3 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>管理员登录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="请输入管理员令牌"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitToken()}
              />
              <Button onClick={handleSubmitToken} className="w-full">
                登录
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">管理员面板</h1>
        <div className="flex items-center space-x-4">
          <span>时间范围:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7' | '30')}
            className="border rounded-md p-2"
          >
            <option value="7">最近7天</option>
            <option value="30">最近30天</option>
          </select>
          <Button 
            variant="outline" 
            onClick={() => {
              sessionStorage.removeItem('admin_token');
              setIsValidToken(null);
              setToken('');
            }}
          >
            退出
          </Button>
        </div>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">页面访问量 (PV)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewData ? overviewData.pv.toLocaleString() : '加载中...'}
            </div>
            <p className="text-xs text-muted-foreground">
              {timeRange === '7' ? '最近7天' : '最近30天'} 总访问量
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">独立访客 (UV)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewData ? overviewData.uv.toLocaleString() : '加载中...'}
            </div>
            <p className="text-xs text-muted-foreground">
              {timeRange === '7' ? '最近7天' : '最近30天'} 独立访客数
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">分析次数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewData ? overviewData.analyzeCount.toLocaleString() : '加载中...'}
            </div>
            <p className="text-xs text-muted-foreground">
              {timeRange === '7' ? '最近7天' : '最近30天'} 分析次数
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="score">分数分布</TabsTrigger>
          <TabsTrigger value="skills">热门技能</TabsTrigger>
          <TabsTrigger value="missing">缺失技能</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>概览数据</CardTitle>
            </CardHeader>
            <CardContent>
              {overviewData ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: '访问量',
                          value: overviewData.pv,
                          fill: '#8884d8'
                        },
                        {
                          name: '独立访客',
                          value: overviewData.uv,
                          fill: '#82ca9d'
                        },
                        {
                          name: '分析次数',
                          value: overviewData.analyzeCount,
                          fill: '#ffc658'
                        }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="数值" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <p>暂无数据</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="score" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>分数分布</CardTitle>
            </CardHeader>
            <CardContent>
              {scoreDistData && scoreDistData.length > 0 ? (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scoreDistData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="scoreRange" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="人数" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <p>暂无数据</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>热门技能 Top 20</CardTitle>
            </CardHeader>
            <CardContent>
              {topSkillsData && topSkillsData.length > 0 ? (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topSkillsData.slice(0, 20)}
                      layout="horizontal"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="使用次数" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <p>暂无数据</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="missing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>缺失技能 Top 20</CardTitle>
            </CardHeader>
            <CardContent>
              {topMissingData && topMissingData.length > 0 ? (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topMissingData.slice(0, 20)}
                      layout="horizontal"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="缺失次数" fill="#ff4d4f" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <p>暂无数据</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}