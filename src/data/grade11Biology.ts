
export interface Grade11BiologyQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  chapter: string;
  subject: string;
}

export const grade11Biology: { [chapter: string]: Grade11BiologyQuestion[] } = {
  'Unit 1: Biology and Technology': [
    {
      id: 'g11bio_biotech_e1',
      question: 'What is the basic unit of life?',
      options: ['Cell', 'Tissue', 'Organ', 'System'],
      correct: 'Cell',
      explanation: 'The cell is the basic structural and functional unit of all known living organisms.',
      difficulty: 'Easy',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    }
  ]
};

// Export chapter names for easy access
export const grade11BiologyChapters = Object.keys(grade11Biology);

export const getGrade11BiologyQuestions = (chapter: string, difficulty: 'easy' | 'medium' | 'hard', count: number = 10): Grade11BiologyQuestion[] => {
  const chapterQuestions = grade11Biology[chapter] || [];
  const difficultyMap = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
  const targetDifficulty = difficultyMap[difficulty];
  
  const filteredQuestions = chapterQuestions.filter(q => q.difficulty === targetDifficulty);
  const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getAllGrade11BiologyQuestions = (): Grade11BiologyQuestion[] => {
  return Object.values(grade11Biology).flat();
};
