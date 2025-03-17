import { Question } from './types';

// Energy-saving challenge questions
export const questions: Question[] = [
  {
    id: 1,
    text: 'How many times this week did you turn off lights when leaving a room?',
    type: 'input',
    pointsPerUnit: 5
  },
  {
    id: 2,
    text: 'Which energy-saving actions did you take this week?',
    type: 'multiple-choice',
    options: [
      'Used public transportation instead of car',
      'Unplugged devices when not in use',
      'Used natural light instead of artificial light',
      'Took shorter showers to save hot water',
      'None of the above'
    ],
    pointsPerOption: {
      'Used public transportation instead of car': 10,
      'Unplugged devices when not in use': 5,
      'Used natural light instead of artificial light': 5,
      'Took shorter showers to save hot water': 8,
      'None of the above': 0
    }
  },
  {
    id: 3,
    text: 'How many electronic devices did you unplug when not in use this week?',
    type: 'input',
    pointsPerUnit: 3
  },
  {
    id: 4,
    text: 'What temperature did you keep your thermostat at this week?',
    type: 'multiple-choice',
    options: [
      'Below 18°C',
      '18-20°C',
      '21-22°C',
      'Above 22°C'
    ],
    pointsPerOption: {
      'Below 18°C': 15,
      '18-20°C': 10,
      '21-22°C': 5,
      'Above 22°C': 0
    }
  },
  {
    id: 5,
    text: 'How many meals did you prepare without using an oven or stove?',
    type: 'input',
    pointsPerUnit: 4
  },
  {
    id: 6,
    text: 'Which of these energy-efficient practices did you follow this week?',
    type: 'multiple-choice',
    options: [
      'Used cold water for laundry',
      'Air-dried clothes instead of using a dryer',
      'Used energy-efficient light bulbs',
      'Kept refrigerator door closed as much as possible',
      'None of the above'
    ],
    pointsPerOption: {
      'Used cold water for laundry': 8,
      'Air-dried clothes instead of using a dryer': 10,
      'Used energy-efficient light bulbs': 5,
      'Kept refrigerator door closed as much as possible': 3,
      'None of the above': 0
    }
  },
  {
    id: 7,
    text: 'How many hours did you spend on electronic devices for entertainment this week?',
    type: 'input',
    pointsPerUnit: -1 // Negative points for more hours
  },
  {
    id: 8,
    text: 'Did you participate in any community energy-saving initiatives this week?',
    type: 'multiple-choice',
    options: [
      'Yes, actively participated',
      'Yes, but minimally',
      'No, but I plan to',
      'No, not interested'
    ],
    pointsPerOption: {
      'Yes, actively participated': 15,
      'Yes, but minimally': 8,
      'No, but I plan to': 2,
      'No, not interested': 0
    }
  },
  {
    id: 9,
    text: 'How many times did you use reusable containers instead of disposable ones?',
    type: 'input',
    pointsPerUnit: 3
  },
  {
    id: 10,
    text: 'Which energy-saving habit will you commit to improving next week?',
    type: 'multiple-choice',
    options: [
      'Reducing water usage',
      'Using less electricity',
      'Reducing transportation emissions',
      'Consuming less energy-intensive products',
      'No commitment'
    ],
    pointsPerOption: {
      'Reducing water usage': 5,
      'Using less electricity': 5,
      'Reducing transportation emissions': 5,
      'Consuming less energy-intensive products': 5,
      'No commitment': 0
    }
  }
];
