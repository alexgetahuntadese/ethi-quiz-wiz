import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import AuthModal from "@/components/auth/AuthModal";
import LearningDashboard from "@/components/adaptive/LearningDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, LogOut, User } from "lucide-react";

const Index = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const navigate = useNavigate();
    const { user, profile, signOut, loading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);

    const handleStartPractice = (difficulty: string) => {
      navigate(`/grades?difficulty=${difficulty}`);
    };

    const handleStartReview = (subject: string, chapter: string) => {
      navigate(`/grade/12/subject/${subject}/chapters`);
    };

    return (
      <div ref={ref} className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-slate-900 via-purple-800 to-indigo-700" {...props}>
        {/* Auth Header */}
        <div className="flex justify-end mb-4">
          {loading ? (
            <div className="h-10 w-24 bg-white/10 rounded animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowDashboard(!showDashboard)}
                className="text-white hover:bg-white/10"
              >
                <Brain className="h-4 w-4 mr-2" />
                {showDashboard ? 'Hide Dashboard' : 'Learning Dashboard'}
              </Button>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                <User className="h-4 w-4 text-purple-300" />
                <span className="text-white text-sm">{profile?.display_name || 'Student'}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowAuthModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              Sign In for Adaptive Learning
            </Button>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 opacity-0 animate-fade-in">
                EthioQuiz 2050
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-2 opacity-0 animate-fade-in [animation-delay:0.2s]">
                Haramaya Highschool and Secondary Students
              </p>
              <div className="text-purple-100 opacity-0 animate-fade-in [animation-delay:0.4s]">
                {user ? (
                  <span className="inline-flex items-center gap-2 bg-purple-500/30 px-4 py-2 rounded-full">
                    <Brain className="h-5 w-5" />
                    Adaptive Learning Enabled
                  </span>
                ) : (
                  'Grades 9-12 • Interactive Quizzes • Progress Tracking'
                )}
              </div>
            </div>

            {showDashboard && user ? (
              <div className="mb-8 opacity-0 animate-fade-in">
                <LearningDashboard 
                  onStartPractice={handleStartPractice}
                  onStartReview={handleStartReview}
                />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 shadow-2xl hover:shadow-purple-500/20 opacity-0 animate-fade-in [animation-delay:0.6s]">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">Explore Subjects</CardTitle>
                    <CardDescription className="text-blue-100">
                      Browse all available subjects and chapters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => navigate('/grades')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Browse Quizzes
                    </Button>
                  </CardContent>
                </Card>

                {user && (
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 shadow-2xl hover:shadow-blue-500/20 opacity-0 animate-fade-in [animation-delay:0.7s]">
                    <CardHeader>
                      <CardTitle className="text-white text-2xl flex items-center gap-2">
                        <Brain className="h-6 w-6 text-purple-400" />
                        Adaptive Mode
                      </CardTitle>
                      <CardDescription className="text-blue-100">
                        Personalized questions based on your performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => setShowDashboard(true)}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        View Learning Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {!showDashboard && (
              <div className="mt-12 text-center opacity-0 animate-fade-in [animation-delay:0.8s]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white/80">
                  <div>
                    <div className="text-2xl font-bold text-green-400">2050+</div>
                    <div className="text-sm">Questions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">12</div>
                    <div className="text-sm">Subjects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">4</div>
                    <div className="text-sm">Grade Levels</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-400">AI</div>
                    <div className="text-sm">Adaptive</div>
                  </div>
                </div>
              </div>
            )}

            <Footer />
          </div>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }
);

Index.displayName = 'Index';

export default Index;
