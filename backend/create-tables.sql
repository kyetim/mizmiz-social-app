-- MIZMIZ Database Tables
-- Bu SQL script'i Supabase SQL Editor'da çalıştırın

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  "passwordHash" VARCHAR(255) NOT NULL,
  "firstName" VARCHAR(255),
  "lastName" VARCHAR(255),
  bio VARCHAR(160),
  "avatarUrl" VARCHAR(500),
  "coverImageUrl" VARCHAR(500),
  location VARCHAR(255),
  website VARCHAR(500),
  "birthDate" TIMESTAMP,
  "isVerified" BOOLEAN DEFAULT FALSE,
  "isActive" BOOLEAN DEFAULT TRUE,
  role VARCHAR(50) DEFAULT 'user',
  "followersCount" INTEGER DEFAULT 0,
  "followingCount" INTEGER DEFAULT 0,
  "postsCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "lastLoginAt" TIMESTAMP
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content VARCHAR(500) NOT NULL,
  "imageUrl" VARCHAR(500),
  "likesCount" INTEGER DEFAULT 0,
  "commentsCount" INTEGER DEFAULT 0,
  "sharesCount" INTEGER DEFAULT 0,
  "isEdited" BOOLEAN DEFAULT FALSE,
  "isDeleted" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "deletedAt" TIMESTAMP
);

CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts("userId");
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts("createdAt");

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "postId" UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content VARCHAR(300) NOT NULL,
  "likesCount" INTEGER DEFAULT 0,
  "isDeleted" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "deletedAt" TIMESTAMP
);

CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments("postId");
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments("userId");

-- Likes Table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "postId" UUID REFERENCES posts(id) ON DELETE CASCADE,
  "commentId" UUID REFERENCES comments(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_user_post_like UNIQUE ("userId", "postId"),
  CONSTRAINT unique_user_comment_like UNIQUE ("userId", "commentId")
);

CREATE INDEX IF NOT EXISTS likes_post_id_idx ON likes("postId");
CREATE INDEX IF NOT EXISTS likes_comment_id_idx ON likes("commentId");

-- Follows Table
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "followerId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "followingId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_follow UNIQUE ("followerId", "followingId")
);

CREATE INDEX IF NOT EXISTS follows_follower_id_idx ON follows("followerId");
CREATE INDEX IF NOT EXISTS follows_following_id_idx ON follows("followingId");

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "actorId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  "targetId" UUID,
  message TEXT NOT NULL,
  "isRead" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications("userId");
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications("createdAt");

-- Success Message
SELECT 'Tum tablolar basariyla olusturuldu! ✅' AS result;

