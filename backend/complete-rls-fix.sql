-- ========================================
-- Complete RLS Fix Script
-- ========================================
-- Bu script mevcut politikaları temizler ve yenilerini oluşturur

-- ========================================
-- CLEANUP EXISTING POLICIES
-- ========================================

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
-- ENABLE RLS ON ALL TABLES
-- ========================================

-- 1. RLS'i tüm tablolarda etkinleştir
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Kategori sistemi tabloları için de RLS etkinleştir (eğer varsa)
DO $$ 
BEGIN
    -- Categories tablosu için RLS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories' AND table_schema = 'public') THEN
        ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Vibes tablosu için RLS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vibes' AND table_schema = 'public') THEN
        ALTER TABLE public.vibes ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Post categories tablosu için RLS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'post_categories' AND table_schema = 'public') THEN
        ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Post vibes tablosu için RLS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'post_vibes' AND table_schema = 'public') THEN
        ALTER TABLE public.post_vibes ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Category votes tablosu için RLS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'category_votes' AND table_schema = 'public') THEN
        ALTER TABLE public.category_votes ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Vibe votes tablosu için RLS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vibe_votes' AND table_schema = 'public') THEN
        ALTER TABLE public.vibe_votes ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- User category preferences tablosu için RLS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_category_preferences' AND table_schema = 'public') THEN
        ALTER TABLE public.user_category_preferences ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- User vibe preferences tablosu için RLS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_vibe_preferences' AND table_schema = 'public') THEN
        ALTER TABLE public.user_vibe_preferences ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- User gamification tablosu için RLS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_gamification' AND table_schema = 'public') THEN
        ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Category battles tablosu için RLS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'category_battles' AND table_schema = 'public') THEN
        ALTER TABLE public.category_battles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ========================================
-- CREATE NEW RLS POLICIES
-- ========================================

-- USERS TABLE POLICIES
-- Herkes kendi profilini görebilir ve güncelleyebilir
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id::uuid);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id::uuid);

-- Herkes kullanıcı profillerini görebilir (public profiles)
CREATE POLICY "Public profiles are viewable by everyone" ON public.users
    FOR SELECT USING (true);

-- POSTS TABLE POLICIES
-- Herkes postları görebilir
CREATE POLICY "Posts are viewable by everyone" ON public.posts
    FOR SELECT USING (true);

-- Sadece post sahibi kendi postunu güncelleyebilir
CREATE POLICY "Users can update own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = "userId"::uuid);

-- Sadece post sahibi kendi postunu silebilir
CREATE POLICY "Users can delete own posts" ON public.posts
    FOR DELETE USING (auth.uid() = "userId"::uuid);

-- COMMENTS TABLE POLICIES
-- Herkes yorumları görebilir
CREATE POLICY "Comments are viewable by everyone" ON public.comments
    FOR SELECT USING (true);

-- Sadece yorum sahibi kendi yorumunu güncelleyebilir/silebilir
CREATE POLICY "Users can update own comments" ON public.comments
    FOR UPDATE USING (auth.uid() = "userId"::uuid);

CREATE POLICY "Users can delete own comments" ON public.comments
    FOR DELETE USING (auth.uid() = "userId"::uuid);

-- LIKES TABLE POLICIES
-- Herkes like'ları görebilir
CREATE POLICY "Likes are viewable by everyone" ON public.likes
    FOR SELECT USING (true);

-- Sadece kendi like'larını ekleyebilir/güncelleyebilir/silebilir
CREATE POLICY "Users can manage own likes" ON public.likes
    FOR ALL USING (auth.uid() = "userId"::uuid);

-- FOLLOWS TABLE POLICIES
-- Herkes takip ilişkilerini görebilir
CREATE POLICY "Follows are viewable by everyone" ON public.follows
    FOR SELECT USING (true);

-- Sadece kendi takip ilişkilerini yönetebilir
CREATE POLICY "Users can manage own follows" ON public.follows
    FOR ALL USING (auth.uid() = "followerId"::uuid);

-- NOTIFICATIONS TABLE POLICIES
-- Sadece kendi bildirimlerini görebilir
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = "userId"::uuid);

-- Sadece kendi bildirimlerini güncelleyebilir
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = "userId"::uuid);

-- ========================================
-- CATEGORY SYSTEM POLICIES
-- ========================================

-- CATEGORIES TABLE POLICIES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories' AND table_schema = 'public') THEN
        -- Herkes kategorileri görebilir
        CREATE POLICY "Categories are viewable by everyone" ON public.categories
            FOR SELECT USING (true);
    END IF;
END $$;

-- VIBES TABLE POLICIES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vibes' AND table_schema = 'public') THEN
        -- Herkes vibe'ları görebilir
        CREATE POLICY "Vibes are viewable by everyone" ON public.vibes
            FOR SELECT USING (true);
    END IF;
END $$;

-- POST_CATEGORIES TABLE POLICIES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'post_categories' AND table_schema = 'public') THEN
        -- Herkes post kategorilerini görebilir
        CREATE POLICY "Post categories are viewable by everyone" ON public.post_categories
            FOR SELECT USING (true);
    END IF;
END $$;

-- POST_VIBES TABLE POLICIES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'post_vibes' AND table_schema = 'public') THEN
        -- Herkes post vibe'larını görebilir
        CREATE POLICY "Post vibes are viewable by everyone" ON public.post_vibes
            FOR SELECT USING (true);
    END IF;
END $$;

-- CATEGORY_VOTES TABLE POLICIES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'category_votes' AND table_schema = 'public') THEN
        -- Herkes kategori oylarını görebilir
        CREATE POLICY "Category votes are viewable by everyone" ON public.category_votes
            FOR SELECT USING (true);
        
        -- Sadece kendi oylarını ekleyebilir/güncelleyebilir
        CREATE POLICY "Users can manage own category votes" ON public.category_votes
            FOR ALL USING (auth.uid() = "userId"::uuid);
    END IF;
END $$;

-- VIBE_VOTES TABLE POLICIES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vibe_votes' AND table_schema = 'public') THEN
        -- Herkes vibe oylarını görebilir
        CREATE POLICY "Vibe votes are viewable by everyone" ON public.vibe_votes
            FOR SELECT USING (true);
        
        -- Sadece kendi oylarını ekleyebilir/güncelleyebilir
        CREATE POLICY "Users can manage own vibe votes" ON public.vibe_votes
            FOR ALL USING (auth.uid() = "userId"::uuid);
    END IF;
END $$;

-- USER_CATEGORY_PREFERENCES TABLE POLICIES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_category_preferences' AND table_schema = 'public') THEN
        -- Sadece kendi tercihlerini görebilir
        CREATE POLICY "Users can view own category preferences" ON public.user_category_preferences
            FOR SELECT USING (auth.uid() = "userId"::uuid);
        
        -- Sadece kendi tercihlerini yönetebilir
        CREATE POLICY "Users can manage own category preferences" ON public.user_category_preferences
            FOR ALL USING (auth.uid() = "userId"::uuid);
    END IF;
END $$;

-- USER_VIBE_PREFERENCES TABLE POLICIES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_vibe_preferences' AND table_schema = 'public') THEN
        -- Sadece kendi tercihlerini görebilir
        CREATE POLICY "Users can view own vibe preferences" ON public.user_vibe_preferences
            FOR SELECT USING (auth.uid() = "userId"::uuid);
        
        -- Sadece kendi tercihlerini yönetebilir
        CREATE POLICY "Users can manage own vibe preferences" ON public.user_vibe_preferences
            FOR ALL USING (auth.uid() = "userId"::uuid);
    END IF;
END $$;

-- USER_GAMIFICATION TABLE POLICIES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_gamification' AND table_schema = 'public') THEN
        -- Sadece kendi gamification verilerini görebilir
        CREATE POLICY "Users can view own gamification" ON public.user_gamification
            FOR SELECT USING (auth.uid() = "userId"::uuid);
        
        -- Sadece kendi gamification verilerini yönetebilir
        CREATE POLICY "Users can manage own gamification" ON public.user_gamification
            FOR ALL USING (auth.uid() = "userId"::uuid);
    END IF;
END $$;

-- CATEGORY_BATTLES TABLE POLICIES
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'category_battles' AND table_schema = 'public') THEN
        -- Herkes kategori savaşlarını görebilir
        CREATE POLICY "Category battles are viewable by everyone" ON public.category_battles
            FOR SELECT USING (true);
    END IF;
END $$;

-- ========================================
-- GRANT PERMISSIONS
-- ========================================

-- Authenticated users için gerekli izinleri ver
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Anonymous users için read-only izinler
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- ========================================
-- COMPLETION MESSAGE
-- ========================================
DO $$ 
BEGIN
    RAISE NOTICE 'RLS policies have been successfully cleaned up and recreated!';
    RAISE NOTICE 'All security errors should now be resolved.';
END $$;
