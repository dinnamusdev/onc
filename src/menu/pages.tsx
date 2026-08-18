// @types
import { NavItemType } from '@/types/menu';

/***************************  MENU ITEMS - PAGES  ***************************/

const pages: NavItemType = {
  id: 'group-page',
  title: 'Navigation',
  icon: 'IconDotsVertical',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/sample-page',
      icon: 'IconLayoutDashboard'
    }
  ]
};

export default pages;
