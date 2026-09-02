interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  height?: number;
  color?: string;
}

export default function ProgressBar({ percentage, showLabel = true, height = 8, color = '#B91C1C' }: ProgressBarProps) {
  const safePercentage = Math.min(100, Math.max(0, Math.round(percentage || 0)));
  const isComplete = safePercentage >= 100;

  return (
    <div>
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: '#E8E0D6',
          borderRadius: `${height / 2}px`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${safePercentage}%`,
            height: '100%',
            background: isComplete
              ? 'linear-gradient(90deg, #16a34a, #22c55e)'
              : `linear-gradient(90deg, ${color}, ${color}dd)`,
            borderRadius: `${height / 2}px`,
            transition: 'width 0.5s ease-in-out',
          }}
        />
      </div>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '6px',
            fontSize: '0.75rem',
            color: isComplete ? '#16a34a' : '#8A7A6A',
            fontWeight: 600,
          }}
        >
          <span>{isComplete ? '✓ Course Completed' : `${safePercentage}% Complete`}</span>
          {!isComplete && (
            <span>{100 - safePercentage}% remaining</span>
          )}
        </div>
      )}
    </div>
  );
}
