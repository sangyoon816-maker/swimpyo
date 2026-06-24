import { ImageResponse } from 'next/og';

export const alt = '쉼표 — 내 동네 힐링 장소';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF9F6',
        }}
      >
        <div style={{ display: 'flex', fontSize: 100, fontWeight: 900, color: '#1A1A1A' }}>
          쉼표<span style={{ color: '#5F8D4E' }}>,</span>
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#6B7280', marginTop: 20 }}>
          내 동네에서 찾는 쉼
        </div>
      </div>
    ),
    { ...size }
  );
}
