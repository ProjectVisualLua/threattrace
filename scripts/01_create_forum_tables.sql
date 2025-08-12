-- Create users table for forum authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  author_email TEXT NOT NULL,
  author_username TEXT,
  likes INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_username TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table to track who liked what
CREATE TABLE IF NOT EXISTS forum_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, post_id),
  UNIQUE(user_email, reply_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_likes_post_id ON forum_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_likes_reply_id ON forum_likes(reply_id);

-- Enable Row Level Security
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view posts" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Anyone can view replies" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Anyone can view likes" ON forum_likes FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update
CREATE POLICY "Authenticated users can create posts" ON forum_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Authors can update their posts" ON forum_posts FOR UPDATE USING (author_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Authenticated users can create replies" ON forum_replies FOR INSERT WITH CHECK (true);
CREATE POLICY "Authors can update their replies" ON forum_replies FOR UPDATE USING (author_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Authenticated users can like posts/replies" ON forum_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can remove their own likes" ON forum_likes FOR DELETE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');
