import { Permission } from '@/types/rbac';

export const mockPermissions: Permission[] = [
  {
    id: '1',
    name: 'users.read',
    resource: 'users',
    action: 'read',
    description: 'Can read user data'
  },
  {
    id: '2',
    name: 'users.write',
    resource: 'users',
    action: 'write',
    description: 'Can create and update users'
  },
  {
    id: '3',
    name: 'users.delete',
    resource: 'users',
    action: 'delete',
    description: 'Can delete users'
  },
  {
    id: '4',
    name: 'roles.read',
    resource: 'roles',
    action: 'read',
    description: 'Can read roles'
  },
  {
    id: '5',
    name: 'roles.write',
    resource: 'roles',
    action: 'write',
    description: 'Can create and update roles'
  },
  {
    id: '6',
    name: 'roles.delete',
    resource: 'roles',
    action: 'delete',
    description: 'Can delete roles'
  },
  {
    id: '7',
    name: 'permissions.read',
    resource: 'permissions',
    action: 'read',
    description: 'Can read permissions'
  },
  {
    id: '8',
    name: 'permissions.write',
    resource: 'permissions',
    action: 'write',
    description: 'Can create and update permissions'
  }
];
