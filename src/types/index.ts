export interface Question {
  id: string;
  text: string;
  category: 'strength' | 'value' | 'personality';
}

export interface Answer {
  questionId: string;
  value: number; // 1-5のスケール
}

export interface StrengthItem {
  id: string;
  title: string;
  description: string;
  score: number;
  category: string;
}

export interface AssessmentResult {
  id: string;
  date: string;
  strengths: StrengthItem[];
  values: string[];
  answers: Answer[];
}