/** Navigation items `action.type` enum */
export enum NavActionType {
  FUNCTION = 'function',
  LINK = 'link'
}

/** Tabs custom props `type` enum */
export enum TabsType {
  SEGMENTED = 'segmented'
}

/** LinearProgress custom props `type` enum */
export enum LinearProgressType {
  LIGHT = 'light'
}

/** LinearProgress with label custom props `placement` enum */
export enum LinearProgressPlacement {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  TOPRIGHT = 'top-right',
  BOTTOMRIGHT = 'bottom-right',
  TOPLEFT = 'top-left',
  BOTTOMLEFT = 'bottom-left'
}

/** Chip custom props `position` enum */
export enum ChipIconPosition {
  RIGHT = 'right'
}

/** Avatar custom props `size` enum */
export enum AvatarSize {
  BADGE = 'badge',
  XXS = 'xxs',
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl'
}

/** Modal custom props `maxWidth` enum */
export enum ModalSize {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl'
}

/** Chart custom view mode enum */
export enum ViewMode {
  DAILY = 'Daily',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly'
}

/** Auth social props `type` enum */
export enum SocialTypes {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}

/** Auth role enum */
export enum AuthRole {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
  USER = 'user'
}

/** Auth type enum */
export enum AuthType {
  MOCK = 'mock',
  ONC = 'onc'
}

/** Provider type enum (for multi-provider pattern) */
export enum ProviderType {
  MOCK = 'mock',
  ONC = 'onc',
  FIREBASE = 'firebase',
  SUPABASE = 'supabase'
}

/** Social auth type enum */
export enum SocialAuthType {
  CORE = 'core'
}
