'use client';

import { useState, useEffect, useCallback, SyntheticEvent } from 'react';

// @mui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// @icons
import {
  IconChevronLeft,
  IconChevronRight,
  IconDotsVertical,
  IconEdit,
  IconFilter,
  IconPlus,
  IconSearch,
  IconShield,
  IconTrash,
  IconUser,
  IconX
} from '@tabler/icons-react';

// @third-party
import useSWR, { mutate } from 'swr';

// @project
import UsersView from '@/views/admin/users';
import CreateUserDialog from '@/sections/users/CreateUserDialog';
import CreatePermissionDialog, { PermissionData } from '@/sections/permissions/CreatePermissionDialog';
import CreateRoleDialog from '@/sections/roles/CreateRoleDialog';
import {
  getRoles,
  getPermissions,
  deleteRole,
  createPermission,
  updatePermission,
  deletePermission,
  updateRole,
  assignPermission,
  assignRolesToUser
} from '@/utils/api/rbac';
import { getUsers } from '@/utils/api/users';
import { openSnackbar } from '@/states/snackbar';
import { Role as ApiRole, Permission as ApiPermission } from '@/types/rbac';

/*************************** TYPES ***************************/

interface PermissionItem {
  id: string;
  name: string;
  description: string;
}

interface AssignedUser {
  id: string;
  name: string;
  username: string;
}

interface RoleRow {
  id: string;
  name: string;
  description: string;
  assignedUsers: string[];
  extraUsersCount: number;
  permissionCount: number;
  permissions: PermissionItem[];
  users: AssignedUser[];
}

interface PermissionRow {
  id: string;
  subject: string;
  action: string;
  description: string;
  roles: string[];
}

interface CreateRoleData {
  name?: string;
  roleName?: string;
  description?: string;
}

interface CreatePermissionData {
  target?: string;
  actions?: string[];
  action?: string;
  name?: string;
  permission?: string;
  description?: string;
  roles?: string[];
}

/*************************** MOCK DATA ***************************/

const mockPermissionsForRole: PermissionItem[] = [
  {
    id: 'account.delete',
    name: 'account.delete',
    description: 'Permite aos usuários remover permanentemente registros da conta, incluindo os dados associados.'
  },
  {
    id: 'account.view',
    name: 'account.view',
    description: 'Permite aos usuários visualizar detalhes da conta, informações do perfil e registros de atividade.'
  },
  {
    id: 'account.update',
    name: 'account.update',
    description: 'Permite aos usuários modificar informações da conta, como dados de contato e preferências.'
  },
  {
    id: 'account.edit',
    name: 'account.edit',
    description: 'Permite aos usuários editar registros existentes da conta e atualizar campos específicos.'
  },
  {
    id: 'account.user',
    name: 'account.user',
    description: 'Permite aos usuários gerenciar contas de usuários, incluindo criação e atribuição de papéis.'
  },
  {
    id: 'invoice.create',
    name: 'invoice.create',
    description: 'Permite aos usuários criar e gerar novas faturas para cobranças e transações.'
  },
  {
    id: 'invoice.view',
    name: 'invoice.view',
    description: 'Permite aos usuários visualizar faturas atuais e históricas, incluindo o status dos pagamentos.'
  },
  {
    id: 'invoice.delete',
    name: 'invoice.delete',
    description: 'Permite aos usuários excluir faturas do sistema quando possuem autorização.'
  },
  {
    id: 'invoice.send',
    name: 'invoice.send',
    description: 'Permite aos usuários enviar faturas geradas para clientes ou responsáveis por e-mail.'
  }
];

const mockAssignedUsers: AssignedUser[] = [
  {
    id: '1',
    name: 'Allison Mosciski',
    username: 'allison_mosciski'
  },
  {
    id: '2',
    name: 'Stacy Reichel',
    username: 'stacy_reichel.880'
  },
  {
    id: '3',
    name: 'Roderick Rohan',
    username: 'roderick.rohan'
  }
];

const mockRoles: RoleRow[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Responsável por gerenciar as atividades e permissões relacionadas à função de Super Admin.',
    assignedUsers: ['A', 'B', 'C', 'D'],
    extraUsersCount: 2,
    permissionCount: 32,
    permissions: mockPermissionsForRole,
    users: [mockAssignedUsers[0]]
  },
  {
    id: '2',
    name: 'Gestor',
    description: 'Responsável por gerenciar as atividades e permissões relacionadas à função de Gestor.',
    assignedUsers: ['A', 'B', 'C', 'D'],
    extraUsersCount: 2,
    permissionCount: 24,
    permissions: mockPermissionsForRole.slice(0, 6),
    users: [mockAssignedUsers[1]]
  },
  {
    id: '3',
    name: 'Gerente',
    description: 'Responsável por gerenciar as atividades e permissões relacionadas à função de Gerente.',
    assignedUsers: ['A', 'B', 'C', 'D'],
    extraUsersCount: 2,
    permissionCount: 23,
    permissions: mockPermissionsForRole.slice(0, 5),
    users: [mockAssignedUsers[2]]
  },
  {
    id: '4',
    name: 'Atendente',
    description: 'Responsável por gerenciar as atividades e permissões relacionadas à função de Atendente.',
    assignedUsers: ['A', 'B', 'C', 'D'],
    extraUsersCount: 2,
    permissionCount: 12,
    permissions: mockPermissionsForRole.slice(0, 4),
    users: []
  }
];

const mockPermissions: PermissionRow[] = [
  {
    id: '1',
    subject: 'account',
    action: 'account.delete',
    description: 'Permite aos usuários remover permanentemente registros da conta, incluindo os dados associados.',
    roles: ['Super Admin', 'Admin']
  },
  {
    id: '2',
    subject: 'account',
    action: 'account.view',
    description: 'Permite aos usuários visualizar detalhes da conta, informações do perfil e registros de atividade.',
    roles: ['Gestor', 'Admin']
  },
  {
    id: '3',
    subject: 'account',
    action: 'account.update',
    description: 'Permite aos usuários modificar informações da conta, como dados de contato e preferências.',
    roles: ['Product Designer']
  },
  {
    id: '4',
    subject: 'account',
    action: 'account.edit',
    description: 'Permite aos usuários editar registros existentes da conta e atualizar campos específicos.',
    roles: ['Developers', 'Tester']
  },
  {
    id: '5',
    subject: 'account',
    action: 'account.user',
    description: 'Permite aos usuários gerenciar contas de usuários, incluindo criação e atribuição de papéis.',
    roles: ['Super Admin', 'Admin']
  }
];

/*************************** FILTER DATA ***************************/

const filterPermissions = ['account.delete', 'account.view', 'account.update', 'account.edit', 'account.user'];

const filterRoles = ['Super Admin', 'Billing Admin', 'Admin', 'Developer', 'Product Designer'];

/*************************** VIEW ***************************/

export default function RolesPermissionsView() {
  const [tab, setTab] = useState(0);

  const [rolesPage, setRolesPage] = useState(1);
  const [permissionsPage, setPermissionsPage] = useState(1);

  // Mantém a paginação com o mesmo padrão visual do Figma.
  // Os dados reais podem ultrapassar 10 páginas quando conectados à API.
  const rowsPerPage = 10;

  const [roles, setRoles] = useState<RoleRow[]>(mockRoles);
  const [permissions, setPermissions] = useState<PermissionRow[]>(mockPermissions);

  /*************************** DATA LOADING (BACKEND) ***************************/

  // Carrega papéis e permissões reais do backend, mapeando para o
  // formato das linhas exibidas na tabela. Em caso de erro, mantém o mock.
  const reloadData = useCallback(async () => {
    const [rolesRes, permsRes] = await Promise.all([getRoles(), getPermissions()]);

    if (!rolesRes.error && Array.isArray(rolesRes.data)) {
      const mapped: RoleRow[] = (rolesRes.data as ApiRole[]).map((role) => {
        const rolePermissions = (role.permissions ?? []).map((p) => ({
          id: String(p.id),
          name: p.name ?? '',
          description: p.description ?? ''
        }));

        // Processa usuários atribuídos ao role
        const roleUsers = (role.users ?? []).map((u: any) => ({
          id: String(u.id ?? ''),
          name: String(u.name || u.userName || u.email || 'Usuário'),
          username: String(u.userName || u.email || '')
        }));

        const assignedUserNames = roleUsers.map((u) => u.name?.charAt(0)?.toUpperCase() || 'U');
        const extraUsersCount = Math.max(0, roleUsers.length - 4);

        return {
          id: String(role.id),
          name: role.name,
          description: role.description ?? '',
          assignedUsers: assignedUserNames,
          extraUsersCount,
          permissionCount: rolePermissions.length,
          permissions: rolePermissions,
          users: roleUsers
        };
      });
      setRoles(mapped);
    }

    if (!permsRes.error && Array.isArray(permsRes.data)) {
      const mapped: PermissionRow[] = (permsRes.data as ApiPermission[]).map((perm) => ({
        id: String(perm.id),
        subject: perm.subject ?? '',
        action: Array.isArray(perm.action) ? perm.action.join(', ') : (perm.action ?? perm.name ?? ''),
        description: perm.description ?? '',
        roles: (perm.roles ?? []).map(String)
      }));
      setPermissions(mapped);
    }
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  /*************************** SEARCH ***************************/

  const [search, setSearch] = useState('');

  /*************************** CREATE ***************************/

  const [openCreateRoleDialog, setOpenCreateRoleDialog] = useState(false);

  const [openCreatePermissionDialog, setOpenCreatePermissionDialog] = useState(false);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  /*************************** ROLE MENU ***************************/

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const [menuRole, setMenuRole] = useState<RoleRow | null>(null);

  /*************************** PERMISSION MENU ***************************/

  const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] = useState<null | HTMLElement>(null);

  const [menuPermission, setMenuPermission] = useState<PermissionRow | null>(null);

  /*************************** EDIT ROLE ***************************/

  const [openEditRoleDialog, setOpenEditRoleDialog] = useState(false);

  const [editRoleName, setEditRoleName] = useState('');

  const [editRoleDescription, setEditRoleDescription] = useState('');

  const [editPermissions, setEditPermissions] = useState<PermissionItem[]>([]);

  const [editUsers, setEditUsers] = useState<AssignedUser[]>([]);

  const [openPermissionSelectDialog, setOpenPermissionSelectDialog] = useState(false);

  const [openUserSelectDialog, setOpenUserSelectDialog] = useState(false);

  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Buscar permissões disponíveis para seleção
  const {
    data: availablePermissions,
    error: permissionsError,
    isLoading: permissionsLoading
  } = useSWR<ApiPermission[]>('/api/rbac/permissions', async () => {
    const { data, error } = await getPermissions();
    if (error) throw new Error(error);
    return (data ?? []) as ApiPermission[];
  });

  // Buscar usuários disponíveis para seleção
  const { data: availableUsers, isLoading: usersLoading } = useSWR('/api/users', async () => {
    const { data, error } = await getUsers();
    if (error) throw new Error(error);
    const list = (Array.isArray(data) ? data : []) as Array<Record<string, unknown>>;
    return list.map((u) => ({
      id: String(u.id ?? ''),
      name: String(u.nomeCompleto || u.userName || u.email || u.id || 'Usuário'),
      username: String(u.userName || u.email || '')
    }));
  });

  /*************************** DELETE ROLE ***************************/

  const [openDeleteRoleDialog, setOpenDeleteRoleDialog] = useState(false);

  /*************************** EDIT PERMISSION ***************************/

  const [openEditPermissionDialog, setOpenEditPermissionDialog] = useState(false);

  const [editPermissionData, setEditPermissionData] = useState<PermissionData | null>(null);

  /*************************** DELETE PERMISSION ***************************/

  const [openDeletePermissionDialog, setOpenDeletePermissionDialog] = useState(false);

  /*************************** FILTER ***************************/

  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  const [permissionFilterSearch, setPermissionFilterSearch] = useState('');

  const [roleFilterSearch, setRoleFilterSearch] = useState('');

  const [selectedFilterPermissions, setSelectedFilterPermissions] = useState<string[]>([]);

  const [selectedFilterRoles, setSelectedFilterRoles] = useState<string[]>([]);

  const [appliedPermissionFilters, setAppliedPermissionFilters] = useState<string[]>([]);

  const [appliedRoleFilters, setAppliedRoleFilters] = useState<string[]>([]);

  /*************************** TAB ***************************/

  const handleTabChange = (_event: SyntheticEvent, value: number) => {
    setTab(value);
    setSearch('');
    setRolesPage(1);
    setPermissionsPage(1);
  };

  const addButtonLabel = tab === 0 ? 'Novo Papel' : 'Nova Permissão';

  const handleAddClick = () => {
    if (tab === 0) {
      setOpenCreateRoleDialog(true);
      return;
    }

    if (tab === 1) {
      setOpenCreatePermissionDialog(true);
    }
  };

  /*************************** SEARCH ***************************/

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);

    if (tab === 0) {
      setRolesPage(1);
    } else if (tab === 1) {
      setPermissionsPage(1);
    }
  };

  /*************************** FILTER ***************************/

  const handleFilterOpen = () => {
    setPermissionFilterSearch('');
    setRoleFilterSearch('');

    setSelectedFilterPermissions(appliedPermissionFilters);

    setSelectedFilterRoles(appliedRoleFilters);

    setOpenFilterDialog(true);
  };

  const handleFilterClose = () => {
    setOpenFilterDialog(false);
  };

  const handleTogglePermissionFilter = (permission: string) => {
    setSelectedFilterPermissions((current) =>
      current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission]
    );
  };

  const handleToggleRoleFilter = (role: string) => {
    setSelectedFilterRoles((current) => (current.includes(role) ? current.filter((item) => item !== role) : [...current, role]));
  };

  const handleResetFilter = () => {
    setSelectedFilterPermissions([]);
    setSelectedFilterRoles([]);
    setAppliedPermissionFilters([]);
    setAppliedRoleFilters([]);
    setRolesPage(1);
    setPermissionsPage(1);
    setOpenFilterDialog(false);
  };

  const handleRemoveIndividualFilter = (filter: string, type: 'permission' | 'role') => {
    if (type === 'permission') {
      setAppliedPermissionFilters((current) => current.filter((item) => item !== filter));
    } else {
      setAppliedRoleFilters((current) => current.filter((item) => item !== filter));
    }
    setRolesPage(1);
    setPermissionsPage(1);
  };

  const handleClearAllFilters = () => {
    setAppliedPermissionFilters([]);
    setAppliedRoleFilters([]);
    setSearch('');
    setRolesPage(1);
    setPermissionsPage(1);
  };

  const hasActiveFilters = search.trim() !== '' || appliedPermissionFilters.length > 0 || appliedRoleFilters.length > 0;

  const handleApplyFilter = () => {
    setAppliedPermissionFilters(selectedFilterPermissions);

    setAppliedRoleFilters(selectedFilterRoles);

    setRolesPage(1);
    setPermissionsPage(1);
    setOpenFilterDialog(false);
  };

  const filteredPermissionOptions = filterPermissions.filter((permission) =>
    permission.toLowerCase().includes(permissionFilterSearch.toLowerCase())
  );

  const filteredRoleOptions = filterRoles.filter((role) => role.toLowerCase().includes(roleFilterSearch.toLowerCase()));

  /*************************** VISIBLE ROLES ***************************/

  const visibleRoles = roles.filter((role) => {
    const normalizedSearch = search.trim().toLowerCase();

    const matchesSearch =
      normalizedSearch === '' ||
      role.name.toLowerCase().includes(normalizedSearch) ||
      role.description.toLowerCase().includes(normalizedSearch);

    if (!matchesSearch) {
      return false;
    }

    if (appliedPermissionFilters.length === 0) {
      return true;
    }

    return appliedPermissionFilters.some((permission) => role.permissions.some((item) => item.id === permission));
  });

  /*************************** VISIBLE PERMISSIONS ***************************/

  const visiblePermissions = permissions.filter((permission) => {
    const normalizedSearch = search.trim().toLowerCase();

    const matchesSearch =
      normalizedSearch === '' ||
      permission.subject.toLowerCase().includes(normalizedSearch) ||
      permission.action.toLowerCase().includes(normalizedSearch) ||
      permission.description.toLowerCase().includes(normalizedSearch);

    if (!matchesSearch) {
      return false;
    }

    if (appliedRoleFilters.length === 0) {
      return true;
    }

    return appliedRoleFilters.some((role) => permission.roles.includes(role));
  });

  /*************************** PAGINAÇÃO ***************************/

  const totalRolePages = Math.max(1, Math.ceil(visibleRoles.length / rowsPerPage));

  const totalPermissionPages = Math.max(1, Math.ceil(visiblePermissions.length / rowsPerPage));

  const paginatedRoles = visibleRoles.slice((rolesPage - 1) * rowsPerPage, rolesPage * rowsPerPage);

  const paginatedPermissions = visiblePermissions.slice((permissionsPage - 1) * rowsPerPage, permissionsPage * rowsPerPage);

  useEffect(() => {
    setRolesPage((currentPage) => Math.min(currentPage, totalRolePages));
  }, [totalRolePages]);

  useEffect(() => {
    setPermissionsPage((currentPage) => Math.min(currentPage, totalPermissionPages));
  }, [totalPermissionPages]);

  /*************************** ROLE MENU ***************************/

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, role: RoleRow) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuRole(role);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  /*************************** EDIT ROLE ***************************/

  const handleEditRoleOpen = () => {
    if (!menuRole) {
      return;
    }

    setEditRoleName(menuRole.name);
    setEditRoleDescription(menuRole.description);
    setEditPermissions(menuRole.permissions);
    setEditUsers(menuRole.users);
    setSelectedPermissionIds([]);
    setSelectedUserIds([]);

    handleMenuClose();
    setOpenEditRoleDialog(true);
  };

  const handleEditRoleClose = () => {
    setOpenEditRoleDialog(false);
  };

  const handleRemovePermission = (permissionId: string) => {
    setEditPermissions((current) => current.filter((permission) => permission.id !== permissionId));
  };

  const handleRemoveUser = (userId: string) => {
    setEditUsers((current) => current.filter((user) => user.id !== userId));
  };

  const handleAddPermissions = (permissionIds: string[]) => {
    setSelectedPermissionIds(permissionIds);
  };

  const handleConfirmAddPermissions = () => {
    const newPermissions = (availablePermissions ?? [])
      .filter((p) => selectedPermissionIds.includes(String(p.id)))
      .map((p) => ({
        id: String(p.id),
        name: p.name || `${p.subject}.${p.action}`,
        description: p.description || ''
      }));

    setEditPermissions((current) => {
      const existingIds = new Set(current.map((p) => p.id));
      const filtered = newPermissions.filter((p) => !existingIds.has(p.id));
      return [...current, ...filtered];
    });

    setSelectedPermissionIds([]);
    setOpenPermissionSelectDialog(false);
  };

  const handleAddUsers = (userIds: string[]) => {
    setSelectedUserIds(userIds);
  };

  const handleConfirmAddUsers = () => {
    const newUsers = (availableUsers ?? []).filter((u) => selectedUserIds.includes(u.id));
    setEditUsers((current) => {
      const existingIds = new Set(current.map((u) => u.id));
      const filtered = newUsers.filter((u) => !existingIds.has(u.id));
      return [...current, ...filtered];
    });

    setSelectedUserIds([]);
    setOpenUserSelectDialog(false);
  };

  const handleEditRoleSave = async () => {
    if (!menuRole) {
      return;
    }

    console.log('handleEditRoleSave - Iniciando salvamento do papel:', menuRole.id);
    console.log('handleEditRoleSave - Dados do papel:', { name: editRoleName, description: editRoleDescription });
    console.log('handleEditRoleSave - Permissões:', editPermissions.map(p => p.id));
    console.log('handleEditRoleSave - Usuários:', editUsers.map(u => u.id));

    // 1) Atualiza o papel na API
    console.log('handleEditRoleSave - Chamando updateRole...');
    const { error: updateError } = await updateRole({
      id: String(menuRole.id),
      name: editRoleName.trim() || menuRole.name,
      description: editRoleDescription.trim() || menuRole.description
    });

    if (updateError) {
      console.error('handleEditRoleSave - Erro no updateRole:', updateError);
      openSnackbar({ open: true, message: updateError, variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
      return;
    }
    console.log('handleEditRoleSave - updateRole concluído com sucesso');

    // 2) Atualiza as permissões do papel
    const selectedPermissionIds = editPermissions.map((p) => p.id);
    console.log('handleEditRoleSave - Permissões selecionadas:', selectedPermissionIds);
    console.log('handleEditRoleSave - Chamando assignPermission...');
    const { error: assignError } = await assignPermission({
      roleId: String(menuRole.id),
      permissions: selectedPermissionIds
    });

    if (assignError) {
      console.error('handleEditRoleSave - Erro no assignPermission:', assignError);
      openSnackbar({ open: true, message: assignError, variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
      return;
    }
    console.log('handleEditRoleSave - assignPermission concluído com sucesso');

    // 3) Atualiza os usuários atribuídos ao papel
    const selectedUserIds = editUsers.map((u) => u.id);
    console.log('handleEditRoleSave - Usuários selecionados:', selectedUserIds);
    console.log('handleEditRoleSave - Chamando assignRolesToUser para cada usuário...');
    const results = await Promise.all(
      selectedUserIds.map((userId) =>
        assignRolesToUser({
          userId: String(userId),
          roles: [String(menuRole.id)]
        })
      )
    );

    console.log('handleEditRoleSave - Resultados assignRolesToUser:', results);

    const firstUserError = results.find((r) => r.error)?.error;
    if (firstUserError) {
      console.error('handleEditRoleSave - Erro ao atribuir usuários:', results);
      openSnackbar({ open: true, message: firstUserError || 'Erro ao atribuir usuários', variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
      return;
    }
    console.log('handleEditRoleSave - assignRolesToUser concluído com sucesso');

    openSnackbar({
      open: true,
      message: 'Papel atualizado com sucesso!',
      variant: 'alert',
      severity: 'success',
      alert: { color: 'success' }
    } as never);

    // Invalida o cache do SWR para forçar recarregamento
    await mutate('/api/rbac/roles');
    await mutate('/api/rbac/permissions');

    // Recarrega os dados
    await reloadData();

    setOpenEditRoleDialog(false);
    setMenuRole(null);
  };

  /*************************** DELETE ROLE ***************************/

  const handleDeleteRoleOpen = () => {
    handleMenuClose();
    setOpenDeleteRoleDialog(true);
  };

  const handleDeleteRoleClose = () => {
    setOpenDeleteRoleDialog(false);
  };

  const handleDeleteRoleConfirm = async () => {
    if (!menuRole) {
      return;
    }

    const { error } = await deleteRole(menuRole.id);

    if (error) {
      openSnackbar({ open: true, message: error, variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
    } else {
      openSnackbar({
        open: true,
        message: 'Papel excluído com sucesso!',
        variant: 'alert',
        severity: 'success',
        alert: { color: 'success' }
      } as never);

      // Invalida o cache do SWR para forçar recarregamento
      await mutate('/api/rbac/roles');
      await mutate('/api/rbac/permissions');

      await reloadData();
    }

    setOpenDeleteRoleDialog(false);
    setMenuRole(null);
  };

  /*************************** PERMISSION MENU ***************************/

  const handlePermissionMenuOpen = (event: React.MouseEvent<HTMLElement>, permission: PermissionRow) => {
    setPermissionMenuAnchorEl(event.currentTarget);

    setMenuPermission(permission);
  };

  const handlePermissionMenuClose = () => {
    setPermissionMenuAnchorEl(null);
  };

  /*************************** EDIT PERMISSION ***************************/

  const handleEditPermissionOpen = () => {
    if (!menuPermission) {
      return;
    }

    // Prepara os dados no formato esperado pelo CreatePermissionDialog
    const permissionData: PermissionData = {
      id: menuPermission.id,
      name: menuPermission.action, // Usando action como nome para compatibilidade
      target: menuPermission.subject, // Subject é o alvo
      actions: menuPermission.action.split(', ').filter(Boolean), // Converte action string para array
      description: menuPermission.description,
      roles: menuPermission.roles
    };

    setEditPermissionData(permissionData);

    handlePermissionMenuClose();
    setOpenEditPermissionDialog(true);
  };

  const handleEditPermissionClose = () => {
    setOpenEditPermissionDialog(false);
    setEditPermissionData(null);
  };

  const handleEditPermissionSave = async (data: { name?: string; target: string; actions: string[]; description: string; roles: string[] }) => {
    if (!menuPermission) {
      return;
    }

    console.log('handleEditPermissionSave - Dados recebidos:', data);

    const { error } = await updatePermission({
      id: menuPermission.id,
      name: data.name || menuPermission.action,
      subject: data.target, // target é o subject
      action: data.actions.join(', '), // Junta as ações em uma string
      description: data.description,
      roles: data.roles
    });

    if (error) {
      openSnackbar({ open: true, message: error, variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
    } else {
      openSnackbar({
        open: true,
        message: 'Permissão atualizada com sucesso!',
        variant: 'alert',
        severity: 'success',
        alert: { color: 'success' }
      } as never);

      // Invalida o cache do SWR para forçar recarregamento
      await mutate('/api/rbac/permissions');
      await mutate('/api/rbac/roles');

      await reloadData();
    }

    setOpenEditPermissionDialog(false);
    setMenuPermission(null);
  };

  /*************************** DELETE PERMISSION ***************************/

  const handleDeletePermissionOpen = () => {
    handlePermissionMenuClose();
    setOpenDeletePermissionDialog(true);
  };

  const handleDeletePermissionClose = () => {
    setOpenDeletePermissionDialog(false);
  };

  const handleDeletePermissionConfirm = async () => {
    if (!menuPermission) {
      return;
    }

    const { error } = await deletePermission(menuPermission.id);

    if (error) {
      openSnackbar({ open: true, message: error, variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
    } else {
      openSnackbar({
        open: true,
        message: 'Permissão excluída com sucesso!',
        variant: 'alert',
        severity: 'success',
        alert: { color: 'success' }
      } as never);

      // Invalida o cache do SWR para forçar recarregamento
      await mutate('/api/rbac/permissions');
      await mutate('/api/rbac/roles');

      await reloadData();
    }

    setOpenDeletePermissionDialog(false);
    setMenuPermission(null);
  };

  /*************************** CREATE ROLE ***************************/

  const handleCreateRole = async (_data: CreateRoleData) => {
    // O papel já foi persistido no backend pelo CreateRoleDialog.
    // Aqui apenas recarregamos a lista e fechamos o modal.

    // Invalida o cache do SWR para forçar recarregamento
    await mutate('/api/rbac/roles');
    await mutate('/api/rbac/permissions');

    await reloadData();
    setRolesPage(1);
    setOpenCreateRoleDialog(false);
  };

  /*************************** CREATE PERMISSION ***************************/

  const handleCreatePermission = async (data: CreatePermissionData) => {
    const subject = data.target || data.name || '';
    const actions = data.actions && data.actions.length > 0 ? data.actions : data.action ? [data.action] : [];

    if (!subject || actions.length === 0) {
      setOpenCreatePermissionDialog(false);
      return;
    }

    // O backend modela cada permissão como um par subject + action.
    // Quando várias ações são selecionadas, criamos uma permissão para cada.
    const results = await Promise.all(
      actions.map((action) =>
        createPermission({
          subject,
          action,
          description: data.description || ''
        })
      )
    );

    const firstError = results.find((r) => r.error)?.error;

    if (firstError) {
      openSnackbar({ open: true, message: firstError, variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
    } else {
      openSnackbar({
        open: true,
        message: 'Permissão criada com sucesso!',
        variant: 'alert',
        severity: 'success',
        alert: { color: 'success' }
      } as never);

      // Invalida o cache do SWR para forçar recarregamento
      await mutate('/api/rbac/permissions');
      await mutate('/api/rbac/roles');

      await reloadData();
    }

    setPermissionsPage(1);
    setOpenCreatePermissionDialog(false);
  };

  /*************************** RENDER ***************************/

  return (
    <Stack sx={{ gap: 2.5 }}>
      {/* CABEÇALHO */}

      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
          minHeight: 40
        }}
      >
        <Typography
          variant="h5"
          sx={{
            lineHeight: '40px'
          }}
        >
          Papéis e Permissões
        </Typography>

        {tab !== 2 && (
          <Button
            variant="contained"
            startIcon={<IconPlus size={16} />}
            onClick={handleAddClick}
            sx={{
              minWidth: 150,
              height: 40,
              mt: 0
            }}
          >
            {addButtonLabel}
          </Button>
        )}

        {tab === 2 && (
          <Button
            variant="contained"
            startIcon={<IconPlus size={16} />}
            onClick={() => setOpenCreateDialog(true)}
            sx={{
              minWidth: 150,
              height: 40,
              mt: 0
            }}
          >
            Adicionar Novo
          </Button>
        )}
      </Stack>

      <Card
        sx={{
          p: 0,
          overflow: 'hidden'
        }}
      >
        {/* ABAS */}

        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{
            px: 2,
            pt: 1
          }}
        >
          <Tab label="Papéis" />
          <Tab label="Permissões" />
          <Tab label="Usuários do Sistema" />
        </Tabs>

        {/* PESQUISA / FILTRO */}

        {tab !== 2 && (
          <>
            <Stack
              direction="row"
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2
              }}
            >
              <OutlinedInput
                size="small"
                placeholder="Pesquise aqui"
                value={search}
                onChange={handleSearchChange}
                startAdornment={
                  <InputAdornment position="start">
                    <IconSearch size={16} />
                  </InputAdornment>
                }
                endAdornment={
                  search && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSearch('');
                          setRolesPage(1);
                          setPermissionsPage(1);
                        }}
                        sx={{ p: 0.5 }}
                      >
                        <IconX size={14} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
                sx={{
                  width: 300,
                  height: 40
                }}
              />

              <Button
                variant="outlined"
                color="secondary"
                startIcon={<IconFilter size={16} />}
                onClick={handleFilterOpen}
                sx={{
                  minWidth: 108,
                  height: 40
                }}
              >
                Filtrar
              </Button>
            </Stack>

            {/* FILTROS ATIVOS */}
            {hasActiveFilters && (
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 2,
                  pb: 2,
                  pt: 0
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    gap: 0.75,
                    flexWrap: 'wrap',
                    flex: 1
                  }}
                >
                  {search.trim() !== '' && (
                    <Chip
                      label={`Busca: "${search}"`}
                      size="small"
                      onDelete={() => {
                        setSearch('');
                        setRolesPage(1);
                        setPermissionsPage(1);
                      }}
                      sx={{
                        height: 28,
                        fontSize: 13
                      }}
                    />
                  )}

                  {appliedPermissionFilters.map((filter) => (
                    <Chip
                      key={filter}
                      label={filter}
                      size="small"
                      onDelete={() => handleRemoveIndividualFilter(filter, 'permission')}
                      sx={{
                        height: 28,
                        fontSize: 13
                      }}
                    />
                  ))}

                  {appliedRoleFilters.map((filter) => (
                    <Chip
                      key={filter}
                      label={filter}
                      size="small"
                      onDelete={() => handleRemoveIndividualFilter(filter, 'role')}
                      sx={{
                        height: 28,
                        fontSize: 13
                      }}
                    />
                  ))}
                </Stack>

                <Button
                  variant="text"
                  size="small"
                  onClick={handleClearAllFilters}
                  sx={{
                    ml: 1,
                    fontSize: 13,
                    color: 'text.secondary'
                  }}
                >
                  Limpar tudo
                </Button>
              </Stack>
            )}
          </>
        )}

        {/* ===================================================== */}
        {/* ABA PAPÉIS                                           */}
        {/* ===================================================== */}

        {tab === 0 && (
          <>
            <TableContainer
              sx={{
                overflowX: 'auto'
              }}
            >
              <Table
                sx={{
                  tableLayout: 'fixed',
                  minWidth: 900
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ width: 52 }}>
                      <Checkbox />
                    </TableCell>

                    <TableCell sx={{ width: '16%' }}>Papel</TableCell>

                    <TableCell sx={{ width: '38%' }}>Descrição</TableCell>

                    <TableCell sx={{ width: '20%' }}>Usuário atribuído</TableCell>

                    <TableCell sx={{ width: '10%' }}>Permissão</TableCell>

                    <TableCell align="right" sx={{ width: 60 }} />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedRoles.map((role) => (
                    <TableRow key={role.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>

                      <TableCell sx={{ overflow: 'hidden' }}>
                        <Typography variant="subtitle2" noWrap>
                          {role.name}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ overflow: 'hidden' }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={role.description}
                        >
                          {role.description}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack
                          direction="row"
                          sx={{
                            alignItems: 'center',
                            gap: 1,
                            minWidth: 0
                          }}
                        >
                          <AvatarGroup
                            max={4}
                            sx={{
                              '& .MuiAvatar-root': {
                                width: 28,
                                height: 28,
                                fontSize: 12
                              }
                            }}
                          >
                            {role.assignedUsers.map((initial, index) => (
                              <Avatar key={index}>{initial}</Avatar>
                            ))}
                          </AvatarGroup>

                          {role.extraUsersCount > 0 && (
                            <Typography variant="caption" color="text.secondary" noWrap>
                              +{role.extraUsersCount}
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {role.permissionCount}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <IconButton size="small" onClick={(event) => handleMenuOpen(event, role)}>
                          <IconDotsVertical size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

                  {paginatedRoles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                          Nenhum papel encontrado.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack
              direction="row"
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Pagination
                count={totalRolePages}
                page={rolesPage}
                onChange={(_, value) => setRolesPage(value)}
                color="primary"
                siblingCount={1}
                boundaryCount={1}
                getItemAriaLabel={(type, page) => {
                  switch (type) {
                    case 'page':
                      return `Ir para página ${page}`;
                    case 'first':
                      return 'Ir para a primeira página';
                    case 'last':
                      return 'Ir para a última página';
                    case 'next':
                      return 'Ir para a próxima página';
                    case 'previous':
                      return 'Ir para a página anterior';
                    default:
                      return '';
                  }
                }}
                renderItem={(item) => {
                  if (item.type === 'previous') {
                    return (
                      <PaginationItem
                        {...item}
                        slots={{
                          previous: () => (
                            <Stack
                              direction="row"
                              sx={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <IconChevronLeft size={16} />
                              <span>Anterior</span>
                            </Stack>
                          )
                        }}
                        sx={{
                          width: 82,
                          minWidth: 82,
                          height: 32,
                          px: 1,
                          borderRadius: 1,
                          fontSize: '14px',
                          flexShrink: 0,
                          '&.Mui-disabled': {
                            opacity: 0.45
                          }
                        }}
                      />
                    );
                  }

                  if (item.type === 'next') {
                    return (
                      <PaginationItem
                        {...item}
                        slots={{
                          next: () => (
                            <Stack
                              direction="row"
                              sx={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <span>Próximo</span>
                              <IconChevronRight size={16} />
                            </Stack>
                          )
                        }}
                        sx={{
                          width: 82,
                          minWidth: 82,
                          height: 32,
                          px: 1,
                          borderRadius: 1,
                          fontSize: '14px',
                          flexShrink: 0,
                          '&.Mui-disabled': {
                            opacity: 0.45
                          }
                        }}
                      />
                    );
                  }

                  return (
                    <PaginationItem
                      {...item}
                      sx={{
                        width: item.type === 'page' ? 32 : 'auto',
                        minWidth: item.type === 'page' ? 32 : 32,
                        height: 32,
                        borderRadius: 1,
                        fontSize: '14px',
                        flexShrink: 0
                      }}
                    />
                  );
                }}
                sx={{
                  '& .MuiPagination-ul': {
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    flexWrap: 'nowrap'
                  }
                }}
              />
            </Stack>
          </>
        )}

        {/* ===================================================== */}
        {/* ABA PERMISSÕES                                       */}
        {/* ===================================================== */}

        {tab === 1 && (
          <>
            <TableContainer
              sx={{
                overflowX: 'auto'
              }}
            >
              <Table
                sx={{
                  tableLayout: 'fixed',
                  minWidth: 1100
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ width: 52 }}>
                      <Checkbox />
                    </TableCell>

                    <TableCell sx={{ width: '12%' }}>Alvo</TableCell>

                    <TableCell sx={{ width: '15%' }}>Ações</TableCell>

                    <TableCell sx={{ width: '38%' }}>Descrição</TableCell>

                    <TableCell sx={{ width: '25%' }}>Papéis</TableCell>

                    <TableCell align="right" sx={{ width: 60 }} />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedPermissions.map((permission) => (
                    <TableRow key={permission.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>

                      <TableCell
                        sx={{
                          overflow: 'hidden'
                        }}
                      >
                        <Typography variant="subtitle2" noWrap>
                          {permission.subject}
                        </Typography>
                      </TableCell>

                      <TableCell
                        sx={{
                          overflow: 'hidden'
                        }}
                      >
                        <Typography variant="subtitle2" noWrap>
                          {permission.action}
                        </Typography>
                      </TableCell>

                      <TableCell
                        sx={{
                          overflow: 'hidden'
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={permission.description}
                        >
                          {permission.description}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack
                          direction="row"
                          sx={{
                            gap: 0.5,
                            flexWrap: 'nowrap',
                            overflow: 'hidden'
                          }}
                        >
                          {permission.roles.map((role) => (
                            <Chip
                              key={role}
                              label={role}
                              size="small"
                              variant="outlined"
                              sx={{
                                flexShrink: 0
                              }}
                            />
                          ))}
                        </Stack>
                      </TableCell>

                      <TableCell align="right">
                        <IconButton size="small" onClick={(event) => handlePermissionMenuOpen(event, permission)}>
                          <IconDotsVertical size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

                  {paginatedPermissions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                          Nenhuma permissão encontrada.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack
              direction="row"
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Pagination
                count={totalPermissionPages}
                page={permissionsPage}
                onChange={(_, value) => setPermissionsPage(value)}
                color="primary"
                siblingCount={1}
                boundaryCount={1}
                getItemAriaLabel={(type, page) => {
                  switch (type) {
                    case 'page':
                      return `Ir para página ${page}`;
                    case 'first':
                      return 'Ir para a primeira página';
                    case 'last':
                      return 'Ir para a última página';
                    case 'next':
                      return 'Ir para a próxima página';
                    case 'previous':
                      return 'Ir para a página anterior';
                    default:
                      return '';
                  }
                }}
                renderItem={(item) => {
                  if (item.type === 'previous') {
                    return (
                      <PaginationItem
                        {...item}
                        slots={{
                          previous: () => (
                            <Stack
                              direction="row"
                              sx={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <IconChevronLeft size={16} />
                              <span>Anterior</span>
                            </Stack>
                          )
                        }}
                        sx={{
                          width: 82,
                          minWidth: 82,
                          height: 32,
                          px: 1,
                          borderRadius: 1,
                          fontSize: '14px',
                          flexShrink: 0,
                          '&.Mui-disabled': {
                            opacity: 0.45
                          }
                        }}
                      />
                    );
                  }

                  if (item.type === 'next') {
                    return (
                      <PaginationItem
                        {...item}
                        slots={{
                          next: () => (
                            <Stack
                              direction="row"
                              sx={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <span>Próximo</span>
                              <IconChevronRight size={16} />
                            </Stack>
                          )
                        }}
                        sx={{
                          width: 82,
                          minWidth: 82,
                          height: 32,
                          px: 1,
                          borderRadius: 1,
                          fontSize: '14px',
                          flexShrink: 0,
                          '&.Mui-disabled': {
                            opacity: 0.45
                          }
                        }}
                      />
                    );
                  }

                  return (
                    <PaginationItem
                      {...item}
                      sx={{
                        width: item.type === 'page' ? 32 : 'auto',
                        minWidth: item.type === 'page' ? 32 : 32,
                        height: 32,
                        borderRadius: 1,
                        fontSize: '14px',
                        flexShrink: 0
                      }}
                    />
                  );
                }}
                sx={{
                  '& .MuiPagination-ul': {
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    flexWrap: 'nowrap'
                  }
                }}
              />
            </Stack>
          </>
        )}

        {/* ===================================================== */}
        {/* ABA USUÁRIOS                                         */}
        {/* ===================================================== */}

        {tab === 2 && (
          <Stack sx={{ p: 2 }}>
            <UsersView showCreateButton={false} />
          </Stack>
        )}
      </Card>

      {/* ===================================================== */}
      {/* FILTRO                                                */}
      {/* ===================================================== */}

      <Dialog
        open={openFilterDialog}
        onClose={handleFilterClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 400,
            maxWidth: 'calc(100vw - 32px)',
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 2
          }}
        >
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 500
            }}
          >
            Filtro
          </Typography>

          <IconButton
            onClick={handleFilterClose}
            sx={{
              width: 46,
              height: 46,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <IconX size={19} />
          </IconButton>
        </Stack>

        <Divider />

        {/* FILTRO DE PAPÉIS */}

        {tab === 0 && (
          <>
            <Box
              sx={{
                px: 2.5,
                pt: 2.5,
                pb: 1
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Permissão
                </Typography>

                <Chip
                  size="small"
                  label={`${selectedFilterPermissions.length} ${selectedFilterPermissions.length === 1 ? 'Permissão' : 'Permissões'}`}
                  variant="outlined"
                />
              </Stack>
            </Box>

            <Box
              sx={{
                px: 1.5,
                pb: 1
              }}
            >
              <OutlinedInput
                fullWidth
                size="small"
                placeholder="Pesquisar permissão"
                value={permissionFilterSearch}
                onChange={(event) => setPermissionFilterSearch(event.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <IconSearch size={18} />
                  </InputAdornment>
                }
              />
            </Box>

            <Box
              sx={{
                px: 1,
                maxHeight: 290,
                overflowY: 'auto'
              }}
            >
              {filteredPermissionOptions.map((permission) => (
                <Box
                  key={permission}
                  onClick={() => handleTogglePermissionFilter(permission)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.35,
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Checkbox checked={selectedFilterPermissions.includes(permission)} size="small" />

                  <Typography variant="body2" sx={{ fontSize: 16 }}>
                    {permission}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* FILTRO DE PERMISSÕES */}

        {tab === 1 && (
          <>
            <Box
              sx={{
                px: 2.5,
                pt: 2.5,
                pb: 1
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Papéis
                </Typography>

                <Chip
                  size="small"
                  label={`${selectedFilterRoles.length} ${selectedFilterRoles.length === 1 ? 'Papel' : 'Papéis'}`}
                  variant="outlined"
                />
              </Stack>
            </Box>

            <Box
              sx={{
                px: 1.5,
                pb: 1
              }}
            >
              <OutlinedInput
                fullWidth
                size="small"
                placeholder="Pesquisar papel"
                value={roleFilterSearch}
                onChange={(event) => setRoleFilterSearch(event.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <IconSearch size={18} />
                  </InputAdornment>
                }
              />
            </Box>

            <Box
              sx={{
                px: 1,
                maxHeight: 290,
                overflowY: 'auto'
              }}
            >
              {filteredRoleOptions.map((role) => (
                <Box
                  key={role}
                  onClick={() => handleToggleRoleFilter(role)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.35,
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Checkbox checked={selectedFilterRoles.includes(role)} size="small" />

                  <Typography variant="body2" sx={{ fontSize: 16 }}>
                    {role}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}

        <Divider sx={{ mt: 1 }} />

        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2.5,
            py: 2
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleResetFilter}
            sx={{
              minWidth: 80,
              height: 44
            }}
          >
            Limpar
          </Button>

          <Button
            variant="contained"
            onClick={handleApplyFilter}
            sx={{
              minWidth: 130,
              height: 44
            }}
          >
            Aplicar
          </Button>
        </Stack>
      </Dialog>

      {/* ===================================================== */}
      {/* MENU PAPÉIS                                           */}
      {/* ===================================================== */}

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: 185,
              borderRadius: 2,
              boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden'
            }
          }
        }}
      >
        <MenuItem
          onClick={handleEditRoleOpen}
          sx={{
            gap: 1.5,
            py: 1.25,
            px: 2
          }}
        >
          <IconEdit size={18} />

          <Typography variant="body2">Editar</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleDeleteRoleOpen}
          sx={{
            gap: 1.5,
            py: 1.25,
            px: 2,
            color: 'error.main'
          }}
        >
          <IconTrash size={18} />

          <Typography variant="body2">Deletar</Typography>
        </MenuItem>
      </Menu>

      {/* ===================================================== */}
      {/* MENU PERMISSÕES                                       */}
      {/* ===================================================== */}

      <Menu
        anchorEl={permissionMenuAnchorEl}
        open={Boolean(permissionMenuAnchorEl)}
        onClose={handlePermissionMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: 185,
              borderRadius: 2,
              boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden'
            }
          }
        }}
      >
        <MenuItem
          onClick={handleEditPermissionOpen}
          sx={{
            gap: 1.5,
            py: 1.25,
            px: 2
          }}
        >
          <IconEdit size={18} />

          <Typography variant="body2">Editar</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleDeletePermissionOpen}
          sx={{
            gap: 1.5,
            py: 1.25,
            px: 2,
            color: 'error.main'
          }}
        >
          <IconTrash size={18} />

          <Typography variant="body2">Deletar</Typography>
        </MenuItem>
      </Menu>

      {/* ===================================================== */}
      {/* MODAL EDITAR PAPEL                                    */}
      {/* ===================================================== */}

      <Dialog
        open={openEditRoleDialog}
        onClose={handleEditRoleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: 'calc(100vh - 32px)'
          }
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            px: 3,
            pt: 3
          }}
        >
          <Box>
            <DialogTitle
              sx={{
                p: 0,
                fontSize: 18,
                fontWeight: 600
              }}
            >
              Editar Papel
            </DialogTitle>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Edite as informações, permissões e usuários atribuídos a este papel.
            </Typography>
          </Box>

          <IconButton onClick={handleEditRoleClose} size="small">
            <IconX size={18} />
          </IconButton>
        </Stack>

        <Divider sx={{ mt: 2 }} />

        <DialogContent
          sx={{
            px: 2.5,
            py: 2.5,
            overflowY: 'auto'
          }}
        >
          <Stack sx={{ gap: 2.5 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.75,
                  fontWeight: 500
                }}
              >
                Nome do papel
              </Typography>

              <OutlinedInput value={editRoleName} onChange={(event) => setEditRoleName(event.target.value)} fullWidth />
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.75,
                  fontWeight: 500
                }}
              >
                Descrição
              </Typography>

              <TextField
                value={editRoleDescription}
                onChange={(event) => setEditRoleDescription(event.target.value)}
                fullWidth
                multiline
                minRows={3}
              />
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 500
                }}
              >
                Permissões{' '}
                <Typography component="span" variant="body2" color="text.secondary">
                  (Opcional)
                </Typography>
              </Typography>

              <Stack sx={{ gap: 1 }}>
                {editPermissions.map((permission) => (
                  <Stack
                    key={permission.id}
                    direction="row"
                    sx={{
                      alignItems: 'center',
                      gap: 1.25,
                      minHeight: 58,
                      px: 1,
                      py: 0.75,
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1.5,
                        bgcolor: 'primary.lighter',
                        color: 'primary.main'
                      }}
                    >
                      <IconShield size={20} />
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          lineHeight: 1.4
                        }}
                      >
                        {permission.name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4
                        }}
                      >
                        {permission.description}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={() => handleRemovePermission(permission.id)}
                      sx={{
                        width: 40,
                        height: 40,
                        color: 'error.main',
                        border: '1px solid',
                        borderColor: 'error.lighter',
                        borderRadius: 1.5,
                        flexShrink: 0
                      }}
                    >
                      <IconTrash size={17} />
                    </IconButton>
                  </Stack>
                ))}

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<IconPlus size={17} />}
                  onClick={() => setOpenPermissionSelectDialog(true)}
                  sx={{
                    height: 44,
                    mt: 0.5
                  }}
                >
                  Atribuir Permissões
                </Button>
              </Stack>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 500
                }}
              >
                Usuários{' '}
                <Typography component="span" variant="body2" color="text.secondary">
                  (Opcional)
                </Typography>
              </Typography>

              <Stack sx={{ gap: 1 }}>
                {editUsers.map((user) => (
                  <Stack
                    key={user.id}
                    direction="row"
                    sx={{
                      alignItems: 'center',
                      gap: 1.25,
                      minHeight: 58,
                      px: 1,
                      py: 0.75,
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1.5,
                        bgcolor: 'primary.lighter',
                        color: 'primary.main'
                      }}
                    >
                      <IconUser size={20} />
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          lineHeight: 1.4
                        }}
                      >
                        {user.name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4
                        }}
                      >
                        {user.username}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={() => handleRemoveUser(user.id)}
                      sx={{
                        width: 40,
                        height: 40,
                        color: 'error.main',
                        border: '1px solid',
                        borderColor: 'error.lighter',
                        borderRadius: 1.5,
                        flexShrink: 0
                      }}
                    >
                      <IconTrash size={17} />
                    </IconButton>
                  </Stack>
                ))}

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<IconPlus size={17} />}
                  onClick={() => setOpenUserSelectDialog(true)}
                  sx={{
                    height: 44,
                    mt: 0.5
                  }}
                >
                  Atribuir Usuários
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            justifyContent: 'flex-end',
            gap: 1
          }}
        >
          <Button variant="outlined" color="secondary" onClick={handleEditRoleClose}>
            Cancelar
          </Button>

          <Button variant="contained" onClick={handleEditRoleSave}>
            Atualizar Papel
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================== */}
      {/* MODAL DELETAR PAPEL                                  */}
      {/* ===================================================== */}

      <Dialog
        open={openDeleteRoleDialog}
        onClose={handleDeleteRoleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 24,
            fontWeight: 600,
            px: 3,
            py: 2.5
          }}
        >
          Deletar papel
          <IconButton size="small" onClick={handleDeleteRoleClose}>
            <IconX size={18} />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent
          sx={{
            px: 3,
            py: 4
          }}
        >
          <Stack
            sx={{
              alignItems: 'center',
              textAlign: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                width: 180,
                height: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                bgcolor: 'grey.50',
                color: 'error.main'
              }}
            >
              <IconTrash size={72} stroke={1.2} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Tem certeza que deseja deletar?
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
              {menuRole ? (
                <>
                  Ao deletar o papel{' '}
                  <Typography component="span" color="primary.main" fontWeight={500}>
                    {menuRole.name}
                  </Typography>
                  , todas as permissões e associações relacionadas a ele serão removidas.
                  <br />
                  <br />
                  Tenha cuidado com esta ação, pois ela não poderá ser desfeita.
                </>
              ) : (
                'Esta ação não poderá ser desfeita.'
              )}
            </Typography>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{
            justifyContent: 'space-between',
            px: 3,
            py: 2
          }}
        >
          <Button variant="outlined" onClick={handleDeleteRoleClose}>
            Cancelar
          </Button>

          <Button variant="contained" color="error" startIcon={<IconTrash size={18} />} onClick={handleDeleteRoleConfirm}>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================== */}
      {/* MODAL EDITAR PERMISSÃO                               */}
      {/* ===================================================== */}

      <CreatePermissionDialog
        open={openEditPermissionDialog}
        onClose={handleEditPermissionClose}
        permission={editPermissionData}
        onUpdate={handleEditPermissionSave}
      />

      {/* ===================================================== */}
      {/* MODAL DELETAR PERMISSÃO                              */}
      {/* ===================================================== */}

      <Dialog
        open={openDeletePermissionDialog}
        onClose={handleDeletePermissionClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 24,
            fontWeight: 600,
            px: 3,
            py: 2.5
          }}
        >
          Deletar permissão
          <IconButton size="small" onClick={handleDeletePermissionClose}>
            <IconX size={18} />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent
          sx={{
            px: 3,
            py: 4
          }}
        >
          <Stack
            sx={{
              alignItems: 'center',
              textAlign: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                width: 180,
                height: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                bgcolor: 'grey.50',
                color: 'error.main'
              }}
            >
              <IconTrash size={72} stroke={1.2} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Tem certeza que deseja deletar?
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
              {menuPermission ? (
                <>
                  Ao deletar a permissão{' '}
                  <Typography component="span" color="primary.main" fontWeight={500}>
                    {menuPermission.action}
                  </Typography>
                  , todas as associações relacionadas a ela serão removidas.
                  <br />
                  <br />
                  Tenha cuidado com esta ação, pois ela não poderá ser desfeita.
                </>
              ) : (
                'Esta ação não poderá ser desfeita.'
              )}
            </Typography>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{
            justifyContent: 'space-between',
            px: 3,
            py: 2
          }}
        >
          <Button variant="outlined" onClick={handleDeletePermissionClose}>
            Cancelar
          </Button>

          <Button variant="contained" color="error" startIcon={<IconTrash size={18} />} onClick={handleDeletePermissionConfirm}>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================== */}
      {/* MODAL CRIAR PAPEL                                    */}
      {/* ===================================================== */}

      <CreateRoleDialog open={openCreateRoleDialog} onClose={() => setOpenCreateRoleDialog(false)} onCreate={handleCreateRole} />

      {/* ===================================================== */}
      {/* MODAL SELECIONAR PERMISSÕES                          */}
      {/* ===================================================== */}

      <Dialog
        open={openPermissionSelectDialog}
        onClose={() => {
          setOpenPermissionSelectDialog(false);
          setSelectedPermissionIds([]);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle>Selecionar Permissões</DialogTitle>
        <Divider />
        <DialogContent>
          {permissionsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : permissionsError ? (
            <Typography color="error" sx={{ py: 4 }}>
              Erro ao carregar permissões
            </Typography>
          ) : (
            <Autocomplete
              multiple
              options={availablePermissions?.map((p) => String(p.id)) || []}
              getOptionLabel={(id) => {
                const perm = availablePermissions?.find((p) => String(p.id) === id);
                return perm?.name || `${perm?.subject}.${perm?.action}` || id;
              }}
              value={selectedPermissionIds}
              onChange={(_event, value) => handleAddPermissions(value)}
              disableCloseOnSelect
              renderOption={(props, option, { selected }) => {
                const perm = availablePermissions?.find((p) => String(p.id) === option);
                return (
                  <li {...props}>
                    <Checkbox checked={selected} size="small" sx={{ mr: 1 }} />
                    {perm?.name || `${perm?.subject}.${perm?.action}` || option}
                  </li>
                );
              }}
              renderInput={(params) => <TextField {...params} placeholder="Buscar permissões" fullWidth sx={{ mt: 2 }} />}
            />
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setOpenPermissionSelectDialog(false);
              setSelectedPermissionIds([]);
            }}
          >
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleConfirmAddPermissions}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================== */}
      {/* MODAL SELECIONAR USUÁRIOS                             */}
      {/* ===================================================== */}

      <Dialog
        open={openUserSelectDialog}
        onClose={() => {
          setOpenUserSelectDialog(false);
          setSelectedUserIds([]);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle>Selecionar Usuários</DialogTitle>
        <Divider />
        <DialogContent>
          {usersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Autocomplete
              multiple
              options={availableUsers?.map((u) => u.id) || []}
              getOptionLabel={(id) => {
                const user = availableUsers?.find((u) => u.id === id);
                return user?.name || id;
              }}
              value={selectedUserIds}
              onChange={(_event, value) => handleAddUsers(value)}
              disableCloseOnSelect
              renderOption={(props, option, { selected }) => {
                const user = availableUsers?.find((u) => u.id === option);
                return (
                  <li {...props}>
                    <Checkbox checked={selected} size="small" sx={{ mr: 1 }} />
                    {user?.name || option}
                  </li>
                );
              }}
              renderInput={(params) => <TextField {...params} placeholder="Buscar usuários" fullWidth sx={{ mt: 2 }} />}
            />
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setOpenUserSelectDialog(false);
              setSelectedUserIds([]);
            }}
          >
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleConfirmAddUsers}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================== */}
      {/* MODAL CRIAR PERMISSÃO                                */}
      {/* ===================================================== */}

      <CreatePermissionDialog
        open={openCreatePermissionDialog}
        onClose={() => setOpenCreatePermissionDialog(false)}
        onCreate={handleCreatePermission}
      />

      {/* ===================================================== */}
      {/* MODAL CRIAR USUÁRIO                                   */}
      {/* ===================================================== */}

      <CreateUserDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreate={(data) => {
          // O usuário já foi persistido no backend (POST /api/users) pelo diálogo.
          console.log('Usuário criado:', data);
        }}
      />
    </Stack>
  );
}
