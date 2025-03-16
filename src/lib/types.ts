// Types for the energy challenge app

// Student participant type
export interface Student {
  id: string;
  name: string;
  email: string;
  class: string; // TTO2 or TTO3
  points: number;
  created_at: string;
}

// Energy saving action submission type
export interface EnergySubmission {
  id: string;
  student_id: string;
  week_number: number;
  answers: QuestionAnswer[];
  total_points: number;
  created_at: string;
  is_anonymous?: boolean;
}

// Question answer type
export interface QuestionAnswer {
  question_id: number;
  answer: string | number | boolean;
  points: number;
}

// Question type
export interface Question {
  id: number;
  text: string;
  type: 'multiple-choice' | 'input';
  options?: string[];
  pointsPerOption?: Record<string, number>;
  pointsPerUnit?: number;
}

// Weekly leaderboard type
export interface WeeklyLeaderboard {
  week_number: number;
  rankings: {
    student_id: string;
    student_name: string;
    points: number;
    class: string;
  }[];
}