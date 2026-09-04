import { Permission } from '@/types/rbac';

export const mockPermissions: Permission[] = [
  {
    id: '1',
    name: 'users.read',
    subject: 'Usuário',
    resource: 'users',
    action: 'read',
    description: 'Can read user data',
    roles: ['Administrator', 'Manager']
  },
  {
    id: '2',
    name: 'users.write',
    subject: 'Usuário',
    resource: 'users',
    action: 'write',
    description: 'Can create and update users',
    roles: ['Administrator']
  },
  {
    id: '3',
    name: 'users.delete',
    subject: 'Usuário',
    resource: 'users',
    action: 'delete',
    description: 'Can delete users',
    roles: ['Administrator']
  },
  {
    id: '4',
    name: 'roles.read',
    subject: 'Papel',
    resource: 'roles',
    action: 'read',
    description: 'Can read roles',
    roles: ['Administrator', 'Manager', 'User']
  },
  {
    id: '5',
    name: 'roles.write',
    subject: 'Papel',
    resource: 'roles',
    action: 'write',
    description: 'Can create and update roles',
    roles: ['Administrator']
  },
  {
    id: '6',
    name: 'roles.delete',
    subject: 'Papel',
    resource: 'roles',
    action: 'delete',
    description: 'Can delete roles',
    roles: ['Administrator']
  },
  {
    id: '7',
    name: 'permissions.read',
    subject: 'Permissão',
    resource: 'permissions',
    action: 'read',
    description: 'Can read permissions',
    roles: ['Administrator', 'Manager']
  },
  {
    id: '8',
    name: 'permissions.write',
    subject: 'Permissão',
    resource: 'permissions',
    action: 'write',
    description: 'Can create and update permissions',
    roles: ['Administrator']
  }
];
