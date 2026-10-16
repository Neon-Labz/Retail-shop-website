'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Check if error is related to Turbopack / Webpack dynamic chunk loading failure
    const isChunkError =
      error.name === 'ChunkLoadError' ||
      error.message?.includes('Failed to load chunk') ||
      error.message?.includes('Loading chunk') ||
      error.message?.includes('react-server-dom-turbopack');

    if (isChunkError) {
      console.warn('ChunkLoadError detected; refreshing page to retrieve latest bundles...');
      window.location.reload();
    }
  }, [error]);

  return (
    <div
      style={{
        padding: '80px 20px',
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#222', marginBottom: '16px' }}>
        Page Bundle Updated
      </h2>
      <p style={{ color: '#666', fontSize: '15px', marginBottom: '24px', maxWidth: '500px' }}>
        The development server restarted or recompiled this page. Please click below to refresh and load the latest updates.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          padding: '12px 30px',
          backgroundColor: '#F15B41',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '15px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Reload Page
      </button>
    </div>
  );
}
