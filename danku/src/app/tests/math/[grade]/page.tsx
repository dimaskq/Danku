import GradeTestContainer from "@/components/Tests/GradeTestContainer";
import ErrorMessage from "@/components/Tests/ErrorMessage";
import EmptyTestsMessage from "@/components/Tests/EmptyTestsMessage";

interface Test {
  _id: string;
  text: string;
  class: number;
  topic: string;
  answers: { text: string; isCorrect: boolean }[];
}

interface Props {
  params: Promise<{ grade: string }>;
}

export async function generateStaticParams() {
  return Array.from({ length: 11 }, (_, i) => ({
    grade: String(i + 1),
  }));
}

export default async function GradeTestPage({ params }: Props) {
  try {
    const { grade } = await params;
    const gradeNumber = parseInt(grade, 10);

    console.log(`📥 Завантаження тестів для класу ${gradeNumber}`);

    if (isNaN(gradeNumber) || gradeNumber < 1 || gradeNumber > 11) {
      console.error(`❌ Невалідний клас: ${grade}`);
      return (
        <ErrorMessage title="Помилка" message={`Невалідний клас: ${grade}`} />
      );
    }

    const res = await fetch(
      `http://localhost:3000/api/questions?class=${gradeNumber}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Помилка API: ${errorText}`);
      return (
        <ErrorMessage
          title={`Тести з математики для ${grade} класу`}
          message={`Помилка завантаження тестів: ${res.status} ${res.statusText}`}
        />
      );
    }

    const tests: Test[] = await res.json();

    if (tests.length === 0) {
      return (
        <EmptyTestsMessage
          title={`Тести з математики для ${grade} класу`}
          message={`Тести для ${grade} класу відсутні.`}
        />
      );
    }

    return <GradeTestContainer grade={grade} />;
  } catch (error: any) {
    console.error(`❌ Серверна помилка: ${error.message}`, error.stack);
    return (
      <ErrorMessage
        title="Помилка"
        message={`Сталася серверна помилка: ${error.message}`}
      />
    );
  }
}
