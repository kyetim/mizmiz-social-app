-- ============================================================================
-- Database Security & Performance Fix Script
-- ============================================================================
-- This script addresses the warnings from the Supabase Dashboard.
-- Since this application uses a custom Node.js backend with its own Authentication,
-- we do not rely on Supabase's native Auth (GoTrue) or RLS for user permissions.
--
-- Actions taken:
-- 1. Enable Row Level Security (RLS) on all public tables (Security Best Practice).
-- 2. Create a "Service Role" policy to allow the backend full access.
-- 3. Drop inefficient default policies that rely on `auth.uid()` (which we don't use).

-- ============================================================================
-- 1. Enable RLS on all tables
-- ============================================================================

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vibe_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_category_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vibe_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_vibes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vibes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. Create Service Role Policies (Allow Backend Access)
-- ============================================================================
-- These policies ensure that the 'service_role' (used by the backend) has full access.
-- Note: If your backend connects as 'postgres' (superuser), it bypasses RLS anyway,
-- but these policies are good practice for "defense in depth".

CREATE POLICY "Service Role Full Access" ON public.messages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.conversations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.refresh_tokens FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.category_battles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.user_gamification FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.user_vibe_preferences FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.user_category_preferences FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.vibe_votes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.post_vibes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.category_votes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.post_categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.vibes FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Add for existing tables just in case
CREATE POLICY "Service Role Full Access" ON public.users FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.posts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.comments FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.likes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.follows FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access" ON public.notifications FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================================
-- 3. Drop Inefficient/Unused Policies
-- ============================================================================
-- The warnings about "suboptimal query performance" come from policies using `auth.uid()`.
-- Since we use Custom Auth (not Supabase Auth), these policies are unnecessary overhead.
-- We drop them to resolve the performance warning.

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;

DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

DROP POLICY IF EXISTS "Users can manage own likes" ON public.likes;

DROP POLICY IF EXISTS "Users can manage own follows" ON public.follows;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

-- Note: We leave "Public ... viewable by everyone" policies if they exist, 
-- as they might be intended for public read access.
