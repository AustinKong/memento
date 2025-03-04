import { useEffect, useRef } from 'react';

const useEffectDebounced = (callback: () => void, dependencies: unknown[], delay: number): void => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

    return (): void => clearTimeout(timeoutRef.current as NodeJS.Timeout);
  }, [delay, callback, ...dependencies]);
};

export default useEffectDebounced;
