export interface Question {
  _id: string;
  subject: string;
  level: string;
  question_text: string;
  options: string[];
  correct_answer: string;
}
