import { Dispatch, SetStateAction } from 'react';

// @project
import { ThemeDirection, ThemeI18n, Themes } from '@/config';

export interface ConfigStates {
  currentTheme: Themes;
  themeDirection: ThemeDirection;
  miniDrawer: boolean;
  i18n: ThemeI18n;
}

export type ConfigContextValue = {
  state: ConfigStates;
  setState: Dispatch<SetStateAction<ConfigStates>>;
  setField: (name: keyof ConfigStates, updateValue: ConfigStates[keyof ConfigStates]) => void;
  resetState: () => void;
};
