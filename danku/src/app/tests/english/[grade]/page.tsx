import GradeTestContainer from "@/components/Tests/GradeTestContainer";
import ErrorMessage from "@/components/Tests/ErrorMessage";
import EmptyTestsMessage from "@/components/Tests/EmptyTestsMessage";
import { Test } from "@/types/test";

interface Props {
  params: Promise<{ grade: string }>;
}

const validEnglishGrades = ["A1", "A2", "B1", "B2", "C1", "C2"];

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export async function generateStaticParams() {
  return validEnglishGrades.map((grade) => ({ grade }));
}

export default async function EnglishTestPage({ params }: Props) {
  try {
    const { grade } = await params;

    console.log(`EnglishTestPage accessed with grade: ${grade}`); // Debug log

    if (!validEnglishGrades.includes(grade)) {
      return (
        <ErrorMessage title="Помилка" message={`Невалідний рівень: ${grade}`} />
      );
    }

    console.log(`📥 Завантаження тестів для рівня ${grade}`);

    const res = await fetch(`${baseUrl}/api/questions?class=${grade}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Помилка API: ${errorText}`);
      return (
        <ErrorMessage
          title={`Тести з англійської для рівня ${grade}`}
          message={`Помилка завантаження тестів: ${res.status} ${res.statusText}`}
        />
      );
    }

    const tests: Test[] = await res.json();
    console.log(`Тести для class=${grade}:`, tests); // Debug log

    if (tests.length === 0) {
      return (
        <EmptyTestsMessage
          title={`Тести з англійської для рівня ${grade}`}
          message={`Тести для рівня ${grade} відсутні.`}
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
