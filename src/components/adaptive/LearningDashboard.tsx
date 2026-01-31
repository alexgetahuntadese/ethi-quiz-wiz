import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAdaptiveLearning } from '@/hooks/useAdaptiveLearning';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Flame, 
  Star,
  AlertTriangle,
  RefreshCw,
  BookOpen,
  Award
} from 'lucide-react';

interface LearningDashboardProps {
  onStartReview?: (subject: string, chapter: string) => void;
  onStartPractice?: (difficulty: string) => void;
}

const LearningDashboard = ({ onStartReview, onStartPractice }: LearningDashboardProps) => {
  const { user, profile } = useAuth();
  const { getLearningStats, getRecommendations, recommendations, loading } = useAdaptiveLearning();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    const [statsData] = await Promise.all([
      getLearningStats(),
      getRecommendations(),
    ]);
    setStats(statsData);
  };

  if (!user) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-purple-400" />
          <h3 className="text-xl font-bold text-white mb-2">Adaptive Learning</h3>
          <p className="text-slate-400 mb-4">
            Sign in to unlock personalized learning with difficulty adjustment, 
            weak area tracking, and spaced repetition.
          </p>
        </CardContent>
      </Card>
    );
  }

  const overallAccuracy = stats?.overall?.total_questions_answered 
    ? Math.round((stats.overall.total_correct_answers / stats.overall.total_questions_answered) * 100)
    : 0;

  const skillLevelColors = {
    beginner: 'bg-green-500',
    intermediate: 'bg-blue-500',
    advanced: 'bg-purple-500',
    expert: 'bg-yellow-500',
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Questions</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.overall?.total_questions_answered || 0}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-800 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Accuracy</p>
                <p className="text-2xl font-bold text-white">{overallAccuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600 to-orange-800 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Streak</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.overall?.current_streak_days || 0} days
                </p>
              </div>
              <Flame className="h-8 w-8 text-orange-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Level</p>
                <p className="text-xl font-bold text-white capitalize">
                  {stats?.overall?.skill_level || 'Beginner'}
                </p>
              </div>
              <Award className="h-8 w-8 text-blue-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Progress */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Daily Goal</span>
              <span className="text-white">
                {recommendations?.questionsAnsweredToday || 0} / {recommendations?.dailyGoal || 20}
              </span>
            </div>
            <Progress 
              value={((recommendations?.questionsAnsweredToday || 0) / (recommendations?.dailyGoal || 20)) * 100} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommended Difficulty */}
      {recommendations && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Adaptive Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Your recommended difficulty level</p>
                <Badge className={`text-lg px-4 py-1 ${
                  recommendations.recommendedDifficulty === 'easy' ? 'bg-green-500' :
                  recommendations.recommendedDifficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {recommendations.recommendedDifficulty.charAt(0).toUpperCase() + 
                   recommendations.recommendedDifficulty.slice(1)}
                </Badge>
              </div>
              {onStartPractice && (
                <Button 
                  onClick={() => onStartPractice(recommendations.recommendedDifficulty)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  Start Practice
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weak Areas */}
      {recommendations?.weakAreas && recommendations.weakAreas.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700 border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Areas Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.weakAreas.map((area, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{area.subject}</p>
                    <p className="text-slate-400 text-sm">{area.chapter}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-orange-400 font-bold">{Math.round(area.masteryLevel)}%</p>
                      <p className="text-slate-500 text-xs">mastery</p>
                    </div>
                    {onStartReview && (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => onStartReview(area.subject, area.chapter)}
                        className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spaced Repetition Queue */}
      {recommendations?.reviewQueue && recommendations.reviewQueue.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700 border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-400" />
              Review Queue ({recommendations.reviewQueue.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm mb-3">
              Questions you got wrong that are due for review
            </p>
            <div className="flex flex-wrap gap-2">
              {recommendations.reviewQueue.slice(0, 5).map((item, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="border-blue-500 text-blue-400"
                >
                  {item.subject} - {item.chapter}
                </Badge>
              ))}
              {recommendations.reviewQueue.length > 5 && (
                <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                  +{recommendations.reviewQueue.length - 5} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subject Mastery */}
      {stats?.subjectMastery && stats.subjectMastery.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Subject Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.subjectMastery.slice(0, 5).map((subject: any, index: number) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">{subject.subject}</span>
                    <span className="text-slate-400">
                      {Math.round(Number(subject.mastery_level))}%
                    </span>
                  </div>
                  <Progress 
                    value={Number(subject.mastery_level)} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Sessions */}
      {stats?.recentSessions && stats.recentSessions.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Recent Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recentSessions.slice(0, 5).map((session: any, index: number) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-slate-700/30 rounded"
                >
                  <div>
                    <p className="text-white text-sm">{session.subject}</p>
                    <p className="text-slate-500 text-xs">
                      {new Date(session.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={
                    Number(session.score_percentage) >= 80 ? 'bg-green-500' :
                    Number(session.score_percentage) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }>
                    {Math.round(Number(session.score_percentage))}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningDashboard;
