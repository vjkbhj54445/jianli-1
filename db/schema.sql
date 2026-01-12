-- 创建 events 表
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    anon_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_properties JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    ip_address INET
);

-- 创建 resume_stats 表
CREATE TABLE resume_stats (
    id SERIAL PRIMARY KEY,
    anon_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    target_role VARCHAR(100),
    edu_level VARCHAR(50),
    exp_bucket VARCHAR(50),
    jd_match_score INTEGER,
    skill_tags TEXT[],
    missing_tags TEXT[]
);

-- 为 anon_id 创建索引以提高查询性能
CREATE INDEX idx_events_anon_id ON events(anon_id);
CREATE INDEX idx_resume_stats_anon_id ON resume_stats(anon_id);

-- 为 timestamp 创建索引以提高时间范围查询性能
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_resume_stats_timestamp ON resume_stats(timestamp);