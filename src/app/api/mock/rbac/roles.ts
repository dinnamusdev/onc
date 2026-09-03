import { Role } from '@/types/rbac';

export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access',
    isSystem: true,
    permissions: [{ id: '*', name: '*' }],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Limited administrative access',
    isSystem: false,
    permissions: [
      { id: 'users.read', name: 'users.read' },
      { id: 'users.write', name: 'users.write' },
      { id: 'roles.read', name: 'roles.read' }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'User',
    description: 'Standard user access',
    isSystem: false,
    permissions: [{ id: 'users.read', name: 'users.read' }],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];
