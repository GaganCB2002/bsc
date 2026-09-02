export default function BrandLogo({ size = 48 }: { size?: number; variant?: 'light' | 'dark' | 'gold' }) {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      overflow: 'hidden',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
    }}>
      <img
        src="/bsc-logo.png"
        alt="BSC Exclusive"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}
