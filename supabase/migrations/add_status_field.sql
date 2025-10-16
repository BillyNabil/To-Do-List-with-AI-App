-- Add status column to schedules table
ALTER TABLE public.schedules 
ADD COLUMN status TEXT DEFAULT 'todo' NOT NULL CHECK (status IN ('todo', 'inProgress', 'completed'));

-- Update existing records to have appropriate status based on is_completed
UPDATE public.schedules 
SET status = CASE 
  WHEN is_completed = true THEN 'completed'
  ELSE 'todo'
END;

-- Add index for better performance
CREATE INDEX idx_schedules_status ON public.schedules(status);
