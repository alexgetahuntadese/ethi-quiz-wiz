-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  grade INTEGER DEFAULT 12,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_learning_stats for overall learning metrics
CREATE TABLE public.user_learning_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_questions_answered INTEGER DEFAULT 0,
  total_correct_answers INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  skill_level TEXT DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create subject_mastery for tracking per-subject performance
CREATE TABLE public.subject_mastery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  mastery_level NUMERIC(5,2) DEFAULT 0.0,
  current_difficulty TEXT DEFAULT 'easy' CHECK (current_difficulty IN ('easy', 'medium', 'hard')),
  last_practiced TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject, grade)
);

-- Create chapter_mastery for per-chapter tracking
CREATE TABLE public.chapter_mastery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  grade INTEGER NOT NULL,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  mastery_level NUMERIC(5,2) DEFAULT 0.0,
  weak_area BOOLEAN DEFAULT false,
  recommended_review BOOLEAN DEFAULT false,
  last_practiced TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject, chapter, grade)
);

-- Create question_history for spaced repetition
CREATE TABLE public.question_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  grade INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INTEGER,
  difficulty TEXT,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_review_at TIMESTAMP WITH TIME ZONE,
  review_interval_days INTEGER DEFAULT 1,
  ease_factor NUMERIC(4,2) DEFAULT 2.5
);

-- Create spaced_repetition_queue for questions needing review
CREATE TABLE public.spaced_repetition_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  grade INTEGER NOT NULL,
  priority INTEGER DEFAULT 0,
  times_reviewed INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  next_review_date DATE NOT NULL,
  ease_factor NUMERIC(4,2) DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- Create quiz_sessions for tracking complete quiz attempts
CREATE TABLE public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  chapter TEXT,
  grade INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score_percentage NUMERIC(5,2) NOT NULL,
  time_taken_seconds INTEGER,
  adaptive_difficulty_change TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaced_repetition_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_learning_stats
CREATE POLICY "Users can view their own stats" ON public.user_learning_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stats" ON public.user_learning_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stats" ON public.user_learning_stats FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for subject_mastery
CREATE POLICY "Users can view their own subject mastery" ON public.subject_mastery FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subject mastery" ON public.subject_mastery FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subject mastery" ON public.subject_mastery FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for chapter_mastery
CREATE POLICY "Users can view their own chapter mastery" ON public.chapter_mastery FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chapter mastery" ON public.chapter_mastery FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chapter mastery" ON public.chapter_mastery FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for question_history
CREATE POLICY "Users can view their own question history" ON public.question_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own question history" ON public.question_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for spaced_repetition_queue
CREATE POLICY "Users can view their own review queue" ON public.spaced_repetition_queue FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own review queue" ON public.spaced_repetition_queue FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own review queue" ON public.spaced_repetition_queue FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from their own review queue" ON public.spaced_repetition_queue FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for quiz_sessions
CREATE POLICY "Users can view their own quiz sessions" ON public.quiz_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quiz sessions" ON public.quiz_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.user_learning_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_learning_stats_updated_at BEFORE UPDATE ON public.user_learning_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subject_mastery_updated_at BEFORE UPDATE ON public.subject_mastery FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chapter_mastery_updated_at BEFORE UPDATE ON public.chapter_mastery FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_spaced_repetition_queue_updated_at BEFORE UPDATE ON public.spaced_repetition_queue FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();