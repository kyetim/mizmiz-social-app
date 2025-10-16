-- Category System Tables
-- Bu SQL script'i Supabase SQL Editor'da çalıştırın

-- Category Type Enum
CREATE TYPE "CategoryType" AS ENUM ('STANDARD', 'TEMPORAL', 'TRENDING', 'EVENT');

-- Vote Type Enum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- Battle Status Enum
CREATE TYPE "BattleStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED');

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  icon VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL,
  description TEXT,
  type "CategoryType" DEFAULT 'STANDARD',
  "isActive" BOOLEAN DEFAULT TRUE,
  "startDate" TIMESTAMP,
  "endDate" TIMESTAMP,
  "postsCount" INTEGER DEFAULT 0,
  "votesCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS categories_type_idx ON categories(type);
CREATE INDEX IF NOT EXISTS categories_is_active_idx ON categories("isActive");

-- Vibes Table
CREATE TABLE IF NOT EXISTS vibes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  icon VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL,
  description TEXT,
  "isActive" BOOLEAN DEFAULT TRUE,
  "postsCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Post Categories Table
CREATE TABLE IF NOT EXISTS post_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "postId" UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  "categoryId" UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  "voteCount" INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  confidence FLOAT DEFAULT 0.0,
  weight FLOAT DEFAULT 0.0,
  "isAISuggested" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_post_category UNIQUE ("postId", "categoryId")
);

CREATE INDEX IF NOT EXISTS post_categories_post_id_idx ON post_categories("postId");
CREATE INDEX IF NOT EXISTS post_categories_category_id_idx ON post_categories("categoryId");

-- Post Vibes Table
CREATE TABLE IF NOT EXISTS post_vibes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "postId" UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  "vibeId" UUID NOT NULL REFERENCES vibes(id) ON DELETE CASCADE,
  "voteCount" INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  confidence FLOAT DEFAULT 0.0,
  weight FLOAT DEFAULT 0.0,
  "isAISuggested" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_post_vibe UNIQUE ("postId", "vibeId")
);

CREATE INDEX IF NOT EXISTS post_vibes_post_id_idx ON post_vibes("postId");
CREATE INDEX IF NOT EXISTS post_vibes_vibe_id_idx ON post_vibes("vibeId");

-- Category Votes Table
CREATE TABLE IF NOT EXISTS category_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "postCategoryId" UUID NOT NULL REFERENCES post_categories(id) ON DELETE CASCADE,
  "voteType" "VoteType" NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_user_post_category_vote UNIQUE ("userId", "postCategoryId")
);

CREATE INDEX IF NOT EXISTS category_votes_user_id_idx ON category_votes("userId");
CREATE INDEX IF NOT EXISTS category_votes_post_category_id_idx ON category_votes("postCategoryId");

-- Vibe Votes Table
CREATE TABLE IF NOT EXISTS vibe_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "postVibeId" UUID NOT NULL REFERENCES post_vibes(id) ON DELETE CASCADE,
  "voteType" "VoteType" NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_user_post_vibe_vote UNIQUE ("userId", "postVibeId")
);

CREATE INDEX IF NOT EXISTS vibe_votes_user_id_idx ON vibe_votes("userId");
CREATE INDEX IF NOT EXISTS vibe_votes_post_vibe_id_idx ON vibe_votes("postVibeId");

-- User Category Preferences Table
CREATE TABLE IF NOT EXISTS user_category_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "categoryId" UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  weight FLOAT DEFAULT 0.0,
  "isBlocked" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_user_category_preference UNIQUE ("userId", "categoryId")
);

CREATE INDEX IF NOT EXISTS user_category_preferences_user_id_idx ON user_category_preferences("userId");

-- User Vibe Preferences Table
CREATE TABLE IF NOT EXISTS user_vibe_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "vibeId" UUID NOT NULL REFERENCES vibes(id) ON DELETE CASCADE,
  "isBlocked" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_user_vibe_preference UNIQUE ("userId", "vibeId")
);

CREATE INDEX IF NOT EXISTS user_vibe_preferences_user_id_idx ON user_vibe_preferences("userId");

-- User Gamification Table
CREATE TABLE IF NOT EXISTS user_gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "totalVotes" INTEGER DEFAULT 0,
  "accurateVotes" INTEGER DEFAULT 0,
  "categoryExpertiseScore" FLOAT DEFAULT 0.0,
  badges JSONB DEFAULT '[]',
  "weeklyVotes" INTEGER DEFAULT 0,
  "weeklyAccuracy" FLOAT DEFAULT 0.0,
  rank INTEGER,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_gamification_category_expertise_score_idx ON user_gamification("categoryExpertiseScore");
CREATE INDEX IF NOT EXISTS user_gamification_rank_idx ON user_gamification(rank);

-- Category Battles Table
CREATE TABLE IF NOT EXISTS category_battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  "category1Id" UUID NOT NULL REFERENCES categories(id),
  "category2Id" UUID NOT NULL REFERENCES categories(id),
  "category1Score" INTEGER DEFAULT 0,
  "category2Score" INTEGER DEFAULT 0,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  status "BattleStatus" DEFAULT 'UPCOMING',
  "winnerId" UUID,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS category_battles_start_date_idx ON category_battles("startDate");
CREATE INDEX IF NOT EXISTS category_battles_status_idx ON category_battles(status);

-- Success Message
SELECT 'Category system tablolari basariyla olusturuldu! ✅' AS result;
