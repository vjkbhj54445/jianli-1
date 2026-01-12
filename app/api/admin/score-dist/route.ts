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

    // 查询分数分布数据
    const query = `
      SELECT 
        CASE 
          WHEN jd_match_score BETWEEN 0 AND 9 THEN '0-9分'
          WHEN jd_match_score BETWEEN 10 AND 19 THEN '10-19分'
          WHEN jd_match_score BETWEEN 20 AND 29 THEN '20-29分'
          WHEN jd_match_score BETWEEN 30 AND 39 THEN '30-39分'
          WHEN jd_match_score BETWEEN 40 AND 49 THEN '40-49分'
          WHEN jd_match_score BETWEEN 50 AND 59 THEN '50-59分'
          WHEN jd_match_score BETWEEN 60 AND 69 THEN '60-69分'
          WHEN jd_match_score BETWEEN 70 AND 79 THEN '70-79分'
          WHEN jd_match_score BETWEEN 80 AND 89 THEN '80-89分'
          WHEN jd_match_score BETWEEN 90 AND 100 THEN '90-100分'
          ELSE '未知'
        END AS score_range,
        COUNT(*) AS count
      FROM resume_stats
      WHERE timestamp >= $1 AND timestamp <= $2
        AND jd_match_score IS NOT NULL
      GROUP BY 
        CASE 
          WHEN jd_match_score BETWEEN 0 AND 9 THEN '0-9分'
          WHEN jd_match_score BETWEEN 10 AND 19 THEN '10-19分'
          WHEN jd_match_score BETWEEN 20 AND 29 THEN '20-29分'
          WHEN jd_match_score BETWEEN 30 AND 39 THEN '30-39分'
          WHEN jd_match_score BETWEEN 40 AND 49 THEN '40-49分'
          WHEN jd_match_score BETWEEN 50 AND 59 THEN '50-59分'
          WHEN jd_match_score BETWEEN 60 AND 69 THEN '60-69分'
          WHEN jd_match_score BETWEEN 70 AND 79 THEN '70-79分'
          WHEN jd_match_score BETWEEN 80 AND 89 THEN '80-89分'
          WHEN jd_match_score BETWEEN 90 AND 100 THEN '90-100分'
          ELSE '未知'
        END
      ORDER BY 
        CASE 
          WHEN score_range = '0-9分' THEN 1
          WHEN score_range = '10-19分' THEN 2
          WHEN score_range = '20-29分' THEN 3
          WHEN score_range = '30-39分' THEN 4
          WHEN score_range = '40-49分' THEN 5
          WHEN score_range = '50-59分' THEN 6
          WHEN score_range = '60-69分' THEN 7
          WHEN score_range = '70-79分' THEN 8
          WHEN score_range = '80-89分' THEN 9
          WHEN score_range = '90-100分' THEN 10
          ELSE 11
        END
    `;

    const result = await pool.query(query, [startDate, endDate]);
    
    // 格式化结果
    const formattedResult = result.rows.map(row => ({
      scoreRange: row.score_range,
      count: parseInt(row.count)
    }));

    return new Response(
      JSON.stringify(formattedResult),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Score Distribution API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}