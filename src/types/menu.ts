import { ReactNode } from 'react';

// @mui
import { ChipProps } from '@mui/material/Chip';

// @project
import { DynamicIconProps } from './tabler';
import { NavActionType } from '@/enum';

export type NavActionProps = {
  type: NavActionType;
  label: string;
  // eslint-disable-next-line
  function?: any;
  url?: string;
  target?: boolean;
  icon: DynamicIconProps['name'];
};

export type NavItemType = {
  breadcrumbs?: boolean;
  caption?: ReactNode | string;
  children?: NavItemType[];
  elements?: NavItemType[];
  chip?: ChipProps;
  color?: 'primary' | 'secondary' | 'default' | undefined;
  disabled?: boolean;
  external?: boolean;
  isDropdown?: boolean;
  icon?: DynamicIconProps['name'];
  id?: string;
  search?: string;
  target?: boolean;
  title?: string;
  type?: string;
  url?: string | undefined;
  actions?: NavActionProps[];
  roles?: string[];
};

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

export type MenuProps = {
  openedItem: string;
  isDashboardDrawerOpened: boolean; // Indicate if dashboard layout menu open or not
};

export type ListItemEventProps =
  | React.MouseEvent<HTMLButtonElement>
  | React.MouseEvent<HTMLAnchorElement>
  | React.MouseEvent<HTMLDivElement, MouseEvent>
  | undefined;
