interface KeyTakeawaysProps {
  takeaways: string[];
}

export default function KeyTakeaways({ takeaways }: KeyTakeawaysProps) {
  if (!takeaways || takeaways.length === 0) return null;

  return (
    <div
      className="my-8 rounded-lg border-l-4 p-6"
      style={{
        borderLeftColor: 'var(--color-primary)',
        backgroundColor: 'color-mix(in srgb, var(--color-primary) 4%, white)',
      }}
    >
      <h2 className="text-lg font-bold text-gray-900">Key Takeaways</h2>
      <ul className="mt-4 space-y-3">
        {takeaways.map((takeaway, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: 'var(--color-primary)' }}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-sm leading-relaxed text-gray-700">{takeaway}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
