import { useEffect, useState } from "react";

const UseDebounce = <T>(value: T, delay: number = 1000) => {
  const [debValue, setDebValue] = useState<T>(value);

  /**
   * Debouncer
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebValue(value);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  return debValue;
};

export default UseDebounce;
