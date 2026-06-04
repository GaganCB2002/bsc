export default function BrandLogo({ size = 48, variant = 'light' }: { size?: number; variant?: 'light' | 'dark' | 'gold' }) {
  const bgColor = variant === 'gold' ? '#D4A574' : variant === 'dark' ? '#2C2826' : '#C47A6A';
  const textColor = variant === 'gold' ? '#2C2826' : '#FFF';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ borderRadius: '50%', flexShrink: 0 }}>
      <circle cx="24" cy="24" r="24" fill={bgColor} />
      <text x="24" y="24" textAnchor="middle" dominantBaseline="central" fill={textColor} fontFamily="Inter, sans-serif" fontWeight="800" fontSize="22" letterSpacing="-0.5">B</text>
      <text x="24" y="40" textAnchor="middle" dominantBaseline="central" fill={textColor} fontFamily="Inter, sans-serif" fontWeight="300" fontSize="10" letterSpacing="0.5">S</text>
    </svg>
  );
}
