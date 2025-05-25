interface Test {
  _id: string;
  text: string;
  class: number;
  topic: string;
  answers: { text: string; isCorrect: boolean }[];
}

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
      <h2 className="test-card-title">{test.text}</h2>
      <ul className="test-card-answers">
        {test.answers.map((answer, index) => (
          <li
            key={index}
            className={`test-card-answer ${
              isSubmitted
                ? answer.isCorrect
                  ? "correct"
                  : selectedAnswer === index
                  ? "incorrect"
                  : ""
                : ""
            }`}
          >
            <label className="answer-label">
              <input
                type="radio"
                name={`test-${test._id}`}
                checked={selectedAnswer === index}
                onChange={() => onAnswerSelect(index)}
                disabled={isSubmitted}
                className="custom-radio"
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
