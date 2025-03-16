import { Student, EnergySubmission, WeeklyLeaderboard } from './types';
import { questions } from './questions';

// Mock student data
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma.j@school.edu',
    class: 'TTO2',
    points: 120,
    createdAt: new Date(2023, 7, 1).toISOString() // August 1, 2023 (months are 0-indexed)
  },
  {
    id: '2',
    name: 'Anonymous',
    email: 'liam.s@school.edu',
    class: 'TTO2',
    points: 95,
    createdAt: new Date(2023, 7, 1).toISOString() // August 1, 2023 (months are 0-indexed)
  },
  {
    id: '3',
    name: 'Anonymous',
    email: 'olivia.b@school.edu',
    class: 'TTO3',
    points: 150,
    createdAt: new Date(2023, 7, 1).toISOString() // August 1, 2023 (months are 0-indexed)
  },
  {
    id: '4',
    name: 'Noah Davis',
    email: 'noah.d@school.edu',
    class: 'TTO3',
    points: 110,
    createdAt: new Date(2023, 7, 1).toISOString() // August 1, 2023 (months are 0-indexed)
  },
  {
    id: '5',
    name: 'Sophia Wilson',
    email: 'sophia.w@school.edu',
    class: 'TTO2',
    points: 135,
    createdAt: new Date(2023, 7, 1).toISOString() // August 1, 2023 (months are 0-indexed)
  },
  {
    id: '6',
    name: 'Jackson Miller',
    email: 'jackson.m@school.edu',
    class: 'TTO3',
    points: 85,
    createdAt: new Date(2023, 7, 1).toISOString() // August 1, 2023 (months are 0-indexed)
  }
];

// Helper function to generate random answers for a given week
const generateRandomAnswers = (studentId: string, weekNumber: number) => {
  const answers = questions.map(question => {
    let answer: string | number;
    let points = 0;
    
    if (question.type === 'input') {
      // Generate a random number between 0 and 10 for input questions
      answer = Math.floor(Math.random() * 11);
      points = Number(answer) * (question.pointsPerUnit || 0);
    } else if (question.type === 'multiple-choice' && question.options && question.pointsPerOption) {
      // For multiple choice, randomly select one option
      const randomIndex = Math.floor(Math.random() * question.options.length);
      answer = question.options[randomIndex];
      points = question.pointsPerOption[answer] || 0;
    } else {
      answer = '';
    }
    
    return {
      questionId: question.id,
      answer,
      points
    };
  });
  
  const totalPoints = answers.reduce((sum, answer) => sum + answer.points, 0);
  
  return {
    id: `${studentId}-week${weekNumber}`,
    studentId,
    weekNumber,
    answers,
    totalPoints,
    createdAt: new Date(2023, 7, weekNumber * 7).toISOString() // August (months are 0-indexed)
  };
};

// Generate mock submissions for each student for weeks 1-3
export const mockSubmissions: EnergySubmission[] = [];

mockStudents.forEach(student => {
  for (let week = 1; week <= 3; week++) {
    mockSubmissions.push(generateRandomAnswers(student.id, week));
  }
});

// Generate mock weekly leaderboards
export const mockLeaderboards: WeeklyLeaderboard[] = [];

for (let week = 1; week <= 3; week++) {
  const weeklySubmissions = mockSubmissions.filter(sub => sub.weekNumber === week);
  
  const rankings = weeklySubmissions.map(sub => {
    const student = mockStudents.find(s => s.id === sub.studentId);
    return {
      studentId: sub.studentId,
      studentName: student?.name || 'Unknown Student',
      points: sub.totalPoints,
      class: student?.class || 'Unknown Class'
    };
  }).sort((a, b) => b.points - a.points);
  
  mockLeaderboards.push({
    weekNumber: week,
    rankings
  });
}