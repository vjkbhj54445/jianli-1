import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

// 验证时间范围参数
const rangeSchema = z.enum(['7', '30']);

export async function GET(request: NextRequest) {
  // 验证管理员令牌
  const adminToken = request.headers.get('x-admin-token');
  const expectedToken = process.env.ADMIN_TOKEN;
  
  if (!adminToken || adminToken !== expectedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 解析时间范围参数
  const url = new URL(request.url);
  const rangeParam = url.searchParams.get('range') || '7';
  const result = rangeSchema.safeParse(rangeParam);
  
  if (!result.success) {
    return new Response(
      JSON.stringify({ error: 'Invalid range parameter. Use 7 or 30.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  const days = parseInt(result.data);

  try {
    // 计算时间范围
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // 查询热门技能数据
    const query = `
      SELECT 
        unnest(skill_tags) AS skill_name,
        COUNT(*) AS count
      FROM resume_stats
      WHERE timestamp >= $1 AND timestamp <= $2
        AND skill_tags IS NOT NULL
        AND array_length(skill_tags, 1) > 0
      GROUP BY skill_name
      ORDER BY count DESC
      LIMIT 20
    `;

    const result = await pool.query(query, [startDate, endDate]);
    
    // 格式化结果
    const formattedResult = result.rows.map(row => ({
      name: row.skill_name,
      count: parseInt(row.count)
    }));

    return new Response(
      JSON.stringify(formattedResult),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Top Skills API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}