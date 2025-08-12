-- Create functions to handle likes and views counting
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts 
  SET likes = likes + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts 
  SET likes = GREATEST(0, likes - 1)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts 
  SET views = views + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_reply_likes(reply_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_replies 
  SET likes = likes + 1 
  WHERE id = reply_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_reply_likes(reply_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_replies 
  SET likes = GREATEST(0, likes - 1)
  WHERE id = reply_id;
END;
$$ LANGUAGE plpgsql;
