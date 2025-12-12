import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, LogIn } from "lucide-react";
import { joinSession } from "@/lib/sessionUtils";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

const JoinPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessionCode, setSessionCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinSession = async () => {
    if (!sessionCode.trim() || !playerName.trim()) {
      toast({
        title: "Missing fields",
        description: "Please enter both session code and your name",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    try {
      const { session, participant } = await joinSession(
        sessionCode.trim(),
        playerName.trim()
      );
      
      sessionStorage.setItem('participantId', participant.id);
      sessionStorage.setItem('isHost', 'false');
      
      navigate(`/session/${session.session_code}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join session. Please check the code and try again.",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-800 to-indigo-700 p-4">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/grades")}
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Join a Quiz Session</CardTitle>
            <CardDescription className="text-blue-100">
              Enter the session code to join a quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-white/80 mb-2 block">Session Code</label>
              <Input
                placeholder="Enter 6-character code"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-center text-2xl tracking-widest font-mono"
              />
            </div>

            <div>
              <label className="text-sm text-white/80 mb-2 block">Your Name</label>
              <Input
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <Button
              onClick={handleJoinSession}
              disabled={isJoining}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3"
            >
              {isJoining ? "Joining..." : "Join Session"}
            </Button>
          </CardContent>
        </Card>

        <Footer />
      </div>
    </div>
  );
};

export default JoinPage;
