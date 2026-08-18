import { useState, useEffect, useMemo } from 'react';

// @types
import { MenuProps } from '@/types/menu';

const initialState: MenuProps = {
  openedItem: '',
  isDashboardDrawerOpened: false
};

// Simple state management for menu (replaced SWR with useState for better performance)
let menuMasterState: MenuProps = initialState;
const listeners = new Set<(state: MenuProps) => void>();

export function useGetMenuMaster() {
  const [state, setState] = useState<MenuProps>(menuMasterState);

  // Subscribe to state changes
  useEffect(() => {
    const listener = (newState: MenuProps) => setState(newState);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const memoizedValue = useMemo(
    () => ({
      menuMaster: state,
      menuMasterLoading: false
    }),
    [state]
  );

  return memoizedValue;
}

export function handlerDrawerOpen(isDashboardDrawerOpened: boolean) {
  menuMasterState = { ...menuMasterState, isDashboardDrawerOpened };
  listeners.forEach((listener) => listener(menuMasterState));
}

export function handlerActiveItem(openedItem: string) {
  menuMasterState = { ...menuMasterState, openedItem };
  listeners.forEach((listener) => listener(menuMasterState));
}
