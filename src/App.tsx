import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import GradeSelection from "./pages/GradeSelection";
import GradesPage from "./pages/GradesPage";
import SubjectsPage from "./pages/SubjectsPage";
import ChaptersPage from "./pages/ChaptersPage";
import QuizPage from "./pages/QuizPage";
import HostPage from "./pages/HostPage";
import JoinPage from "./pages/JoinPage";
import SessionPage from "./pages/SessionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/grades" element={<GradesPage />} />
              <Route path="/grade/:grade" element={<GradeSelection />} />
              <Route path="/grade/:grade/subjects" element={<SubjectsPage />} />
              <Route path="/grade/:grade/subject/:subject/chapters" element={<ChaptersPage />} />
              <Route path="/grade/:grade/subject/:subject/chapter/:chapterId/difficulty/:difficulty/quiz" element={<QuizPage />} />
              <Route path="/host" element={<HostPage />} />
              <Route path="/join" element={<JoinPage />} />
              <Route path="/session/:sessionCode" element={<SessionPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
