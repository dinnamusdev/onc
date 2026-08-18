// @mui
import { AvatarProps } from '@mui/material/Avatar';

export interface NotificationItemProps {
  avatar: AvatarProps;
  badgeAvatar?: AvatarProps;
  title: string;
  subTitle?: string;
  dateTime?: string;
  isSeen?: boolean;
}
