// @project
import { AuthType } from '@/enum';

// @types
import { ConfigStates } from '@/types/config';

/***************************  THEME CONSTANT  ***************************/

export const APP_DEFAULT_PATH = '/sample-page';
export const APP_SUPPORT_PATH = 'https://phoenixcoded.authordesk.app/';

export const DRAWER_WIDTH = 254;
export const MINI_DRAWER_WIDTH = 76 + 1; // 1px - for right-side border

export const CSS_VAR_PREFIX = '';

/***************************  AUTH CONSTANT  ***************************/

export const AUTH_USER_KEY = 'auth-user';
export const AUTH_CONFIG_KEY = 'saas-able-auth-config';
export const AUTH_PROVIDER: AuthType = AuthType.MOCK;

/***************************  THEME ENUM  ***************************/

export enum Themes {
  THEME_CRM = 'crm',
  THEME_AI = 'ai',
  THEME_HOSTING = 'hosting'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export enum ThemeDirection {
  LTR = 'ltr',
  RTL = 'rtl'
}

export enum ThemeI18n {
  EN = 'en',
  FR = 'fr',
  RO = 'ro',
  ZH = 'zh'
}

export const DEFAULT_THEME_MODE: ThemeMode = ThemeMode.SYSTEM;

/***************************  CONFIG  ***************************/

const config: ConfigStates = {
  currentTheme: Themes.THEME_HOSTING,
  themeDirection: ThemeDirection.LTR,
  miniDrawer: false,
  i18n: ThemeI18n.EN
};

export default config;

/***************************  THEME - FONT FAMILY  ***************************/

export const FONT_ROBOTO: string = 'Roboto, "Helvetica Neue", Arial, sans-serif';
export const FONT_ARCHIVO: string = 'Archivo, "Helvetica Neue", Arial, sans-serif';
export const FONT_FIGTREE: string = 'Figtree, "Helvetica Neue", Arial, sans-serif';
