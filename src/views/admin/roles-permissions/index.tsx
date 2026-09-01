'use client';

import { useState, SyntheticEvent } from 'react';

// @mui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
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
  IconUsers,
  IconX
} from '@tabler/icons-react';

// @project
import UsersView from '@/views/admin/users';
import CreateUserDialog from '@/sections/users/CreateUserDialog';
import CreatePermissionDialog from '@/sections/permissions/CreatePermissionDialog';
import CreateRoleDialog from '@/sections/roles/CreateRoleDialog';

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
    description:
      'Permite aos usuários remover permanentemente registros da conta, incluindo os dados associados.'
  },
  {
    id: 'account.view',
    name: 'account.view',
    description:
      'Permite aos usuários visualizar detalhes da conta, informações do perfil e registros de atividade.'
  },
  {
    id: 'account.update',
    name: 'account.update',
    description:
      'Permite aos usuários modificar informações da conta, como dados de contato e preferências.'
  },
  {
    id: 'account.edit',
    name: 'account.edit',
    description:
      'Permite aos usuários editar registros existentes da conta e atualizar campos específicos.'
  },
  {
    id: 'account.user',
    name: 'account.user',
    description:
      'Permite aos usuários gerenciar contas de usuários, incluindo criação e atribuição de papéis.'
  },
  {
    id: 'invoice.create',
    name: 'invoice.create',
    description:
      'Permite aos usuários criar e gerar novas faturas para cobranças e transações.'
  },
  {
    id: 'invoice.view',
    name: 'invoice.view',
    description:
      'Permite aos usuários visualizar faturas atuais e históricas, incluindo o status dos pagamentos.'
  },
  {
    id: 'invoice.delete',
    name: 'invoice.delete',
    description:
      'Permite aos usuários excluir faturas do sistema quando possuem autorização.'
  },
  {
    id: 'invoice.send',
    name: 'invoice.send',
    description:
      'Permite aos usuários enviar faturas geradas para clientes ou responsáveis por e-mail.'
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
    description:
      'Responsável por gerenciar as atividades e permissões relacionadas à função de Super Admin.',
    assignedUsers: ['A', 'B', 'C', 'D'],
    extraUsersCount: 2,
    permissionCount: 32,
    permissions: mockPermissionsForRole,
    users: [mockAssignedUsers[0]]
  },
  {
    id: '2',
    name: 'Gestor',
    description:
      'Responsável por gerenciar as atividades e permissões relacionadas à função de Gestor.',
    assignedUsers: ['A', 'B', 'C', 'D'],
    extraUsersCount: 2,
    permissionCount: 24,
    permissions: mockPermissionsForRole.slice(0, 6),
    users: [mockAssignedUsers[1]]
  },
  {
    id: '3',
    name: 'Gerente',
    description:
      'Responsável por gerenciar as atividades e permissões relacionadas à função de Gerente.',
    assignedUsers: ['A', 'B', 'C', 'D'],
    extraUsersCount: 2,
    permissionCount: 23,
    permissions: mockPermissionsForRole.slice(0, 5),
    users: [mockAssignedUsers[2]]
  },
  {
    id: '4',
    name: 'Atendente',
    description:
      'Responsável por gerenciar as atividades e permissões relacionadas à função de Atendente.',
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
    action: 'account.delete',
    description:
      'Permite aos usuários remover permanentemente registros da conta, incluindo os dados associados.',
    roles: ['Super Admin', 'Admin']
  },
  {
    id: '2',
    action: 'account.view',
    description:
      'Permite aos usuários visualizar detalhes da conta, informações do perfil e registros de atividade.',
    roles: ['Gestor', 'Admin']
  },
  {
    id: '3',
    action: 'account.update',
    description:
      'Permite aos usuários modificar informações da conta, como dados de contato e preferências.',
    roles: ['Product Designer']
  },
  {
    id: '4',
    action: 'account.edit',
    description:
      'Permite aos usuários editar registros existentes da conta e atualizar campos específicos.',
    roles: ['Developers', 'Tester']
  },
  {
    id: '5',
    action: 'account.user',
    description:
      'Permite aos usuários gerenciar contas de usuários, incluindo criação e atribuição de papéis.',
    roles: ['Super Admin', 'Admin']
  }
];

/*************************** FILTER DATA ***************************/

const filterPermissions = [
  'account.delete',
  'account.view',
  'account.update',
  'account.edit',
  'account.user'
];

const filterRoles = [
  'Super Admin',
  'Billing Admin',
  'Admin',
  'Developer',
  'Product Designer'
];

/*************************** VIEW ***************************/

export default function RolesPermissionsView() {
  const [tab, setTab] = useState(0);

  const [rolesPage, setRolesPage] = useState(1);
  const [permissionsPage, setPermissionsPage] = useState(1);

  // Mantém a paginação com o mesmo padrão visual do Figma.
  // Os dados reais podem ultrapassar 10 páginas quando conectados à API.
  const rowsPerPage = 10;
  const minimumPages = 10;

  const [roles, setRoles] = useState<RoleRow[]>(mockRoles);
  const [permissions, setPermissions] =
    useState<PermissionRow[]>(mockPermissions);

  /*************************** SEARCH ***************************/

  const [search, setSearch] = useState('');

  /*************************** CREATE ***************************/

  const [openCreateRoleDialog, setOpenCreateRoleDialog] =
    useState(false);

  const [openCreatePermissionDialog, setOpenCreatePermissionDialog] =
    useState(false);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  /*************************** ROLE MENU ***************************/

  const [menuAnchorEl, setMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const [menuRole, setMenuRole] =
    useState<RoleRow | null>(null);

  /*************************** PERMISSION MENU ***************************/

  const [permissionMenuAnchorEl, setPermissionMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const [menuPermission, setMenuPermission] =
    useState<PermissionRow | null>(null);

  /*************************** EDIT ROLE ***************************/

  const [openEditRoleDialog, setOpenEditRoleDialog] =
    useState(false);

  const [editRoleName, setEditRoleName] = useState('');

  const [editRoleDescription, setEditRoleDescription] =
    useState('');

  const [editPermissions, setEditPermissions] =
    useState<PermissionItem[]>([]);

  const [editUsers, setEditUsers] =
    useState<AssignedUser[]>([]);

  /*************************** DELETE ROLE ***************************/

  const [openDeleteRoleDialog, setOpenDeleteRoleDialog] =
    useState(false);

  /*************************** EDIT PERMISSION ***************************/

  const [openEditPermissionDialog, setOpenEditPermissionDialog] =
    useState(false);

  const [editPermissionAction, setEditPermissionAction] =
    useState('');

  const [editPermissionDescription, setEditPermissionDescription] =
    useState('');

  const [editPermissionRoles, setEditPermissionRoles] =
    useState<string[]>([]);

  /*************************** DELETE PERMISSION ***************************/

  const [openDeletePermissionDialog, setOpenDeletePermissionDialog] =
    useState(false);

  /*************************** FILTER ***************************/

  const [openFilterDialog, setOpenFilterDialog] =
    useState(false);

  const [permissionFilterSearch, setPermissionFilterSearch] =
    useState('');

  const [roleFilterSearch, setRoleFilterSearch] =
    useState('');

  const [selectedFilterPermissions, setSelectedFilterPermissions] =
    useState<string[]>([]);

  const [selectedFilterRoles, setSelectedFilterRoles] =
    useState<string[]>([]);

  const [appliedPermissionFilters, setAppliedPermissionFilters] =
    useState<string[]>([]);

  const [appliedRoleFilters, setAppliedRoleFilters] =
    useState<string[]>([]);

  /*************************** TAB ***************************/

  const handleTabChange = (
    _event: SyntheticEvent,
    value: number
  ) => {
    setTab(value);
    setSearch('');
    setRolesPage(1);
    setPermissionsPage(1);
  };

  const addButtonLabel =
    tab === 0 ? 'Novo Papel' : 'Nova Permissão';

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

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    setSelectedFilterPermissions(
      appliedPermissionFilters
    );

    setSelectedFilterRoles(
      appliedRoleFilters
    );

    setOpenFilterDialog(true);
  };

  const handleFilterClose = () => {
    setOpenFilterDialog(false);
  };

  const handleTogglePermissionFilter = (
    permission: string
  ) => {
    setSelectedFilterPermissions((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission]
    );
  };

  const handleToggleRoleFilter = (
    role: string
  ) => {
    setSelectedFilterRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role]
    );
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

  const handleRemoveIndividualFilter = (
    filter: string,
    type: 'permission' | 'role'
  ) => {
    if (type === 'permission') {
      setAppliedPermissionFilters((current) =>
        current.filter((item) => item !== filter)
      );
    } else {
      setAppliedRoleFilters((current) =>
        current.filter((item) => item !== filter)
      );
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

  const hasActiveFilters =
    search.trim() !== '' ||
    appliedPermissionFilters.length > 0 ||
    appliedRoleFilters.length > 0;

  const handleApplyFilter = () => {
    setAppliedPermissionFilters(
      selectedFilterPermissions
    );

    setAppliedRoleFilters(
      selectedFilterRoles
    );

    setRolesPage(1);
    setPermissionsPage(1);
    setOpenFilterDialog(false);
  };

  const filteredPermissionOptions =
    filterPermissions.filter((permission) =>
      permission
        .toLowerCase()
        .includes(permissionFilterSearch.toLowerCase())
    );

  const filteredRoleOptions =
    filterRoles.filter((role) =>
      role
        .toLowerCase()
        .includes(roleFilterSearch.toLowerCase())
    );

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

    return appliedPermissionFilters.some((permission) =>
      role.permissions.some(
        (item) => item.id === permission
      )
    );
  });

  /*************************** VISIBLE PERMISSIONS ***************************/

  const visiblePermissions = permissions.filter(
    (permission) => {
      const normalizedSearch = search.trim().toLowerCase();

      const matchesSearch =
        normalizedSearch === '' ||
        permission.action
          .toLowerCase()
          .includes(normalizedSearch) ||
        permission.description
          .toLowerCase()
          .includes(normalizedSearch);

      if (!matchesSearch) {
        return false;
      }

      if (appliedRoleFilters.length === 0) {
        return true;
      }

      return appliedRoleFilters.some((role) =>
        permission.roles.includes(role)
      );
    }
  );

  /*************************** PAGINAÇÃO ***************************/

  const totalRolePages = Math.max(
    minimumPages,
    Math.ceil(visibleRoles.length / rowsPerPage)
  );

  const totalPermissionPages = Math.max(
    minimumPages,
    Math.ceil(visiblePermissions.length / rowsPerPage)
  );

  const paginatedRoles = visibleRoles.slice(
    (rolesPage - 1) * rowsPerPage,
    rolesPage * rowsPerPage
  );

  const paginatedPermissions = visiblePermissions.slice(
    (permissionsPage - 1) * rowsPerPage,
    permissionsPage * rowsPerPage
  );

  /*************************** ROLE MENU ***************************/

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    role: RoleRow
  ) => {
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

    handleMenuClose();
    setOpenEditRoleDialog(true);
  };

  const handleEditRoleClose = () => {
    setOpenEditRoleDialog(false);
  };

  const handleRemovePermission = (
    permissionId: string
  ) => {
    setEditPermissions((current) =>
      current.filter(
        (permission) => permission.id !== permissionId
      )
    );
  };

  const handleRemoveUser = (
    userId: string
  ) => {
    setEditUsers((current) =>
      current.filter((user) => user.id !== userId)
    );
  };

  const handleEditRoleSave = () => {
    if (!menuRole) {
      return;
    }

    setRoles((current) =>
      current.map((role) =>
        role.id === menuRole.id
          ? {
              ...role,
              name:
                editRoleName.trim() || role.name,
              description:
                editRoleDescription.trim() ||
                role.description,
              permissions: editPermissions,
              permissionCount:
                editPermissions.length,
              users: editUsers,
              assignedUsers:
                editUsers.length > 0
                  ? editUsers.map((user) =>
                      user.name
                        .charAt(0)
                        .toUpperCase()
                    )
                  : [],
              extraUsersCount: 0
            }
          : role
      )
    );

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

  const handleDeleteRoleConfirm = () => {
    if (!menuRole) {
      return;
    }

    setRoles((current) =>
      current.filter(
        (role) => role.id !== menuRole.id
      )
    );

    setOpenDeleteRoleDialog(false);
    setMenuRole(null);
  };

  /*************************** PERMISSION MENU ***************************/

  const handlePermissionMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    permission: PermissionRow
  ) => {
    setPermissionMenuAnchorEl(
      event.currentTarget
    );

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

    setEditPermissionAction(
      menuPermission.action
    );

    setEditPermissionDescription(
      menuPermission.description
    );

    setEditPermissionRoles(
      menuPermission.roles
    );

    handlePermissionMenuClose();
    setOpenEditPermissionDialog(true);
  };

  const handleEditPermissionClose = () => {
  setOpenEditPermissionDialog(false);
};

const handleRemovePermissionRole = (role: string) => {
  setEditPermissionRoles((current) =>
    current.filter((item) => item !== role)
  );
};

  const handleEditPermissionSave = () => {
    if (!menuPermission) {
      return;
    }

    setPermissions((current) =>
      current.map((permission) =>
        permission.id === menuPermission.id
          ? {
              ...permission,
              action:
                editPermissionAction.trim() ||
                permission.action,
              description:
                editPermissionDescription.trim() ||
                permission.description,
              roles: editPermissionRoles
            }
          : permission
      )
    );

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

  const handleDeletePermissionConfirm = () => {
    if (!menuPermission) {
      return;
    }

    setPermissions((current) =>
      current.filter(
        (permission) =>
          permission.id !== menuPermission.id
      )
    );

    setOpenDeletePermissionDialog(false);
    setMenuPermission(null);
  };

  /*************************** CREATE ROLE ***************************/

  const handleCreateRole = (
    data: CreateRoleData
  ) => {
    const newRole: RoleRow = {
      id: Date.now().toString(),
      name:
        data.name ||
        data.roleName ||
        'Novo Papel',
      description: data.description || '',
      assignedUsers: [],
      extraUsersCount: 0,
      permissionCount: 0,
      permissions: [],
      users: []
    };

    setRoles((current) => [
      ...current,
      newRole
    ]);

    setRolesPage(1);
    setOpenCreateRoleDialog(false);
  };

  /*************************** CREATE PERMISSION ***************************/

  const handleCreatePermission = (
    data: CreatePermissionData
  ) => {
    const newPermission: PermissionRow = {
      id: Date.now().toString(),
      action:
        data.action ||
        data.name ||
        data.permission ||
        'nova.permissao',
      description: data.description || '',
      roles: data.roles || []
    };

    setPermissions((current) => [
      ...current,
      newPermission
    ]);

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
            startIcon={
              <IconPlus size={16} />
            }
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
                startIcon={
                  <IconFilter size={16} />
                }
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
                      onDelete={() =>
                        handleRemoveIndividualFilter(filter, 'permission')
                      }
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
                      onDelete={() =>
                        handleRemoveIndividualFilter(filter, 'role')
                      }
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

                  <TableCell
                    padding="checkbox"
                    sx={{ width: 52 }}
                  >
                    <Checkbox />
                  </TableCell>

                  <TableCell
                    sx={{ width: '16%' }}
                  >
                    Papel
                  </TableCell>

                  <TableCell
                    sx={{ width: '38%' }}
                  >
                    Descrição
                  </TableCell>

                  <TableCell
                    sx={{ width: '20%' }}
                  >
                    Usuário atribuído
                  </TableCell>

                  <TableCell
                    sx={{ width: '10%' }}
                  >
                    Permissão
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{ width: 60 }}
                  />
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRoles.map((role) => (
                  <TableRow
                    key={role.id}
                    hover
                  >
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>

                    <TableCell
                      sx={{ overflow: 'hidden' }}
                    >
                      <Typography
                        variant="subtitle2"
                        noWrap
                      >
                        {role.name}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{ overflow: 'hidden' }}
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
                          {role.assignedUsers.map(
                            (initial, index) => (
                              <Avatar
                                key={index}
                              >
                                {initial}
                              </Avatar>
                            )
                          )}
                        </AvatarGroup>

                        {role.extraUsersCount > 0 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            +{role.extraUsersCount}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                      >
                        {role.permissionCount}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(event) =>
                          handleMenuOpen(
                            event,
                            role
                          )
                        }
                      >
                        <IconDotsVertical
                          size={18}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {paginatedRoles.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ py: 4 }}
                      >
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
                      width:
                        item.type === 'page' ? 32 : 'auto',
                      minWidth:
                        item.type === 'page' ? 32 : 32,
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
                minWidth: 950
              }}
            >
              <TableHead>
                <TableRow>

                  <TableCell
                    padding="checkbox"
                    sx={{ width: 52 }}
                  >
                    <Checkbox />
                  </TableCell>

                  <TableCell
                    sx={{ width: '17%' }}
                  >
                    Permissões
                  </TableCell>

                  <TableCell
                    sx={{ width: '44%' }}
                  >
                    Descrição
                  </TableCell>

                  <TableCell
                    sx={{ width: '29%' }}
                  >
                    Papéis
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{ width: 60 }}
                  />
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedPermissions.map(
                  (permission) => (
                    <TableRow
                      key={permission.id}
                      hover
                    >
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>

                      <TableCell
                        sx={{
                          overflow: 'hidden'
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          noWrap
                        >
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
                          title={
                            permission.description
                          }
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
                          {permission.roles.map(
                            (role) => (
                              <Chip
                                key={role}
                                label={role}
                                size="small"
                                variant="outlined"
                                sx={{
                                  flexShrink: 0
                                }}
                              />
                            )
                          )}
                        </Stack>
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(event) =>
                            handlePermissionMenuOpen(
                              event,
                              permission
                            )
                          }
                        >
                          <IconDotsVertical
                            size={18}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                )}

                {paginatedPermissions.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ py: 4 }}
                      >
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
                      width:
                        item.type === 'page' ? 32 : 'auto',
                      minWidth:
                        item.type === 'page' ? 32 : 32,
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Permissão
                </Typography>

                <Chip
                  size="small"
                  label={`${selectedFilterPermissions.length} ${
                    selectedFilterPermissions.length === 1
                      ? 'Permissão'
                      : 'Permissões'
                  }`}
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
                onChange={(event) =>
                  setPermissionFilterSearch(
                    event.target.value
                  )
                }
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
              {filteredPermissionOptions.map(
                (permission) => (
                  <Box
                    key={permission}
                    onClick={() =>
                      handleTogglePermissionFilter(
                        permission
                      )
                    }
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
                    <Checkbox
                      checked={selectedFilterPermissions.includes(
                        permission
                      )}
                      size="small"
                    />

                    <Typography
                      variant="body2"
                      sx={{ fontSize: 16 }}
                    >
                      {permission}
                    </Typography>
                  </Box>
                )
              )}
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Papéis
                </Typography>

                <Chip
                  size="small"
                  label={`${selectedFilterRoles.length} ${
                    selectedFilterRoles.length === 1
                      ? 'Papel'
                      : 'Papéis'
                  }`}
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
                onChange={(event) =>
                  setRoleFilterSearch(
                    event.target.value
                  )
                }
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
                  onClick={() =>
                    handleToggleRoleFilter(role)
                  }
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
                  <Checkbox
                    checked={selectedFilterRoles.includes(
                      role
                    )}
                    size="small"
                  />

                  <Typography
                    variant="body2"
                    sx={{ fontSize: 16 }}
                  >
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
              boxShadow:
                '0px 6px 20px rgba(0, 0, 0, 0.12)',
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

          <Typography variant="body2">
            Editar
          </Typography>
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

          <Typography variant="body2">
            Deletar
          </Typography>
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
              boxShadow:
                '0px 6px 20px rgba(0, 0, 0, 0.12)',
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

          <Typography variant="body2">
            Editar
          </Typography>
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

          <Typography variant="body2">
            Deletar
          </Typography>
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

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Edite as informações, permissões e
              usuários atribuídos a este papel.
            </Typography>
          </Box>

          <IconButton
            onClick={handleEditRoleClose}
            size="small"
          >
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

              <OutlinedInput
                value={editRoleName}
                onChange={(event) =>
                  setEditRoleName(
                    event.target.value
                  )
                }
                fullWidth
              />
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
                onChange={(event) =>
                  setEditRoleDescription(
                    event.target.value
                  )
                }
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
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  (Opcional)
                </Typography>
              </Typography>

              <Stack sx={{ gap: 1 }}>
                {editPermissions.map(
                  (permission) => (
                    <Stack
                      key={permission.id}
                      direction="row"
                      sx={{
                        alignItems: 'center',
                        gap: 1,
                        p: 1
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
                          bgcolor: 'primary.light',
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
                          sx={{ fontWeight: 500 }}
                        >
                          {permission.name}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {permission.description}
                        </Typography>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={() =>
                          handleRemovePermission(
                            permission.id
                          )
                        }
                        sx={{
                          color: 'error.main',
                          border: '1px solid',
                          borderColor: 'error.light',
                          flexShrink: 0
                        }}
                      >
                        <IconTrash size={17} />
                      </IconButton>
                    </Stack>
                  )
                )}

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={
                    <IconPlus size={17} />
                  }
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
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
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
                      p: 1
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40
                      }}
                    >
                      {user.name
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>

                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500 }}
                      >
                        {user.name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {user.username}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={() =>
                        handleRemoveUser(user.id)
                      }
                      sx={{
                        color: 'error.main',
                        border: '1px solid',
                        borderColor: 'error.light'
                      }}
                    >
                      <IconTrash size={17} />
                    </IconButton>
                  </Stack>
                ))}

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={
                    <IconPlus size={17} />
                  }
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
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleEditRoleClose}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleEditRoleSave}
          >
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

          <IconButton
            size="small"
            onClick={handleDeleteRoleClose}
          >
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
              <IconTrash
                size={72}
                stroke={1.2}
              />
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: 600 }}
            >
              Tem certeza que deseja
              deletar?
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500 }}
            >
              {menuRole ? (
                <>
                  Ao deletar o papel{' '}
                  <Typography
                    component="span"
                    color="primary.main"
                    fontWeight={500}
                  >
                    {menuRole.name}
                  </Typography>
                  , todas as permissões e associações
                  relacionadas a ele serão removidas.

                  <br />
                  <br />

                  Tenha cuidado com esta ação, pois ela
                  não poderá ser desfeita.
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
          <Button
            variant="outlined"
            onClick={handleDeleteRoleClose}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={
              <IconTrash size={18} />
            }
            onClick={handleDeleteRoleConfirm}
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================== */}
{/* MODAL EDITAR PERMISSÃO                               */}
{/* ===================================================== */}

<Dialog
  open={openEditPermissionDialog}
  onClose={handleEditPermissionClose}
  maxWidth={false}
  fullWidth
  PaperProps={{
    sx: {
      width: 644,
      maxWidth: 'calc(100vw - 32px)',
      borderRadius: 2.5,
      overflow: 'hidden',
      m: 2
    }
  }}
>
  {/* ================================================= */}
  {/* CABEÇALHO                                        */}
  {/* ================================================= */}

  <Box
    sx={{
      px: 3,
      pt: 3,
      pb: 2.5
    }}
  >
    <Stack
      direction="row"
      sx={{
        alignItems: 'flex-start',
        justifyContent: 'space-between'
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: 22,
            lineHeight: 1.3,
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Editar Permissão
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
            fontSize: 15
          }}
        >
          Edite as informações desta permissão.
        </Typography>
      </Box>

      <IconButton
        onClick={handleEditPermissionClose}
        sx={{
          width: 44,
          height: 44,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          flexShrink: 0,
          ml: 2
        }}
      >
        <IconX size={20} />
      </IconButton>
    </Stack>
  </Box>

  <Divider />

  {/* ================================================= */}
  {/* CONTEÚDO                                         */}
  {/* ================================================= */}

  <DialogContent
    sx={{
      px: 3,
      py: 2.5,
      overflowY: 'auto'
    }}
  >
    <Stack sx={{ gap: 2.75 }}>

      {/* ============================================= */}
      {/* GENERAL INFORMATION                           */}
      {/* ============================================= */}

      <Box>
        <Typography
          sx={{
            fontSize: 17,
            fontWeight: 600,
            mb: 2
          }}
        >
          General Information
        </Typography>

        {/* NOME DA PERMISSÃO */}

        <Box sx={{ mb: 2.25 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 0.75,
              fontWeight: 500,
              fontSize: 15
            }}
          >
            Nome da permissão
          </Typography>

          <OutlinedInput
            fullWidth
            value={editPermissionAction}
            onChange={(event) =>
              setEditPermissionAction(
                event.target.value
              )
            }
            sx={{
              height: 40,
              fontSize: 14,
              borderRadius: 1.5
            }}
          />
        </Box>

        {/* DESCRIÇÃO */}

        <Box>
          <Typography
            variant="body2"
            sx={{
              mb: 0.75,
              fontWeight: 500,
              fontSize: 15
            }}
          >
            Descrição
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={3}
            value={editPermissionDescription}
            onChange={(event) =>
              setEditPermissionDescription(
                event.target.value
              )
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                alignItems: 'flex-start'
              },
              '& .MuiInputBase-input': {
                fontSize: 14,
                lineHeight: 1.45
              }
            }}
          />
        </Box>
      </Box>

      {/* ============================================= */}
      {/* ROLES                                         */}
      {/* ============================================= */}

      <Box>
        <Typography
          variant="body2"
          sx={{
            mb: 1.5,
            fontWeight: 500,
            fontSize: 15
          }}
        >
          Papéis{' '}
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: 14
            }}
          >
            (Opcional)
          </Typography>
        </Typography>

        <Stack sx={{ gap: 1 }}>

          {/* PAPÉIS ATRIBUÍDOS */}

          {editPermissionRoles.map((role) => (
            <Stack
              key={role}
              direction="row"
              sx={{
                alignItems: 'center',
                gap: 1.25,
                minHeight: 58,
                px: 1.25,
                py: 0.75,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5
              }}
            >
              {/* ÍCONE */}

              <Box
                sx={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1.25,
                  bgcolor: 'grey.50',
                  color: 'text.secondary'
                }}
              >
                <IconUsers size={20} />
              </Box>

              {/* INFORMAÇÕES */}

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
                    fontSize: 14
                  }}
                >
                  {role}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    mt: 0.25,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: 12
                  }}
                >
                  O papel possui permissões e
                  acessos definidos para os usuários
                  do sistema.
                </Typography>
              </Box>

              {/* DELETAR PAPEL */}

              <IconButton
                size="small"
                onClick={() =>
                  handleRemovePermissionRole(role)
                }
                sx={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  color: 'error.main',
                  border: '1px solid',
                  borderColor: 'error.lighter',
                  borderRadius: 1.5
                }}
              >
                <IconTrash size={17} />
              </IconButton>
            </Stack>
          ))}

          {/* ATRIBUIR PAPÉIS */}

          <Button
            variant="outlined"
            fullWidth
            startIcon={<IconPlus size={17} />}
            sx={{
              height: 46,
              mt: 0.5,
              borderRadius: 1.5,
              color: 'text.primary',
              borderColor: 'divider',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                borderColor: 'text.secondary',
                bgcolor: 'action.hover'
              }
            }}
          >
            Atribuir Papéis
          </Button>
        </Stack>
      </Box>
    </Stack>
  </DialogContent>

  <Divider />

  {/* ================================================= */}
  {/* RODAPÉ                                           */}
  {/* ================================================= */}

  <DialogActions
    sx={{
      px: 3,
      py: 2.25,
      justifyContent: 'flex-end',
      gap: 1.25
    }}
  >
    <Button
      variant="outlined"
      color="secondary"
      onClick={handleEditPermissionClose}
      sx={{
        height: 44,
        minWidth: 88,
        borderRadius: 1.5,
        textTransform: 'none'
      }}
    >
      Cancelar
    </Button>

    <Button
      variant="contained"
      onClick={handleEditPermissionSave}
      sx={{
        height: 44,
        minWidth: 156,
        borderRadius: 1.5,
        textTransform: 'none',
        fontWeight: 500
      }}
    >
      Atualizar Permissão
    </Button>
  </DialogActions>
</Dialog>

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

          <IconButton
            size="small"
            onClick={handleDeletePermissionClose}
          >
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
              <IconTrash
                size={72}
                stroke={1.2}
              />
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: 600 }}
            >
              Tem certeza que deseja
              deletar?
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500 }}
            >
              {menuPermission ? (
                <>
                  Ao deletar a permissão{' '}
                  <Typography
                    component="span"
                    color="primary.main"
                    fontWeight={500}
                  >
                    {menuPermission.action}
                  </Typography>
                  , todas as associações relacionadas a
                  ela serão removidas.

                  <br />
                  <br />

                  Tenha cuidado com esta ação, pois ela
                  não poderá ser desfeita.
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
          <Button
            variant="outlined"
            onClick={handleDeletePermissionClose}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={
              <IconTrash size={18} />
            }
            onClick={handleDeletePermissionConfirm}
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================== */}
      {/* MODAL CRIAR PAPEL                                    */}
      {/* ===================================================== */}

      <CreateRoleDialog
        open={openCreateRoleDialog}
        onClose={() =>
          setOpenCreateRoleDialog(false)
        }
        onCreate={handleCreateRole}
      />

      {/* ===================================================== */}
      {/* MODAL CRIAR PERMISSÃO                                */}
      {/* ===================================================== */}

      <CreatePermissionDialog
        open={openCreatePermissionDialog}
        onClose={() =>
          setOpenCreatePermissionDialog(false)
        }
        onCreate={handleCreatePermission}
      />

      {/* ===================================================== */}
      {/* MODAL CRIAR USUÁRIO                                   */}
      {/* ===================================================== */}

      <CreateUserDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreate={(data) => {
          // TODO: integrar com API (POST /api/users)
          console.log('Novo usuário:', data);
        }}
      />

    </Stack>
  );
}