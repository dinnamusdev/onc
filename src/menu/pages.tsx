// @types
import { NavItemType } from '@/types/menu';

/***************************  MENU ITEMS - PAGES  ***************************/

const pages: NavItemType = {
  id: 'group-page',
  title: 'Gerenciar',
  icon: 'IconDotsVertical',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/sample-page',
      icon: 'IconLayoutDashboard'
    },
    {
      id: 'seguranca',
      title: 'Segurança',
      type: 'collapse',
      icon: 'IconShield',
      children: [
        {
          id: 'users',
          title: 'Usuários',
          type: 'item',
          url: '/users',
          icon: 'IconUsers'
        },
        {
          id: 'roles-permissions',
          title: 'Papéis e Permissões',
          type: 'item',
          url: '/roles-permissions',
          icon: 'IconShieldLock'
        }
      ]
    }
  ]
};

export default pages;
