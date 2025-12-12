import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const GradesPage = () => {
  const navigate = useNavigate();

  const grades = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-800 to-indigo-700 p-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            Select Your Grade
          </h1>
          <p className="text-lg text-blue-100 animate-fade-in [animation-delay:0.2s]">
            Choose your grade level to access quizzes
          </p>
        </div>

        {/* Multiplayer Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 opacity-0 animate-fade-in [animation-delay:0.3s]">
          <Button
            onClick={() => navigate("/host")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6"
          >
            <Users className="mr-2 h-5 w-5" />
            Host Session
          </Button>
          <Button
            onClick={() => navigate("/join")}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Join Session
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {grades.map((grade, index) => (
            <Card
              key={grade}
              onClick={() => navigate(`/grade/${grade}/subjects`)}
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-purple-500/30 shadow-lg opacity-0 animate-fade-in"
              style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-white text-lg">
                  Grade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {grade}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default GradesPage;
