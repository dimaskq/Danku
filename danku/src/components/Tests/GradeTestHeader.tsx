interface GradeTestHeaderProps {
  grade: string;
}

export default function GradeTestHeader({ grade }: GradeTestHeaderProps) {
  return (
    <h1 className="grade-test-title">Тести з математики для {grade} класу</h1>
  );
}
