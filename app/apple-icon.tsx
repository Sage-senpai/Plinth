import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#080705',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 79, height: 22, borderRadius: 6, background: '#D97706' }} />
        <div style={{ width: 45, height: 51, background: '#B45309' }} />
        <div style={{ width: 101, height: 20, borderRadius: 6, background: '#D97706' }} />
        <div style={{ width: 129, height: 20, borderRadius: 6, background: '#B45309' }} />
      </div>
    ),
    size,
  );
}
