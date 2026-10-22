export type Category = 'all' | 'physics' | 'math' | 'quests' | 'arcade';

export type AgeGroup = 'junior' | 'cadet' | 'master';

export interface UserProfile {
  name: string;
  avatar: string;
  xp: number;
  level: number;
  badges: string[];
  completedLabs: string[];
  solvedChallenges: number;
  streak: number;
}

export interface LabDefinition {
  id: string;
  title: string;
  subtitle: string;
  category: 'physics' | 'math';
  ageGroup: AgeGroup[];
  icon: string;
  accentColor: string;
  cardGradient: string;
  summary: string;
  learningGoals: string[];
  badgeReward: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
}

export interface FactCard {
  id: string;
  title: string;
  category: 'physics' | 'math';
  question: string;
  emoji: string;
  shortAnswer: string;
  funFact: string;
  interactiveTip: string;
  color: string;
}

export interface QuestStep {
  id: number;
  title: string;
  story: string;
  category: 'physics' | 'math';
  question: string;
  options: { label: string; isCorrect: boolean; hint: string }[];
  explanation: string;
  mascotReaction: string;
  xpReward: number;
}
