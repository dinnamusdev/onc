// @third-party
import * as TablerIcons from '@tabler/icons-react';

export interface DynamicIconProps {
  name: keyof typeof TablerIcons; // Type-safe icon name
  size?: number;
  color?: string;
  stroke?: number;
}
