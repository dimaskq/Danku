export interface Test {
  _id: string;
  text: string;
  class: string;
  topic: string;
  answers: { text: string; isCorrect: boolean }[];
}
