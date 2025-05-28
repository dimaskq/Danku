import { notFound } from "next/navigation";
import Link from "next/link";
import "../../../../../components/Tests/tests.css";

interface Props {
  params: Promise<{ grade: string }>;
  searchParams: Promise<{
    correctCount?: string;
    total?: string;
    topics?: string;
    grade?: string;
  }>;
}

export default async function ResultsPage({ params, searchParams }: Props) {
  const { grade } = await params;
  const { correctCount, total, topics } = await searchParams;

  // Дозволені рівні англійської мови за системою CEFR
  const validLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  if (!validLevels.includes(grade)) {
    notFound();
  }

  // Перевірка правильності параметрів запиту
  if (
    !correctCount ||
    !total ||
    isNaN(parseInt(correctCount)) ||
    isNaN(parseInt(total))
  ) {
    return (
      <div className="error">
        <h1 className="error__title">Помилка</h1>
        <p className="error__message">
          Недостатньо або некоректні дані для відображення результатів.
        </p>
        <Link href={`/tests/english/${grade}`} className="error__retake-button">
          Повернутися до тесту
        </Link>
      </div>
    );
  }

  const correct = parseInt(correctCount, 10);
  const totalQuestions = parseInt(total, 10);
  const incorrectTopics = topics
    ? decodeURIComponent(topics)
        .split(",")
        .filter((topic) => topic.trim())
    : [];

  return (
    <main className="results">
      <h1 className="results__title">
        Результати тесту з англійської мови для рівня {grade}
      </h1>
      <div className="results__card">
        <p className="results__score">
          Результат: {correct} з {totalQuestions} правильних відповідей
        </p>
        {incorrectTopics.length > 0 ? (
          <div className="results__topics">
            <p className="results__topics-title">Теми, які варто повторити:</p>
            <ul className="results__topics-list">
              {incorrectTopics.map((topic, index) => (
                <li key={index} className="results__topic-item">
                  {topic}
                </li>
              ))}
            </ul>
            <p className="results__topics-message">
              Повторіть ці теми та повертайтесь, щоб пройти тест знову!
            </p>
          </div>
        ) : (
          <p className="results__perfect-score">
            Відмінно! Усі відповіді правильні. Спробуйте пройти тест ще раз або
            виберіть інший рівень.
          </p>
        )}
        <Link
          href={`/tests/english/${grade}`}
          className="results__retake-button"
        >
          Пройти тест знову
        </Link>
      </div>
    </main>
  );
}
