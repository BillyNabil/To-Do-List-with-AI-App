-- Create schedules table
CREATE TABLE public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    status TEXT DEFAULT 'todo' NOT NULL CHECK (status IN ('todo', 'inProgress', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_schedules_user_id ON public.schedules(user_id);
CREATE INDEX idx_schedules_created_at ON public.schedules(created_at);
CREATE INDEX idx_schedules_due_date ON public.schedules(due_date);
CREATE INDEX idx_schedules_is_completed ON public.schedules(is_completed);

-- Enable Row Level Security
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own schedules" ON public.schedules
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own schedules" ON public.schedules
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules" ON public.schedules
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules" ON public.schedules
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.schedules TO authenticated;
GRANT SELECT ON public.schedules TO anon;
