'use client';

import { useState, useCallback, useEffect } from 'react';

export function useSlider(total: number, autoplay: boolean = false) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const goNext = useCallback(() => {
    setDirection('next');
    setCurrent((prev) => (total > 0 ? (prev + 1) % total : 0));
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection('prev');
    setCurrent((prev) => (total > 0 ? (prev - 1 + total) % total : 0));
  }, [total]);

  useEffect(() => {
    if (!autoplay || total <= 1) return;
    const id = setInterval(goNext, 5000);
    return () => clearInterval(id);
  }, [autoplay, total, goNext]);

  return { current, direction, goNext, goPrev };
}
