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
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              width: 80,
              height: 80,
              backgroundColor: 'white',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              fontWeight: 'bold',
              color: '#667eea',
              marginRight: 20,
            }}
          >
            P
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            PASAAL.IO
          </div>
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'white',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.2,
          }}
        >
          Multi-tenant SaaS Platform for Nepal
        </div>
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            maxWidth: 600,
            marginTop: 20,
          }}
        >
          Automate inventory, sales & customer management
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}