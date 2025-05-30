import GradeTestContainer from "@/components/Tests/GradeTestContainer";
import ErrorMessage from "@/components/Tests/ErrorMessage";
import EmptyTestsMessage from "@/components/Tests/EmptyTestsMessage";
import { Test } from "@/types/test";

interface Props {
  params: Promise<{ grade: string }>;
}

const validMathGrades = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
];

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function generateStaticParams() {
  return validMathGrades.map((grade) => ({ grade }));
}

export default async function MathTestPage({ params }: Props) {
  try {
    const { grade } = await params;

    console.log(`MathTestPage accessed with grade: ${grade}`);

    if (!validMathGrades.includes(grade)) {
      return (
        <ErrorMessage title="Помилка" message={`Невалідний клас: ${grade}`} />
      );
    }

    console.log(`📥 Завантаження тестів для класу ${grade}`);

    const res = await fetch(`${baseUrl}/api/questions?class=${grade}`, {
      cache: "no-store",
    });

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
    console.log(`Тести для class=${grade}:`, tests);

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
