export interface Test {
  subject: string;
  level: string;
  started_at: string;
}

export interface Feedback {
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
}

export interface TestResult {
  subject: string;
  level: string;
  score: number;
  total: number;
  answers: string[];
  feedback: Feedback[];
  completed_at: string;
}

export interface LearningPlan {
  subject: string;
  level: string;
  topics_to_study: string[];
}

export interface UserStatus {
  current_test: Test | null;
  test_results: TestResult[];
  learning_plan: LearningPlan | null;
}
