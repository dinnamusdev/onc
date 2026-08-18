import { useState, useEffect, useCallback, useRef, Dispatch, SetStateAction } from 'react';

type useLocalReturn<T> = {
  state: T;
  setState: Dispatch<SetStateAction<T>>;
  setField: <K extends keyof T>(key: K, value: T[K]) => void;
  resetState: () => void;
};

/***************************  HOOKS - LOCAL STORAGE  ***************************/

export default function useLocalStorage<T>(key: string, defaultValue: T): useLocalReturn<T> {
  // Load initial state from localStorage or fallback to default
  const readValue = (): T => {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err);
      return defaultValue;
    }
  };

  const [state, setState] = useState<T>(readValue);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync to localStorage whenever state changes (with debounce)
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (err) {
        console.warn(`Error setting localStorage key "${key}":`, err);
      }
    }, 300); // 300ms debounce

    // Cleanup on unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [key, state]);

  // Update single field
  const setField = useCallback(<K extends keyof T>(fieldKey: K, value: T[K]) => {
    setState((prev) => ({
      ...prev,
      [fieldKey]: value
    }));
  }, []);

  // Reset to defaults
  const resetState = useCallback(() => {
    setState(defaultValue);
    localStorage.setItem(key, JSON.stringify(defaultValue));
  }, [defaultValue, key]);

  return { state, setState, setField, resetState };
}
