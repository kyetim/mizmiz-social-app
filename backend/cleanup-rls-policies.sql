-- ========================================
-- RLS Policies Cleanup Script
-- ========================================
-- Bu script mevcut RLS politikalarını temizler

-- USERS TABLE POLICIES - Cleanup
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;

-- POSTS TABLE POLICIES - Cleanup
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;

-- COMMENTS TABLE POLICIES - Cleanup
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

-- LIKES TABLE POLICIES - Cleanup
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;
DROP POLICY IF EXISTS "Users can manage own likes" ON public.likes;

-- FOLLOWS TABLE POLICIES - Cleanup
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON public.follows;
DROP POLICY IF EXISTS "Users can manage own follows" ON public.follows;

-- NOTIFICATIONS TABLE POLICIES - Cleanup
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

-- CATEGORY SYSTEM POLICIES - Cleanup
DO $$ 
BEGIN
    -- Categories table policies
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories' AND table_schema = 'public') THEN
        DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
    END IF;
    
    -- Vibes table policies
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vibes' AND table_schema = 'public') THEN
        DROP POLICY IF EXISTS "Vibes are viewable by everyone" ON public.vibes;
    END IF;
    
    -- Post categories table policies
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'post_categories' AND table_schema = 'public') THEN
        DROP POLICY IF EXISTS "Post categories are viewable by everyone" ON public.post_categories;
    END IF;
    
    -- Post vibes table policies
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'post_vibes' AND table_schema = 'public') THEN
        DROP POLICY IF EXISTS "Post vibes are viewable by everyone" ON public.post_vibes;
    END IF;
    
    -- Category votes table policies
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'category_votes' AND table_schema = 'public') THEN
        DROP POLICY IF EXISTS "Category votes are viewable by everyone" ON public.category_votes;
        DROP POLICY IF EXISTS "Users can manage own category votes" ON public.category_votes;
    END IF;
    
    -- Vibe votes table policies
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vibe_votes' AND table_schema = 'public') THEN
        DROP POLICY IF EXISTS "Vibe votes are viewable by everyone" ON public.vibe_votes;
        DROP POLICY IF EXISTS "Users can manage own vibe votes" ON public.vibe_votes;
    END IF;
    
    -- User category preferences table policies
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_category_preferences' AND table_schema = 'public') THEN
        DROP POLICY IF EXISTS "Users can view own category preferences" ON public.user_category_preferences;
        DROP POLICY IF EXISTS "Users can manage own category preferences" ON public.user_category_preferences;
    END IF;
    
    -- User vibe preferences table policies
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_vibe_preferences' AND table_schema = 'public') THEN
        DROP POLICY IF EXISTS "Users can view own vibe preferences" ON public.user_vibe_preferences;
        DROP POLICY IF EXISTS "Users can manage own vibe preferences" ON public.user_vibe_preferences;
    END IF;
    
    -- User gamification table policies
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_gamification' AND table_schema = 'public') THEN
        DROP POLICY IF EXISTS "Users can view own gamification" ON public.user_gamification;
        DROP POLICY IF EXISTS "Users can manage own gamification" ON public.user_gamification;
    END IF;
    
    -- Category battles table policies
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'category_battles' AND table_schema = 'public') THEN
        DROP POLICY IF EXISTS "Category battles are viewable by everyone" ON public.category_battles;
    END IF;
END $$;

-- ========================================
-- COMPLETION MESSAGE
-- ========================================
DO $$ 
BEGIN
    RAISE NOTICE 'All existing RLS policies have been cleaned up!';
    RAISE NOTICE 'Now you can run the fix-rls-policies.sql script.';
END $$;
