import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface QuestionResult {
  questionId: string;
  subject: string;
  chapter: string;
  grade: number;
  isCorrect: boolean;
  timeTakenSeconds?: number;
  difficulty: string;
}

interface AdaptiveRecommendation {
  recommendedDifficulty: 'easy' | 'medium' | 'hard';
  weakAreas: { subject: string; chapter: string; masteryLevel: number }[];
  reviewQueue: { questionId: string; subject: string; chapter: string; priority: number }[];
  dailyGoal: number;
  questionsAnsweredToday: number;
}

// SM-2 Spaced Repetition Algorithm
const calculateNextReview = (
  isCorrect: boolean,
  currentEaseFactor: number,
  currentInterval: number,
  repetitions: number
): { newInterval: number; newEaseFactor: number } => {
  let newEaseFactor = currentEaseFactor;
  let newInterval = currentInterval;

  if (isCorrect) {
    // Increase ease factor for correct answers
    newEaseFactor = Math.max(1.3, currentEaseFactor + 0.1);
    
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(currentInterval * newEaseFactor);
    }
  } else {
    // Decrease ease factor for wrong answers
    newEaseFactor = Math.max(1.3, currentEaseFactor - 0.2);
    newInterval = 1; // Reset to 1 day for wrong answers
  }

  return { newInterval, newEaseFactor };
};

// Difficulty adjustment based on recent performance
const calculateRecommendedDifficulty = (
  recentCorrectRate: number,
  currentDifficulty: string
): 'easy' | 'medium' | 'hard' => {
  if (recentCorrectRate >= 0.85) {
    // Performing well, increase difficulty
    if (currentDifficulty === 'easy') return 'medium';
    if (currentDifficulty === 'medium') return 'hard';
    return 'hard';
  } else if (recentCorrectRate <= 0.5) {
    // Struggling, decrease difficulty
    if (currentDifficulty === 'hard') return 'medium';
    if (currentDifficulty === 'medium') return 'easy';
    return 'easy';
  }
  // Maintain current difficulty
  return currentDifficulty as 'easy' | 'medium' | 'hard';
};

export const useAdaptiveLearning = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation | null>(null);

  // Record a question answer and update all relevant stats
  const recordAnswer = useCallback(async (result: QuestionResult) => {
    if (!user) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // 1. Add to question history
      const { newInterval, newEaseFactor } = calculateNextReview(
        result.isCorrect,
        2.5,
        1,
        0
      );
      
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

      await supabase.from('question_history').insert({
        user_id: user.id,
        question_id: result.questionId,
        subject: result.subject,
        chapter: result.chapter,
        grade: result.grade,
        is_correct: result.isCorrect,
        time_taken_seconds: result.timeTakenSeconds,
        difficulty: result.difficulty,
        next_review_at: nextReviewDate.toISOString(),
        review_interval_days: newInterval,
        ease_factor: newEaseFactor,
      });

      // 2. Update or insert spaced repetition queue for wrong answers
      if (!result.isCorrect) {
        await supabase.from('spaced_repetition_queue').upsert({
          user_id: user.id,
          question_id: result.questionId,
          subject: result.subject,
          chapter: result.chapter,
          grade: result.grade,
          priority: 10, // High priority for wrong answers
          next_review_date: today,
          ease_factor: newEaseFactor,
          interval_days: newInterval,
        }, { onConflict: 'user_id,question_id' });
      }

      // 3. Update chapter mastery
      const { data: existingChapter } = await supabase
        .from('chapter_mastery')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject', result.subject)
        .eq('chapter', result.chapter)
        .eq('grade', result.grade)
        .single();

      if (existingChapter) {
        const newTotal = existingChapter.total_questions + 1;
        const newCorrect = existingChapter.correct_answers + (result.isCorrect ? 1 : 0);
        const newMastery = (newCorrect / newTotal) * 100;
        const isWeakArea = newMastery < 60 && newTotal >= 5;

        await supabase
          .from('chapter_mastery')
          .update({
            total_questions: newTotal,
            correct_answers: newCorrect,
            mastery_level: newMastery,
            weak_area: isWeakArea,
            recommended_review: isWeakArea || newMastery < 70,
            last_practiced: new Date().toISOString(),
          })
          .eq('id', existingChapter.id);
      } else {
        await supabase.from('chapter_mastery').insert({
          user_id: user.id,
          subject: result.subject,
          chapter: result.chapter,
          grade: result.grade,
          total_questions: 1,
          correct_answers: result.isCorrect ? 1 : 0,
          mastery_level: result.isCorrect ? 100 : 0,
          weak_area: !result.isCorrect,
          last_practiced: new Date().toISOString(),
        });
      }

      // 4. Update subject mastery
      const { data: existingSubject } = await supabase
        .from('subject_mastery')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject', result.subject)
        .eq('grade', result.grade)
        .single();

      if (existingSubject) {
        const newTotal = existingSubject.total_questions + 1;
        const newCorrect = existingSubject.correct_answers + (result.isCorrect ? 1 : 0);
        const newMastery = (newCorrect / newTotal) * 100;
        
        // Calculate new recommended difficulty
        const recentCorrectRate = newCorrect / newTotal;
        const newDifficulty = calculateRecommendedDifficulty(
          recentCorrectRate,
          existingSubject.current_difficulty
        );

        await supabase
          .from('subject_mastery')
          .update({
            total_questions: newTotal,
            correct_answers: newCorrect,
            mastery_level: newMastery,
            current_difficulty: newDifficulty,
            last_practiced: new Date().toISOString(),
          })
          .eq('id', existingSubject.id);
      } else {
        await supabase.from('subject_mastery').insert({
          user_id: user.id,
          subject: result.subject,
          grade: result.grade,
          total_questions: 1,
          correct_answers: result.isCorrect ? 1 : 0,
          mastery_level: result.isCorrect ? 100 : 0,
          current_difficulty: 'easy',
          last_practiced: new Date().toISOString(),
        });
      }

      // 5. Update overall learning stats
      const { data: stats } = await supabase
        .from('user_learning_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (stats) {
        const isNewDay = stats.last_activity_date !== today;
        const newStreak = isNewDay 
          ? (stats.current_streak_days || 0) + 1 
          : stats.current_streak_days;

        await supabase
          .from('user_learning_stats')
          .update({
            total_questions_answered: stats.total_questions_answered + 1,
            total_correct_answers: stats.total_correct_answers + (result.isCorrect ? 1 : 0),
            current_streak_days: newStreak,
            longest_streak_days: Math.max(newStreak, stats.longest_streak_days || 0),
            last_activity_date: today,
            skill_level: calculateSkillLevel(stats.total_questions_answered + 1, stats.total_correct_answers + (result.isCorrect ? 1 : 0)),
          })
          .eq('user_id', user.id);
      }

    } catch (error) {
      console.error('Error recording answer:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get personalized recommendations
  const getRecommendations = useCallback(async (subject?: string, grade?: number): Promise<AdaptiveRecommendation | null> => {
    if (!user) return null;

    setLoading(true);
    try {
      // Get weak areas
      let weakAreasQuery = supabase
        .from('chapter_mastery')
        .select('*')
        .eq('user_id', user.id)
        .eq('weak_area', true)
        .order('mastery_level', { ascending: true })
        .limit(5);

      if (subject) weakAreasQuery = weakAreasQuery.eq('subject', subject);
      if (grade) weakAreasQuery = weakAreasQuery.eq('grade', grade);

      const { data: weakAreas } = await weakAreasQuery;

      // Get review queue
      const today = new Date().toISOString().split('T')[0];
      let reviewQuery = supabase
        .from('spaced_repetition_queue')
        .select('*')
        .eq('user_id', user.id)
        .lte('next_review_date', today)
        .order('priority', { ascending: false })
        .limit(10);

      if (subject) reviewQuery = reviewQuery.eq('subject', subject);

      const { data: reviewQueue } = await reviewQuery;

      // Get subject mastery for difficulty recommendation
      let difficultyQuery = supabase
        .from('subject_mastery')
        .select('current_difficulty')
        .eq('user_id', user.id);

      if (subject) difficultyQuery = difficultyQuery.eq('subject', subject);
      if (grade) difficultyQuery = difficultyQuery.eq('grade', grade);

      const { data: subjectData } = await difficultyQuery.single();

      // Get today's activity
      const { data: todayHistory } = await supabase
        .from('question_history')
        .select('id')
        .eq('user_id', user.id)
        .gte('answered_at', today);

      const recommendation: AdaptiveRecommendation = {
        recommendedDifficulty: (subjectData?.current_difficulty as 'easy' | 'medium' | 'hard') || 'easy',
        weakAreas: (weakAreas || []).map(w => ({
          subject: w.subject,
          chapter: w.chapter,
          masteryLevel: Number(w.mastery_level),
        })),
        reviewQueue: (reviewQueue || []).map(r => ({
          questionId: r.question_id,
          subject: r.subject,
          chapter: r.chapter,
          priority: r.priority,
        })),
        dailyGoal: 20,
        questionsAnsweredToday: todayHistory?.length || 0,
      };

      setRecommendations(recommendation);
      return recommendation;

    } catch (error) {
      console.error('Error getting recommendations:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Record a complete quiz session
  const recordQuizSession = useCallback(async (
    subject: string,
    chapter: string | null,
    grade: number,
    difficulty: string,
    totalQuestions: number,
    correctAnswers: number,
    timeTakenSeconds: number
  ) => {
    if (!user) return;

    const scorePercentage = (correctAnswers / totalQuestions) * 100;
    
    // Determine if difficulty should change
    let difficultyChange: string | null = null;
    if (scorePercentage >= 85) {
      difficultyChange = 'increase';
    } else if (scorePercentage <= 50) {
      difficultyChange = 'decrease';
    }

    await supabase.from('quiz_sessions').insert({
      user_id: user.id,
      subject,
      chapter,
      grade,
      difficulty,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      score_percentage: scorePercentage,
      time_taken_seconds: timeTakenSeconds,
      adaptive_difficulty_change: difficultyChange,
    });
  }, [user]);

  // Get learning statistics
  const getLearningStats = useCallback(async () => {
    if (!user) return null;

    const { data: stats } = await supabase
      .from('user_learning_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: subjectMastery } = await supabase
      .from('subject_mastery')
      .select('*')
      .eq('user_id', user.id)
      .order('mastery_level', { ascending: false });

    const { data: recentSessions } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(10);

    return {
      overall: stats,
      subjectMastery: subjectMastery || [],
      recentSessions: recentSessions || [],
    };
  }, [user]);

  return {
    loading,
    recommendations,
    recordAnswer,
    recordQuizSession,
    getRecommendations,
    getLearningStats,
  };
};

// Helper function to calculate skill level
function calculateSkillLevel(totalAnswered: number, totalCorrect: number): string {
  const accuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;
  
  if (totalAnswered < 50) return 'beginner';
  if (totalAnswered < 200 && accuracy >= 0.6) return 'intermediate';
  if (totalAnswered < 500 && accuracy >= 0.7) return 'advanced';
  if (totalAnswered >= 500 && accuracy >= 0.8) return 'expert';
  
  return 'intermediate';
}
