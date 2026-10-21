'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function PriceRangeSlider({
  min, max, value, onChange,
  accentColor = '#222', mutedColor = '#555', textColor = '#222',
}: {
  min: number; max: number; value: [number, number]; onChange: (v: [number, number]) => void;
  accentColor?: string; mutedColor?: string; textColor?: string;
}) {
  const [local, setLocal] = useState<[number, number]>(value);
  const localRef = useRef(local);
  localRef.current = local;
  const isPointerDownRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocal(value);
  }, [value[0], value[1]]);

  const flushCommit = useCallback(() => {
    isPointerDownRef.current = false;
    if (debounceRef.current) { clearTimeout(debounceRef.current); debounceRef.current = null; }
    onChange(localRef.current);
  }, [onChange]);

  const scheduleCommit = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      if (!isPointerDownRef.current) onChange(localRef.current);
    }, 400);
  }, [onChange]);

  const span = max - min || 1;
  const leftPct = ((local[0] - min) / span) * 100;
  const rightPct = ((local[1] - min) / span) * 100;

  const releaseHandlers = {
    onPointerUp: flushCommit,
    onTouchEnd: flushCommit,
    onMouseUp: flushCommit,
    onKeyUp: flushCommit,
    onBlur: flushCommit,
    onPointerDown: (e: React.PointerEvent<HTMLInputElement>) => {
      isPointerDownRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
  };

  return (
    <div>
      <p className="text-[14px] mb-[18px]" style={{ color: mutedColor }}>
        The highest price is LKR {max.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>

      <div className="relative h-[4px] mt-[28px] mb-[22px] mx-0">
        <div className="absolute top-[1px] left-[14px] right-[14px] h-[2px] bg-[radial-gradient(circle,#999_1px,transparent_1.5px)] bg-[length:6px_2px] bg-repeat-x" />

        <div
          className="absolute top-0 h-[4px] rounded-[2px]"
          style={{
            backgroundColor: accentColor,
            left: `calc(14px + (100% - 28px) * ${leftPct / 100})`,
            width: `calc((100% - 28px) * ${(rightPct - leftPct) / 100})`,
          }}
        />

        <input
          type="range" min={min} max={max} value={local[0]}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            if (v < local[1]) { setLocal([v, local[1]]); scheduleCommit(); }
          }}
          className="price-slider-thumb absolute left-[14px] right-[14px] top-1/2 -translate-y-1/2 h-[28px] appearance-none bg-transparent pointer-events-none z-[3] m-0"
          {...releaseHandlers}
        />

        <input
          type="range" min={min} max={max} value={local[1]}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            if (v > local[0]) { setLocal([local[0], v]); scheduleCommit(); }
          }}
          className="price-slider-thumb absolute left-[14px] right-[14px] top-1/2 -translate-y-1/2 h-[28px] appearance-none bg-transparent pointer-events-none z-[4] m-0"
          {...releaseHandlers}
        />
      </div>

      <p className="text-[14px] font-semibold" style={{ color: textColor }}>
        Price: <span className="font-normal" style={{ color: mutedColor }}>LKR {local[0].toLocaleString('en-US')} – LKR {local[1].toLocaleString('en-US')}</span>
      </p>
    </div>
  );
}
