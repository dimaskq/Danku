interface EmptyTestsMessageProps {
  title: string;
  message: string;
}

export default function EmptyTestsMessage({
  title,
  message,
}: EmptyTestsMessageProps) {
  return (
    <main className="grade-test-container">
      <h1 className="grade-test-title">{title}</h1>
      <p className="grade-test-description">{message}</p>
    </main>
  );
}
