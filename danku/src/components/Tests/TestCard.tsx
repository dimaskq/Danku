import { Test } from "@/types/test";

interface TestCardProps {
  test: Test;
  selectedAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void;
  isSubmitted: boolean;
}

export default function TestCard({
  test,
  selectedAnswer,
  onAnswerSelect,
  isSubmitted,
}: TestCardProps) {
  return (
    <div className="test-card">
      <h3 className="test-card-title">{test.text}</h3>
      <ul className="test-card-answers">
        {test.answers.map((answer, index) => (
          <li key={index} className="test-card-answer">
            <label className="answer-label">
              <input
                type="radio"
                className="custom-radio"
                name={`answer-${test._id}`}
                checked={selectedAnswer === index}
                onChange={() => onAnswerSelect(index)}
                disabled={isSubmitted}
              />
              <span className="custom-radio-visual"></span>
              <span className="answer-text">{answer.text}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
