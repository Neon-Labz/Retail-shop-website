'use client';

export function IconSriLankaFlag() {
  return (
    <span
      role="img"
      aria-label="Sri Lanka Flag"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        lineHeight: 1,
        borderRadius: '2px',
        overflow: 'hidden',
      }}
    >
      🇱🇰
    </span>
  );
}

export function HeaderLanguageCurrency({ textColor = '#222' }: { textColor?: string }) {
  return (
    <div
      className="header-lang-currency"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '13px',
        color: textColor,
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
        <IconSriLankaFlag />
        <span style={{ fontWeight: 500, color: textColor }}>Sri Lanka</span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: '#111',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '3px',
            letterSpacing: '0.5px',
          }}
        >
          LKR
        </span>
      </div>

      <span style={{ color: '#d0d4dc' }}>|</span>

      <span style={{ fontWeight: 500, color: textColor }}>English</span>
    </div>
  );
}
