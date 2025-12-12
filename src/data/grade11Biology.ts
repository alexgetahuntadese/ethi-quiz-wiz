
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
    // EASY QUESTIONS
    {
      id: 'g11bio_biotech_e1',
      question: 'What is the basic unit of life?',
      options: ['Cell', 'Tissue', 'Organ', 'System'],
      correct: 'Cell',
      explanation: 'The cell is the basic structural and functional unit of all known living organisms.',
      difficulty: 'Easy',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_e2',
      question: 'Which molecule carries genetic information?',
      options: ['DNA', 'Protein', 'Carbohydrate', 'Lipid'],
      correct: 'DNA',
      explanation: 'DNA stores and transmits genetic information in living organisms.',
      difficulty: 'Easy',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_e3',
      question: 'Which organelle is known as the powerhouse of the cell?',
      options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Chloroplast'],
      correct: 'Mitochondria',
      explanation: 'Mitochondria generate energy in the form of ATP for cellular activities.',
      difficulty: 'Easy',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_e4',
      question: 'Which process produces oxygen in plants?',
      options: ['Photosynthesis', 'Respiration', 'Fermentation', 'Transpiration'],
      correct: 'Photosynthesis',
      explanation: 'Photosynthesis releases oxygen as a by-product when plants convert sunlight into energy.',
      difficulty: 'Easy',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_e5',
      question: 'Which type of cell lacks a nucleus?',
      options: ['Prokaryotic cell', 'Eukaryotic cell', 'Animal cell', 'Plant cell'],
      correct: 'Prokaryotic cell',
      explanation: 'Prokaryotic cells, like bacteria, do not have a nucleus.',
      difficulty: 'Easy',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_e6',
      question: 'Which gas is essential for respiration?',
      options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
      correct: 'Oxygen',
      explanation: 'Oxygen is required for aerobic respiration to release energy from food.',
      difficulty: 'Easy',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_e7',
      question: 'Which organelle is responsible for protein synthesis?',
      options: ['Ribosome', 'Mitochondria', 'Nucleus', 'Golgi apparatus'],
      correct: 'Ribosome',
      explanation: 'Ribosomes assemble amino acids into proteins.',
      difficulty: 'Easy',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_e8',
      question: 'Which pigment gives plants their green color?',
      options: ['Chlorophyll', 'Hemoglobin', 'Carotene', 'Melanin'],
      correct: 'Chlorophyll',
      explanation: 'Chlorophyll absorbs light for photosynthesis and gives plants their green color.',
      difficulty: 'Easy',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_e9',
      question: 'Which organelle controls cell activities?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Vacuole'],
      correct: 'Nucleus',
      explanation: 'The nucleus contains DNA and regulates cell functions.',
      difficulty: 'Easy',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_e10',
      question: 'Which process breaks down glucose to release energy?',
      options: ['Respiration', 'Photosynthesis', 'Fermentation', 'Transpiration'],
      correct: 'Respiration',
      explanation: 'Respiration is the process of breaking down glucose to release energy.',
      difficulty: 'Easy',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },

    // MEDIUM QUESTIONS
    {
      id: 'g11bio_biotech_m1',
      question: 'What is biotechnology?',
      options: ['Use of living organisms in technology', 'Study of cells', 'Chemical processes', 'Physical processes'],
      correct: 'Use of living organisms in technology',
      explanation: 'Biotechnology involves using living organisms, cells, or biological processes to develop products and technologies.',
      difficulty: 'Medium',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_m2',
      question: 'Which technique is used to amplify DNA?',
      options: ['PCR', 'Photosynthesis', 'Respiration', 'Fermentation'],
      correct: 'PCR',
      explanation: 'Polymerase Chain Reaction (PCR) is used to make multiple copies of DNA.',
      difficulty: 'Medium',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_m3',
      question: 'Which type of RNA carries amino acids to ribosomes?',
      options: ['tRNA', 'mRNA', 'rRNA', 'snRNA'],
      correct: 'tRNA',
      explanation: 'Transfer RNA (tRNA) brings amino acids to ribosomes during protein synthesis.',
      difficulty: 'Medium',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_m4',
      question: 'Which process allows exchange of genetic material in bacteria?',
      options: ['Conjugation', 'Photosynthesis', 'Respiration', 'Transpiration'],
      correct: 'Conjugation',
      explanation: 'Conjugation is a process where bacteria transfer genetic material through direct contact.',
      difficulty: 'Medium',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_m5',
      question: 'Which enzyme is used in DNA replication?',
      options: ['DNA polymerase', 'Amylase', 'Lipase', 'Protease'],
      correct: 'DNA polymerase',
      explanation: 'DNA polymerase adds nucleotides during DNA replication.',
      difficulty: 'Medium',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_m6',
      question: 'Which biotechnology product is used to treat diabetes?',
      options: ['Insulin', 'Antibiotics', 'Vaccines', 'Hormones'],
      correct: 'Insulin',
      explanation: 'Genetically engineered bacteria produce insulin for diabetes treatment.',
      difficulty: 'Medium',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_m7',
      question: 'Which process is used to produce genetically identical organisms?',
      options: ['Cloning', 'Mutation', 'Hybridization', 'Cross-pollination'],
      correct: 'Cloning',
      explanation: 'Cloning creates organisms with identical genetic material.',
      difficulty: 'Medium',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_m8',
      question: 'Which biotechnology technique is used in agriculture to resist pests?',
      options: ['Genetic modification', 'Photosynthesis', 'Respiration', 'Fermentation'],
      correct: 'Genetic modification',
      explanation: 'Genetically modified crops are engineered to resist pests and diseases.',
      difficulty: 'Medium',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_m9',
      question: 'Which organelle is involved in packaging proteins?',
      options: ['Golgi apparatus', 'Nucleus', 'Mitochondria', 'Ribosome'],
      correct: 'Golgi apparatus',
      explanation: 'The Golgi apparatus modifies and packages proteins for transport.',
      difficulty: 'Medium',
      chapter: 'Unit 1: Biology and Technology',
      subject: 'Biology'
    },
    {
      id: 'g11bio_biotech_m10',
      question: 'Which biotechnology method is used to identify individuals?',
      options: ['DNA fingerprinting

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
