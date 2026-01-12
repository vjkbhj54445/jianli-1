import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

// 定义事件数据的 Zod 验证 schema
const trackEventSchema = z.object({
  anonId: z.string().max(255),
  eventType: z.string().min(1).max(100),
  eventProperties: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

// 限制请求体大小的中间件
async function withBodySizeLimit(request: NextRequest, limit: number = 1024 * 10) { // 10KB
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
    const { anonId, eventType, eventProperties } = trackEventSchema.parse(data);

    // 验证 eventProperties 中没有长文本
    if (eventProperties) {
      for (const [key, value] of Object.entries(eventProperties)) {
        if (typeof value === 'string' && value.length > 500) {
          return new Response(
            JSON.stringify({ error: `Property ${key} contains suspiciously long text` }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // 获取客户端 IP 地址
    const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // 获取 User Agent
    const user_agent = request.headers.get('user-agent') || '';

    // 插入数据到 events 表
    const query = `
      INSERT INTO events (anon_id, event_type, event_properties, user_agent, ip_address)
      VALUES ($1, $2, $3, $4, $5)
    `;
    
    const values = [anonId, eventType, eventProperties || {}, user_agent, ip_address];
    
    await pool.query(query, values);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Track API Error:', error);
    
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