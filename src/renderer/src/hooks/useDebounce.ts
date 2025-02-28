import { useEffect, useState } from 'react';

const useDebouncedState = <T>(
  initialState: T,
  delay: number
): [state: T, (newState: T) => void] => {
  const [debouncedState, setDebouncedState] = useState(initialState);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const timeoutHandler = setTimeout(() => {
      setDebouncedState(state);
    }, delay);

    return (): void => clearTimeout(timeoutHandler);
  }, [state, delay]);

  return [debouncedState, setState];
};

export default useDebouncedState;
