import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

// 定义简历统计数据的 Zod 验证 schema
const resumeStatsSchema = z.object({
  anonId: z.string().max(255),
  targetRole: z.string().max(100).optional(),
  eduLevel: z.enum(['dazhuan', 'benke', 'shuoshi_plus', 'unknown']).optional(),
  expBucket: z.enum(['0-1', '1-3', '3-5', '5+', 'unknown']).optional(),
  jdMatchScore: z.number().int().min(0).max(100).optional(),
  skillTags: z.array(z.string().max(100)).optional(),
  missingTags: z.array(z.string().max(100)).optional(),
});

// 限制请求体大小的中间件
async function withBodySizeLimit(request: NextRequest, limit: number = 1024 * 50) { // 50KB
  const buffer = await request.blob();
  if (buffer.size > limit) {
    return new Response(
      JSON.stringify({ error: 'Request body too large' }),
      { status: 413, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return request;
}

export async function POST(request: NextRequest) {
  try {
    // 检查请求体大小
    const sizedRequest = await withBodySizeLimit(request);
    if (sizedRequest instanceof Response) {
      return sizedRequest;
    }
    
    const data = await request.json();
    const { 
      anonId, 
      targetRole, 
      eduLevel, 
      expBucket, 
      jdMatchScore, 
      skillTags, 
      missingTags 
    } = resumeStatsSchema.parse(data);

    // 插入数据到 resume_stats 表
    const query = `
      INSERT INTO resume_stats (anon_id, target_role, edu_level, exp_bucket, jd_match_score, skill_tags, missing_tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    
    const values = [
      anonId, 
      targetRole || null, 
      eduLevel || null, 
      expBucket || null, 
      jdMatchScore || null, 
      skillTags || null, 
      missingTags || null
    ];
    
    await pool.query(query, values);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Resume Stats API Error:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid data format', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}