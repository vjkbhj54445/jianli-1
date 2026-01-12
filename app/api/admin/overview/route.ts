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

    // 查询页面访问量 (PV) - events表中的page_view事件
    const pvQuery = `
      SELECT COUNT(*) AS pv
      FROM events
      WHERE event_type = 'page_view'
        AND timestamp >= $1
        AND timestamp <= $2
    `;
    
    // 查询独立访客 (UV) - events表中的不同anon_id
    const uvQuery = `
      SELECT COUNT(DISTINCT anon_id) AS uv
      FROM events
      WHERE event_type = 'page_view'
        AND timestamp >= $1
        AND timestamp <= $2
    `;
    
    // 查询分析次数 - events表中的click_analyze事件
    const analyzeCountQuery = `
      SELECT COUNT(*) AS analyze_count
      FROM events
      WHERE event_type = 'click_analyze'
        AND timestamp >= $1
        AND timestamp <= $2
    `;

    const [pvResult, uvResult, analyzeResult] = await Promise.all([
      pool.query(pvQuery, [startDate, endDate]),
      pool.query(uvQuery, [startDate, endDate]),
      pool.query(analyzeCountQuery, [startDate, endDate])
    ]);

    const pv = parseInt(pvResult.rows[0]?.pv || '0');
    const uv = parseInt(uvResult.rows[0]?.uv || '0');
    const analyzeCount = parseInt(analyzeResult.rows[0]?.analyze_count || '0');

    return new Response(
      JSON.stringify({ pv, uv, analyzeCount }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Overview API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}