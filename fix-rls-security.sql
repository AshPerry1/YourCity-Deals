-- Fix RLS Security Issue for leaderboard_rollups table
-- Enable Row Level Security
ALTER TABLE public.leaderboard_rollups ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read their own school's data
CREATE POLICY "Users can view leaderboard data for their school" ON public.leaderboard_rollups
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.school_id = leaderboard_rollups.school_id
        )
    );

-- Create policy for admins to read all data
CREATE POLICY "Admins can view all leaderboard data" ON public.leaderboard_rollups
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Create policy for system to insert/update data (for automated processes)
CREATE POLICY "System can manage leaderboard data" ON public.leaderboard_rollups
    FOR ALL USING (
        auth.role() = 'service_role'
    );

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'leaderboard_rollups';
