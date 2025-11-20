import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              backgroundColor: 'white',
              borderRadius: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 'bold',
              color: '#3b82f6',
              marginRight: 20,
            }}
          >
            P
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            PASAAL.IO
          </div>
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Pricing Plans
        </div>
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: 600,
          }}
        >
          Start free and scale as you grow
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            gap: 30,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '20px 30px',
              borderRadius: 15,
              color: 'white',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>Free</div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>NPR 0/month</div>
          </div>
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px 30px',
              borderRadius: 15,
              color: '#3b82f6',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>Pro</div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>NPR 7,999/month</div>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '20px 30px',
              borderRadius: 15,
              color: 'white',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>Enterprise</div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>Custom</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}