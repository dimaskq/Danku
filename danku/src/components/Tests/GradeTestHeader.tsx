interface GradeTestHeaderProps {
  grade: string;
}

export default function GradeTestHeader({ grade }: GradeTestHeaderProps) {
  const subject = isNaN(parseInt(grade)) ? "англійської" : "математики";
  const displayGrade = isNaN(parseInt(grade))
    ? `рівня ${grade}`
    : `${grade} класу`;
  return (
    <h2 className="tests__header">
      Тести з {subject} для {displayGrade}
    </h2>
  );
}
