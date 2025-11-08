import { useState, useEffect, useRef, MutableRefObject } from 'react';

/**
 * Custom hook for scroll offset with ref-based updates
 * Allows for smooth scrolling by tracking offset in both state and ref
 */
export function useScrollOffset(initial: number): [number, MutableRefObject<number>] {
  const [value, setValue] = useState(initial);
  const ref = useRef(initial);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ref.current !== value) {
        setValue(ref.current);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [value]);

  return [value, ref];
}
