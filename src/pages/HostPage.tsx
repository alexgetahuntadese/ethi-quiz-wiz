import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users } from "lucide-react";
import { createSession } from "@/lib/sessionUtils";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

const HostPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hostName, setHostName] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const grades = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Civics", "IT", "Agriculture"];
  const difficulties = ["easy", "medium", "hard"];

  const handleCreateSession = async () => {
    if (!hostName.trim() || !grade || !subject || !difficulty) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const { session, participant } = await createSession(
        hostName.trim(),
        grade,
        subject,
        chapter || "all",
        difficulty
      );
      
      // Store participant info in sessionStorage
      sessionStorage.setItem('participantId', participant.id);
      sessionStorage.setItem('isHost', 'true');
      
      navigate(`/session/${session.session_code}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
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
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Host a Quiz Session</CardTitle>
            <CardDescription className="text-blue-100">
              Create a multiplayer quiz and invite friends
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-white/80 mb-2 block">Your Name</label>
              <Input
                placeholder="Enter your name"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <label className="text-sm text-white/80 mb-2 block">Grade</label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-white/80 mb-2 block">Subject</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-white/80 mb-2 block">Difficulty</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((d) => (
                    <SelectItem key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCreateSession}
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
            >
              {isCreating ? "Creating..." : "Create Session"}
            </Button>
          </CardContent>
        </Card>

        <Footer />
      </div>
    </div>
  );
};

export default HostPage;
