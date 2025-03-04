import { useEffect, useRef, useState } from 'react';

const useDebouncedState = <T>(
  initialState: T,
  delay: number
): [state: T, (newState: T) => void] => {
  const [debouncedState, setDebouncedState] = useState(initialState);
  const [state, setState] = useState(initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedState(state);
    }, delay);

    return (): void => clearTimeout(timeoutRef.current as NodeJS.Timeout);
  }, [state, delay]);

  return [debouncedState, setState];
};

export default useDebouncedState;
