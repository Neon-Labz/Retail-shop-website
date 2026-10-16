'use client';

import { useEffect } from 'react';

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Automatically auto-reload once if a stale Turbopack chunk was requested
    if (
      error.name === 'ChunkLoadError' ||
      error.message?.includes('Failed to load chunk') ||
      error.message?.includes('Loading chunk')
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#222', marginBottom: '16px' }}>
        Unable to load shop products
      </h2>
      <p style={{ color: '#666', fontSize: '15px', marginBottom: '24px' }}>
        The shop bundle was updated on the dev server. Click below to refresh the page.
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
        Refresh Shop
      </button>
    </div>
  );
}
