'use client';

import { useState, useEffect, useCallback, useMemo, SyntheticEvent, MouseEvent } from 'react';

// @mui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Alert from '@mui/material/Alert';
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
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
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
  IconTrash,
  IconX
} from '@tabler/icons-react';

// @third-party
import useSWR, { mutate } from 'swr';

// @project
import CreatePermissionDialog, { PermissionData } from '@/sections/permissions/CreatePermissionDialog';
import CreateRoleDialog from '@/sections/roles/CreateRoleDialog';
import {
  getRoles,
  getPermissions,
  getSubjects,
  getActions,
  deleteRole,
  createPermission,
  updatePermission,
  deletePermission,
  updateRole,
  assignPermission,
  assignRolesToUser,
  getUserRoles,
  createSubject,
  updateSubject,
  deleteSubject,
  createAction,
  updateAction,
  deleteAction
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
  subjectId?: number;
  actionId?: number;
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

interface SubjectRow {
  id: string | number;
  description: string;
  createdAt?: string;
}

interface ActionRow {
  id: string | number;
  description: string;
  createdAt?: string;
}

const permissionActionValues: Record<string, string> = {
  Visualizar: 'read',
  Criar: 'create',
  Atualizar: 'update',
  Deletar: 'delete',
  'Aplicar Desconto': 'apply-discount'
};

const normalizePermissionAction = (action: string) => {
  const trimmedAction = action.trim();
  const normalizedLabel = trimmedAction
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const labels: Record<string, string> = {
    visualizar: 'read',
    ler: 'read',
    criar: 'create',
    atualizar: 'update',
    editar: 'update',
    deletar: 'delete',
    excluir: 'delete',
    'aplicar desconto': 'apply-discount'
  };

  return permissionActionValues[trimmedAction] ?? labels[normalizedLabel] ?? trimmedAction;
};

/*************************** FILTER DATA ***************************/

const filterPermissions = ['account.delete', 'account.view', 'account.update', 'account.edit', 'account.user'];

const filterRoles = ['Super Admin', 'Billing Admin', 'Admin', 'Developer', 'Product Designer'];

/*************************** HELPERS ***************************/

function SubjectActionDescriptionField({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <OutlinedInput
      fullWidth
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputProps={{ maxLength: 100 }}
    />
  );
}

/*************************** VIEW ***************************/

export default function RolesPermissionsView() {
  const [tab, setTab] = useState(0);

  const [rolesPage, setRolesPage] = useState(1);
  const [permissionsPage, setPermissionsPage] = useState(1);

  // Mantém a paginação com o mesmo padrão visual do Figma.
  // Os dados reais podem ultrapassar 10 páginas quando conectados à API.
  const rowsPerPage = 10;

  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const [subjectRows, setSubjectRows] = useState<SubjectRow[]>([]);
  const [actionRows, setActionRows] = useState<ActionRow[]>([]);
  const [subjectsPage, setSubjectsPage] = useState(1);
  const [actionsPage, setActionsPage] = useState(1);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  /*************************** SUBJECT STATE ***************************/

  const [subjectSearch, setSubjectSearch] = useState('');
  const [subjectMenuAnchorEl, setSubjectMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuSubject, setMenuSubject] = useState<SubjectRow | null>(null);
  const [openCreateSubjectDialog, setOpenCreateSubjectDialog] = useState(false);
  const [openEditSubjectDialog, setOpenEditSubjectDialog] = useState(false);
  const [openDeleteSubjectDialog, setOpenDeleteSubjectDialog] = useState(false);
  const [editSubjectDescription, setEditSubjectDescription] = useState('');
  const [subjectDialogError, setSubjectDialogError] = useState('');

  /*************************** ACTION STATE ***************************/

  const [actionSearch, setActionSearch] = useState('');
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAction, setMenuAction] = useState<ActionRow | null>(null);
  const [openCreateActionDialog, setOpenCreateActionDialog] = useState(false);
  const [openEditActionDialog, setOpenEditActionDialog] = useState(false);
  const [openDeleteActionDialog, setOpenDeleteActionDialog] = useState(false);
  const [editActionDescription, setEditActionDescription] = useState('');
  const [actionDialogError, setActionDialogError] = useState('');

  /*************************** DATA LOADING (BACKEND) ***************************/

  // Carrega papéis e permissões reais do backend, mapeando para o formato das linhas exibidas na tabela.
  const reloadData = useCallback(async () => {
    setDataLoading(true);
    setDataError(null);

    const [rolesRes, permsRes, subjectsRes, actionsRes, usersRes] = await Promise.all([
      getRoles(),
      getPermissions(),
      getSubjects(),
      getActions(),
      getUsers()
    ]);

    // Mapa id → description para resolver subjectId/actionId vindos do backend ONC
    type LookupItem = { id: string | number; description?: string };
    const subjectMap = new Map<number, string>(
      ((subjectsRes.data ?? []) as LookupItem[]).map((s) => [Number(s.id), s.description || ''])
    );
    const actionMap = new Map<number, string>(
      ((actionsRes.data ?? []) as LookupItem[]).map((a) => [Number(a.id), a.description || ''])
    );

    // Mapa id → Permission para resolver IDs de permissão vindos do backend ONC
    // (GET /roles retorna RolePermissionsIntsResponseDTO com permissions: number[])
    type AnyPerm = ApiPermission & Record<string, unknown>;
    const permissionMap = new Map<number, AnyPerm>(
      ((permsRes.data ?? []) as AnyPerm[]).map((p) => [Number(p.id), p])
    );

    // Mapa id → usuário para resolver UUIDs de usuário vindos do backend ONC
    // (GET /roles retorna RolePermissionsIntsResponseDTO com users: string[])
    type AnyUser = { id: string; userName?: string; email?: string; nomeCompleto?: string; [key: string]: unknown };
    const userMap = new Map<string, AnyUser>(
      ((usersRes.data ?? []) as AnyUser[]).map((u) => [String(u.id), u])
    );

    if (rolesRes.error) {
      setRoles([]);
    } else if (Array.isArray(rolesRes.data)) {
      const mapped: RoleRow[] = (rolesRes.data as ApiRole[]).map((role) => {
        // ONC retorna permissions como number[] (só IDs); mock retorna objetos completos.
        const rolePermissions = (role.permissions ?? []).map((p) => {
          if (typeof p === 'number' || (typeof p !== 'object')) {
            // Modo ONC: p é um ID numérico — resolve via mapa
            const full = permissionMap.get(Number(p));
            if (full) {
              const subId = typeof full.subjectId === 'number' ? full.subjectId : undefined;
              const actId = typeof full.actionId === 'number' ? full.actionId : undefined;
              const subDesc = (subId != null ? subjectMap.get(subId) : undefined) ?? String(full.subject ?? '');
              const actDesc = (actId != null ? actionMap.get(actId) : undefined) ?? String(full.action ?? full.name ?? '');
              const label = subDesc && actDesc ? `${subDesc}.${actDesc}` : (full.description ?? `#${p}`);
              return { id: String(full.id), name: label, description: String(full.description ?? '') };
            }
            return { id: String(p), name: `#${p}`, description: '' };
          }
          // Modo mock: p é um objeto completo
          const pObj = p as ApiPermission;
          return { id: String(pObj.id), name: pObj.name ?? '', description: pObj.description ?? '' };
        });

        // ONC retorna users como string[] (UUIDs); mock retorna objetos completos.
        const roleUsers = (role.users ?? []).map((u: unknown) => {
          if (typeof u === 'string') {
            // Modo ONC: u é um UUID — resolve via mapa de usuários
            const full = userMap.get(u);
            const name = full
              ? String(full.nomeCompleto || full.userName || full.email || u)
              : u;
            const username = full ? String(full.userName || full.email || '') : '';
            return { id: u, name, username };
          }
          // Modo mock: u é um objeto completo
          const uObj = u as { id?: unknown; name?: unknown; userName?: unknown; email?: unknown };
          return {
            id: String(uObj.id ?? ''),
            name: String(uObj.name || uObj.userName || uObj.email || 'Usuário'),
            username: String(uObj.userName || uObj.email || '')
          };
        });

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
    } else {
      setRoles([]);
    }

    if (permsRes.error) {
      setPermissions([]);
    } else if (Array.isArray(permsRes.data)) {
      const mapped: PermissionRow[] = (permsRes.data as Array<ApiPermission & Record<string, unknown>>).map((perm) => {
        // IDs numéricos retornados pelo backend ONC
        const subjectId = typeof perm.subjectId === 'number' ? perm.subjectId : undefined;
        const actionId = typeof perm.actionId === 'number' ? perm.actionId : undefined;

        // Tenta descrição via lookup de ID (modo ONC); fallback para campos de texto (modo mock)
        const rawSubject =
          (subjectId != null ? subjectMap.get(subjectId) : undefined) ??
          String(perm.subject ?? perm.Subject ?? perm.resource ?? perm.Resource ?? '');

        const rawActionText =
          (actionId != null ? actionMap.get(actionId) : undefined) ??
          String(perm.action ?? perm.Action ?? perm.name ?? perm.Name ?? '');

        const actionValue = Array.isArray(rawActionText) ? (rawActionText as string[]).join(', ') : rawActionText;
        const dottedParts = !rawSubject && actionValue.includes('.') ? actionValue.split('.') : [];
        const subject = rawSubject || dottedParts[0] || '';
        const action = dottedParts.length > 1 ? dottedParts.slice(1).join('.') : actionValue;
        const rawRoles = perm.roles ?? perm.Roles ?? [];

        return {
          id: String(perm.id ?? perm.Id),
          subject,
          action,
          subjectId,
          actionId,
          description: String(perm.description ?? perm.Description ?? ''),
          roles: Array.isArray(rawRoles) ? rawRoles.map(String) : []
        };
      });
      setPermissions(mapped);
    } else {
      setPermissions([]);
    }

    // Carrega subjects e actions nas tabelas próprias
    type LookupRow = { id: string | number; description?: string; createdAt?: string };
    if (!subjectsRes.error && Array.isArray(subjectsRes.data)) {
      setSubjectRows((subjectsRes.data as LookupRow[]).map((s) => ({ id: s.id, description: s.description ?? '', createdAt: s.createdAt })));
    }
    if (!actionsRes.error && Array.isArray(actionsRes.data)) {
      setActionRows((actionsRes.data as LookupRow[]).map((a) => ({ id: a.id, description: a.description ?? '', createdAt: a.createdAt })));
    }

    const errors = [rolesRes.error, permsRes.error].filter(Boolean);
    if (errors.length > 0) {
      setDataError(`Não foi possível carregar os dados do backend: ${errors.join(' | ')}`);
    }

    setDataLoading(false);
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  /*************************** SEARCH ***************************/

  const [search, setSearch] = useState('');

  /*************************** SUBJECTS HANDLERS ***************************/

  const filteredSubjects = useMemo(
    () => subjectRows.filter((s) => s.description.toLowerCase().includes(subjectSearch.toLowerCase())),
    [subjectRows, subjectSearch]
  );
  const totalSubjectPages = Math.max(1, Math.ceil(filteredSubjects.length / rowsPerPage));
  const paginatedSubjects = filteredSubjects.slice((subjectsPage - 1) * rowsPerPage, subjectsPage * rowsPerPage);

  const handleSubjectMenuOpen = (event: MouseEvent<HTMLElement>, subject: SubjectRow) => {
    setSubjectMenuAnchorEl(event.currentTarget);
    setMenuSubject(subject);
  };
  const handleSubjectMenuClose = () => {
    setSubjectMenuAnchorEl(null);
  };

  const handleCreateSubjectSave = async (description: string) => {
    setSubjectDialogError('');
    const { data, error } = await createSubject({ description });
    if (error) { setSubjectDialogError(error); return; }
    const created = data as { id: string | number; description: string; createdAt?: string } | null;
    setSubjectRows((prev) => [...prev, { id: created?.id ?? Date.now(), description, createdAt: created?.createdAt }]);
    setOpenCreateSubjectDialog(false);
    openSnackbar({ open: true, message: 'Alvo criado com sucesso', variant: 'alert', severity: 'success', alert: { color: 'success' } } as never);
  };

  const handleEditSubjectOpen = () => {
    if (!menuSubject) return;
    setEditSubjectDescription(menuSubject.description);
    setSubjectDialogError('');
    handleSubjectMenuClose();
    setOpenEditSubjectDialog(true);
  };

  const handleEditSubjectSave = async () => {
    if (!menuSubject) return;
    setSubjectDialogError('');
    const { error } = await updateSubject({ id: menuSubject.id, description: editSubjectDescription });
    if (error) { setSubjectDialogError(error); return; }
    setSubjectRows((prev) => prev.map((s) => s.id === menuSubject.id ? { ...s, description: editSubjectDescription } : s));
    setOpenEditSubjectDialog(false);
    openSnackbar({ open: true, message: 'Alvo atualizado', variant: 'alert', severity: 'success', alert: { color: 'success' } } as never);
  };

  const handleDeleteSubjectOpen = () => {
    handleSubjectMenuClose();
    setOpenDeleteSubjectDialog(true);
  };

  const handleDeleteSubjectConfirm = async () => {
    if (!menuSubject) return;
    const { error } = await deleteSubject(menuSubject.id);
    if (error) {
      openSnackbar({ open: true, message: error, variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
      return;
    }
    setSubjectRows((prev) => prev.filter((s) => s.id !== menuSubject.id));
    setOpenDeleteSubjectDialog(false);
    setMenuSubject(null);
    openSnackbar({ open: true, message: 'Alvo excluído', variant: 'alert', severity: 'success', alert: { color: 'success' } } as never);
  };

  /*************************** ACTIONS HANDLERS ***************************/

  const filteredActions = useMemo(
    () => actionRows.filter((a) => a.description.toLowerCase().includes(actionSearch.toLowerCase())),
    [actionRows, actionSearch]
  );
  const totalActionPages = Math.max(1, Math.ceil(filteredActions.length / rowsPerPage));
  const paginatedActions = filteredActions.slice((actionsPage - 1) * rowsPerPage, actionsPage * rowsPerPage);

  const handleActionMenuOpen = (event: MouseEvent<HTMLElement>, action: ActionRow) => {
    setActionMenuAnchorEl(event.currentTarget);
    setMenuAction(action);
  };
  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
  };

  const handleCreateActionSave = async (description: string) => {
    setActionDialogError('');
    const { data, error } = await createAction({ description });
    if (error) { setActionDialogError(error); return; }
    const created = data as { id: string | number; description: string; createdAt?: string } | null;
    setActionRows((prev) => [...prev, { id: created?.id ?? Date.now(), description, createdAt: created?.createdAt }]);
    setOpenCreateActionDialog(false);
    openSnackbar({ open: true, message: 'Ação criada com sucesso', variant: 'alert', severity: 'success', alert: { color: 'success' } } as never);
  };

  const handleEditActionOpen = () => {
    if (!menuAction) return;
    setEditActionDescription(menuAction.description);
    setActionDialogError('');
    handleActionMenuClose();
    setOpenEditActionDialog(true);
  };

  const handleEditActionSave = async () => {
    if (!menuAction) return;
    setActionDialogError('');
    const { error } = await updateAction({ id: menuAction.id, description: editActionDescription });
    if (error) { setActionDialogError(error); return; }
    setActionRows((prev) => prev.map((a) => a.id === menuAction.id ? { ...a, description: editActionDescription } : a));
    setOpenEditActionDialog(false);
    openSnackbar({ open: true, message: 'Ação atualizada', variant: 'alert', severity: 'success', alert: { color: 'success' } } as never);
  };

  const handleDeleteActionOpen = () => {
    handleActionMenuClose();
    setOpenDeleteActionDialog(true);
  };

  const handleDeleteActionConfirm = async () => {
    if (!menuAction) return;
    const { error } = await deleteAction(menuAction.id);
    if (error) {
      openSnackbar({ open: true, message: error, variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
      return;
    }
    setActionRows((prev) => prev.filter((a) => a.id !== menuAction.id));
    setOpenDeleteActionDialog(false);
    setMenuAction(null);
    openSnackbar({ open: true, message: 'Ação excluída', variant: 'alert', severity: 'success', alert: { color: 'success' } } as never);
  };

  /*************************** CREATE ***************************/

  const [openCreateRoleDialog, setOpenCreateRoleDialog] = useState(false);

  const [openCreatePermissionDialog, setOpenCreatePermissionDialog] = useState(false);

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

  // Buscar subjects/actions para resolver subjectId/actionId → descrição nos rótulos
  const { data: subjectsData } = useSWR('/api/rbac/subjects', async () => {
    const { data } = await getSubjects();
    return (data ?? []) as Array<{ id: string | number; description?: string }>;
  });

  const { data: actionsData } = useSWR('/api/rbac/actions', async () => {
    const { data } = await getActions();
    return (data ?? []) as Array<{ id: string | number; description?: string }>;
  });

  const subjectLookup = useMemo(
    () => new Map<number, string>((subjectsData ?? []).map((s) => [Number(s.id), s.description || ''])),
    [subjectsData]
  );

  const actionLookup = useMemo(
    () => new Map<number, string>((actionsData ?? []).map((a) => [Number(a.id), a.description || ''])),
    [actionsData]
  );

  // Resolve um objeto de permissão para um rótulo legível.
  // Prioridade: description > subject.action > name > id
  const resolvePermLabel = useCallback(
    (p: {
      id?: string | number;
      name?: string;
      description?: string;
      subject?: string;
      action?: string;
      subjectId?: number;
      actionId?: number;
    }): string => {
      if (p.description) return p.description;
      const subject = p.subject || (p.subjectId != null ? subjectLookup.get(Number(p.subjectId)) : undefined) || '';
      const action = p.action || (p.actionId != null ? actionLookup.get(Number(p.actionId)) : undefined) || '';
      if (subject || action) return [subject, action].filter(Boolean).join('.');
      return p.name ?? String(p.id ?? '');
    },
    [subjectLookup, actionLookup]
  );

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
    setSubjectSearch('');
    setActionSearch('');
    setRolesPage(1);
    setPermissionsPage(1);
    setSubjectsPage(1);
    setActionsPage(1);
  };

  const addButtonLabel =
    tab === 0 ? 'Novo Papel' :
    tab === 1 ? 'Nova Permissão' :
    tab === 2 ? 'Novo Alvo' :
    'Nova Ação';

  const handleAddClick = () => {
    if (tab === 0) { setOpenCreateRoleDialog(true); return; }
    if (tab === 1) { setOpenCreatePermissionDialog(true); return; }
    if (tab === 2) { setSubjectDialogError(''); setEditSubjectDescription(''); setOpenCreateSubjectDialog(true); return; }
    if (tab === 3) { setActionDialogError(''); setEditActionDescription(''); setOpenCreateActionDialog(true); }
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

  const handleMenuOpen = (event: MouseEvent<HTMLElement>, role: RoleRow) => {
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
      console.error('handleEditRoleSave - menuRole é null');
      return;
    }

    // Padroniza todos os IDs como strings (MOCK usa strings, ONC aceita strings)
    const roleId = String(menuRole.id);

    console.log('handleEditRoleSave - Iniciando salvamento do papel:', roleId);
    console.log('handleEditRoleSave - menuRole completo:', menuRole);
    console.log('handleEditRoleSave - Dados do papel:', { name: editRoleName, description: editRoleDescription });
    console.log('handleEditRoleSave - Permissões:', editPermissions.map(p => p.id));
    console.log('handleEditRoleSave - Usuários:', editUsers.map(u => u.id));

    // 1) Atualiza o papel na API
    console.log('handleEditRoleSave - Chamando updateRole com:', {
      id: roleId,
      name: editRoleName.trim() || menuRole.name,
      description: editRoleDescription.trim() || menuRole.description
    });
    const { error: updateError } = await updateRole({
      id: roleId,
      name: editRoleName.trim() || menuRole.name,
      description: editRoleDescription.trim() || menuRole.description
    });

    if (updateError) {
      console.error('handleEditRoleSave - Erro no updateRole:', updateError);
      openSnackbar({ open: true, message: updateError, variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
      return;
    }
    console.log('handleEditRoleSave - updateRole concluído com sucesso');

    // 2) Atualiza as permissões do papel (mantém como strings)
    const selectedPermissionIds = editPermissions.map((p) => String(p.id));
    console.log('handleEditRoleSave - Permissões selecionadas:', selectedPermissionIds);
    console.log('handleEditRoleSave - Chamando assignPermission com:', {
      roleId: roleId,
      permissions: selectedPermissionIds
    });
    const { error: assignError } = await assignPermission({
      roleId: roleId,
      permissions: selectedPermissionIds
    });

    if (assignError) {
      console.error('handleEditRoleSave - Erro no assignPermission:', assignError);
      openSnackbar({ open: true, message: assignError, variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
      return;
    }
    console.log('handleEditRoleSave - assignPermission concluído com sucesso');

    // 3) Sincroniza a atribuição de usuários ao papel de forma exata: remove o papel
    // dos usuários que saíram da seleção e mantém o papel apenas nos usuários selecionados.
    const selectedUserIds = editUsers.map((u) => String(u.id));
    const selectedUserIdSet = new Set(selectedUserIds);
    const usersToSync = (availableUsers ?? []).map((user) => String(user.id));

    console.log('handleEditRoleSave - Usuários selecionados:', selectedUserIds);
    console.log('handleEditRoleSave - Chamando assignRolesToUser para sincronizar a atribuição final...');

    const results = await Promise.all(
      usersToSync.map(async (userId) => {
        const currentRolesResult = await getUserRoles(userId);

        if (currentRolesResult.error) {
          return { error: currentRolesResult.error };
        }

        const currentRolePayload = currentRolesResult.data as
          | Array<string | number | { role_id?: string | number; roleId?: string | number }>
          | { roles?: Array<string | number | { role_id?: string | number; roleId?: string | number }> }
          | null;
        const currentRoleItems = (Array.isArray(currentRolePayload) ? currentRolePayload : currentRolePayload?.roles ?? []) as Array<
          | string
          | number
          | { role_id?: string | number; roleId?: string | number }
        >;
        const currentRoles = currentRoleItems
          .map((item) => (typeof item === 'object' ? item.role_id ?? item.roleId : item))
          .filter((id): id is string | number => id !== undefined && id !== null)
          .map(String);
        const nextRoles = Array.from(new Set(currentRoles.filter((existingRoleId) => existingRoleId !== roleId))).concat(
          selectedUserIdSet.has(userId) ? [roleId] : []
        );

        return assignRolesToUser({ userId, roles: nextRoles });
      })
    );

    console.log('handleEditRoleSave - Resultados assignRolesToUser:', results);

    const firstUserError = results.find((r) => r.error)?.error;
    if (firstUserError) {
      console.error('handleEditRoleSave - Erro ao atribuir usuários:', results);
      openSnackbar({
        open: true,
        message: firstUserError,
        variant: 'alert',
        severity: 'error',
        alert: { color: 'error' }
      } as never);
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

    setRoles((current) =>
      current.map((role) =>
        role.id === roleId
          ? {
              ...role,
              name: editRoleName.trim() || menuRole.name,
              description: editRoleDescription.trim() || menuRole.description,
              permissions: editPermissions,
              permissionCount: editPermissions.length,
              users: editUsers,
              assignedUsers: editUsers.map((user) => user.name?.charAt(0)?.toUpperCase() || 'U'),
              extraUsersCount: Math.max(0, editUsers.length - 4)
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

  const handlePermissionMenuOpen = (event: MouseEvent<HTMLElement>, permission: PermissionRow) => {
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
    // Passa IDs numéricos para o form (subjectId/actionId) além das descriptions para fallback de display
    const permissionData: PermissionData = {
      id: menuPermission.id,
      target: menuPermission.subject,
      targetId: menuPermission.subjectId != null ? String(menuPermission.subjectId) : undefined,
      actions: menuPermission.action
        .split(',')
        .map((action) => action.trim())
        .filter(Boolean),
      actionIds: menuPermission.actionId != null ? [String(menuPermission.actionId)] : undefined,
      description: menuPermission.description
    };

    setEditPermissionData(permissionData);

    handlePermissionMenuClose();
    setOpenEditPermissionDialog(true);
  };

  const handleEditPermissionClose = () => {
    setOpenEditPermissionDialog(false);
    setEditPermissionData(null);
  };

  const handleEditPermissionSave = async (data: { name?: string; target: string; actions: string[]; description: string }) => {
    if (!menuPermission) {
      console.error('handleEditPermissionSave - menuPermission é null');
      return false;
    }

    console.log('handleEditPermissionSave - Dados recebidos:', data);
    console.log('handleEditPermissionSave - menuPermission:', menuPermission);
    console.log('handleEditPermissionSave - ID da permissão:', menuPermission.id);

    // data.target = subjectId (string), data.actions = actionIds (string[])
    const subjectId = data.target ? Number(data.target) : NaN;
    const actionIds = data.actions.map(Number).filter((n) => !isNaN(n) && n > 0);
    const firstActionId = actionIds[0];

    if (!firstActionId || isNaN(subjectId)) {
      openSnackbar({ open: true, message: 'Selecione pelo menos uma ação.', variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
      return false;
    }

    const duplicatePermission = permissions.find((permission) => {
      if (permission.id === menuPermission.id) return false;
      // Comparação por IDs quando disponíveis (modo ONC); fallback por texto (modo mock)
      if (permission.subjectId != null && !isNaN(subjectId)) {
        return permission.subjectId === subjectId && permission.actionId === firstActionId;
      }
      return permission.subject.trim().toLowerCase() === data.target.trim().toLowerCase();
    });
    if (duplicatePermission) {
      openSnackbar({
        open: true,
        message: 'Já existe uma permissão com este alvo e ação.',
        variant: 'alert',
        severity: 'error',
        alert: { color: 'error' }
      } as never);
      return false;
    }

    // O backend mantém uma ação por permissão; a edição atualiza o registro existente.
    console.log('handleEditPermissionSave - Enviando updatePermission com:', {
      id: menuPermission.id,
      subjectId,
      actionId: firstActionId,
      description: data.description
    });
    const { error } = await updatePermission({
      id: menuPermission.id,
      subjectId,
      actionId: firstActionId,
      description: data.description
    });

    if (error) {
      console.error('handleEditPermissionSave - Erro no updatePermission:', error);
      openSnackbar({ open: true, message: error, variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
      return false;
    }

    const additionalPermissionResults = await Promise.all(
      actionIds.slice(1).map((additionalActionId) =>
        createPermission({
          subjectId,
          actionId: additionalActionId,
          description: data.description
        })
      )
    );
    const additionalPermissionError = additionalPermissionResults.find((result) => result.error)?.error;
    if (additionalPermissionError) {
      openSnackbar({ open: true, message: additionalPermissionError, variant: 'alert', severity: 'error', alert: { color: 'error' } } as never);
      return false;
    }

    console.log('handleEditPermissionSave - Update realizado com sucesso');
    openSnackbar({
      open: true,
      message: 'Permissão atualizada com sucesso!',
      variant: 'alert',
      severity: 'success',
      alert: { color: 'success' }
    } as never);

    await mutate('/api/rbac/permissions');
    await mutate('/api/rbac/roles');
    await reloadData();

    setOpenEditPermissionDialog(false);
    setMenuPermission(null);
    return true;
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
    // data.target = subjectId (string), data.actions = actionIds (string[])
    const subjectId = data.target ? Number(data.target) : NaN;
    const rawActions = data.actions && data.actions.length > 0 ? data.actions : data.action ? [data.action] : [];
    const actionIds = rawActions.map(Number).filter((n) => !isNaN(n) && n > 0);

    if (isNaN(subjectId) || actionIds.length === 0) {
      setOpenCreatePermissionDialog(false);
      return;
    }

    // O backend modela cada permissão como um par subjectId + actionId.
    // Quando várias ações são selecionadas, criamos uma permissão para cada.
    const results = await Promise.all(
      actionIds.map((actionId) =>
        createPermission({
          subjectId,
          actionId,
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
          <Tab label="Alvo" />
          <Tab label="Ação" />
        </Tabs>

        {dataLoading && (
          <Alert severity="info" sx={{ mx: 2, mt: 2 }}>
            Carregando dados do backend...
          </Alert>
        )}

        {dataError && (
          <Alert severity="error" sx={{ mx: 2, mt: 2 }}>
            {dataError}
          </Alert>
        )}

        {/* PESQUISA / FILTRO */}

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
                    <TableCell sx={{ width: '15%' }}>Papel</TableCell>

                    <TableCell sx={{ width: '27%' }}>Descrição</TableCell>

                    <TableCell sx={{ width: '28%' }}>Usuário atribuído</TableCell>

                    <TableCell sx={{ width: '24%' }}>Permissão</TableCell>

                    <TableCell align="right" sx={{ width: 60 }} />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedRoles.map((role) => (
                    <TableRow key={role.id} hover>

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

                      <TableCell sx={{ overflow: 'hidden' }}>
                        {role.users.length === 0 ? (
                          <Typography variant="body2" color="text.disabled">—</Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            noWrap
                            title={role.users.map((u) => u.name).join(', ')}
                            sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          >
                            {role.users
                              .slice(0, 3)
                              .map((u) => u.name)
                              .join(', ')}
                            {role.users.length > 3 && (
                              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                +{role.users.length - 3}
                              </Typography>
                            )}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell sx={{ overflow: 'hidden' }}>
                        {role.permissions.length === 0 ? (
                          <Typography variant="body2" color="text.disabled">—</Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            noWrap
                            title={role.permissions.map((p) => p.description || p.name || String(p.id)).join(', ')}
                            sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          >
                            {role.permissions
                              .slice(0, 2)
                              .map((p) => p.description || p.name || String(p.id))
                              .join(', ')}
                            {role.permissions.length > 2 && (
                              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                +{role.permissions.length - 2}
                              </Typography>
                            )}
                          </Typography>
                        )}
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

                    <TableCell sx={{ width: '12%' }}>Alvo</TableCell>

                    <TableCell sx={{ width: '15%' }}>Ações</TableCell>

                    <TableCell sx={{ width: '63%' }}>Descrição</TableCell>

                    <TableCell align="right" sx={{ width: 60 }} />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedPermissions.map((permission) => (
                    <TableRow key={permission.id} hover>
                      
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
        {/* ABA ALVO (SUBJECT)                                   */}
        {/* ===================================================== */}

        {tab === 2 && (
          <>
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
              <OutlinedInput
                fullWidth
                size="small"
                placeholder="Pesquisar alvo..."
                value={subjectSearch}
                onChange={(e) => { setSubjectSearch(e.target.value); setSubjectsPage(1); }}
                startAdornment={<InputAdornment position="start"><IconSearch size={18} /></InputAdornment>}
              />
            </Box>

            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ tableLayout: 'fixed', minWidth: 500 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '15%' }}>ID</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell align="right" sx={{ width: 60 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSubjects.map((subject) => (
                    <TableRow key={subject.id} hover>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{String(subject.id)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{subject.description}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => handleSubjectMenuOpen(e, subject)}>
                          <IconDotsVertical size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedSubjects.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                          Nenhum alvo encontrado.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center', p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Pagination
                count={totalSubjectPages}
                page={subjectsPage}
                onChange={(_, value) => setSubjectsPage(value)}
                color="primary"
                siblingCount={1}
                boundaryCount={1}
              />
            </Stack>
          </>
        )}

        {/* ===================================================== */}
        {/* ABA AÇÃO (ACTION)                                    */}
        {/* ===================================================== */}

        {tab === 3 && (
          <>
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
              <OutlinedInput
                fullWidth
                size="small"
                placeholder="Pesquisar ação..."
                value={actionSearch}
                onChange={(e) => { setActionSearch(e.target.value); setActionsPage(1); }}
                startAdornment={<InputAdornment position="start"><IconSearch size={18} /></InputAdornment>}
              />
            </Box>

            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ tableLayout: 'fixed', minWidth: 500 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '15%' }}>ID</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell align="right" sx={{ width: 60 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedActions.map((action) => (
                    <TableRow key={action.id} hover>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{String(action.id)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{action.description}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => handleActionMenuOpen(e, action)}>
                          <IconDotsVertical size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedActions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                          Nenhuma ação encontrada.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center', p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Pagination
                count={totalActionPages}
                page={actionsPage}
                onChange={(_, value) => setActionsPage(value)}
                color="primary"
                siblingCount={1}
                boundaryCount={1}
              />
            </Stack>
          </>
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
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2.5,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            px: 3,
            pt: 3,
            pb: 2.5
          }}
        >
          <Box>
            <DialogTitle
              sx={{
                p: 0,
                fontSize: 22,
                lineHeight: 1.3,
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              Editar Papel
            </DialogTitle>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 14 }}>
              Edite as informações, permissões e usuários atribuídos a este papel.
            </Typography>
          </Box>

          <IconButton
            onClick={handleEditRoleClose}
            size="small"
            sx={{
              width: 44,
              height: 44,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              flexShrink: 0
            }}
          >
            <IconX size={19} />
          </IconButton>
        </Stack>

        <Divider />

        <DialogContent
          sx={{
            px: 3,
            py: 2.5,
            overflowY: 'auto',
            overflowX: 'hidden',
            flex: 1
          }}
        >
          <Stack sx={{ gap: 2.5 }}>
            <Typography variant="subtitle1">Informação Geral</Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel>Papel</InputLabel>
                <OutlinedInput
                  value={editRoleName}
                  onChange={(event) => setEditRoleName(event.target.value)}
                  placeholder="Insira o nome do papel ex. Super Admin"
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel>Descrição</InputLabel>
                <TextField
                  value={editRoleDescription}
                  onChange={(event) => setEditRoleDescription(event.target.value)}
                  placeholder="Adicione uma descrição"
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel sx={{ mb: 1 }}>Permissão (Opcional)</InputLabel>
                {permissionsLoading ? (
                  <CircularProgress size={20} />
                ) : permissionsError ? (
                  <Typography color="error">Erro ao carregar permissões</Typography>
                ) : (
                  <Autocomplete
                    multiple
                    options={(availablePermissions ?? []).map((permission) => ({
                      id: String(permission.id),
                      label: resolvePermLabel(permission)
                    }))}
                    value={editPermissions.map((permission) => ({
                      id: String(permission.id),
                      label: resolvePermLabel(permission)
                    }))}
                    onChange={(_event, value) => {
                      const nextPermissionIds = new Set(value.map((item) => String(item.id)));
                      setEditPermissions(
                        (availablePermissions ?? [])
                          .filter((permission) => nextPermissionIds.has(String(permission.id)))
                          .map((permission) => ({
                            id: String(permission.id),
                            name: resolvePermLabel(permission),
                            description: permission.description ?? ''
                          }))
                      );
                    }}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={editPermissions.length ? '' : '+ Atribuir Permissões'}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment:
                            editPermissions.length === 0 ? <IconPlus size={16} style={{ marginLeft: 8 }} /> : params.InputProps.startAdornment
                        }}
                      />
                    )}
                  />
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel sx={{ mb: 1 }}>Usuários (Opcional)</InputLabel>
                {usersLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Autocomplete
                    multiple
                    options={(availableUsers ?? []).map((user) => ({
                      id: String(user.id),
                      label: user.name || user.username || String(user.id)
                    }))}
                    value={editUsers.map((user) => ({
                      id: String(user.id),
                      label: user.name || user.username || String(user.id)
                    }))}
                    onChange={(_event, value) => {
                      const selectedIds = new Set(value.map((item) => String(item.id)));
                      setEditUsers(
                        (availableUsers ?? [])
                          .filter((user) => selectedIds.has(String(user.id)))
                          .map((user) => ({
                            id: String(user.id),
                            name: user.name || 'Usuário',
                            username: user.username || ''
                          }))
                      );
                    }}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={editUsers.length ? '' : '+ Atribuir Usuários'}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment:
                            editUsers.length === 0 ? <IconPlus size={16} style={{ marginLeft: 8 }} /> : params.InputProps.startAdornment
                        }}
                      />
                    )}
                  />
                )}
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 1.5
          }}
        >
          <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
            <Button
              onClick={handleEditRoleClose}
              color="secondary"
              variant="outlined"
              sx={{
                minWidth: 108,
                height: 44,
                borderRadius: 1.5
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditRoleSave}
              sx={{
                minWidth: 170,
                height: 44,
                borderRadius: 1.5
              }}
            >
              Atualizar Papel
            </Button>
          </Stack>
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
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
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
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
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
      {/* MENU ALVO                                             */}
      {/* ===================================================== */}

      <Menu anchorEl={subjectMenuAnchorEl} open={Boolean(subjectMenuAnchorEl)} onClose={handleSubjectMenuClose}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 140 } }}>
        <MenuItem onClick={handleEditSubjectOpen} sx={{ gap: 1 }}>
          <IconEdit size={16} /> Editar
        </MenuItem>
        <MenuItem onClick={handleDeleteSubjectOpen} sx={{ gap: 1, color: 'error.main' }}>
          <IconTrash size={16} /> Excluir
        </MenuItem>
      </Menu>

      {/* ===================================================== */}
      {/* MENU AÇÃO                                             */}
      {/* ===================================================== */}

      <Menu anchorEl={actionMenuAnchorEl} open={Boolean(actionMenuAnchorEl)} onClose={handleActionMenuClose}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 140 } }}>
        <MenuItem onClick={handleEditActionOpen} sx={{ gap: 1 }}>
          <IconEdit size={16} /> Editar
        </MenuItem>
        <MenuItem onClick={handleDeleteActionOpen} sx={{ gap: 1, color: 'error.main' }}>
          <IconTrash size={16} /> Excluir
        </MenuItem>
      </Menu>

      {/* ===================================================== */}
      {/* DIALOG CRIAR ALVO                                     */}
      {/* ===================================================== */}

      <Dialog open={openCreateSubjectDialog} onClose={() => setOpenCreateSubjectDialog(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 2.5 } }}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 3, pb: 2 }}>
          <Box>
            <DialogTitle sx={{ p: 0, fontSize: 20, fontWeight: 600 }}>Novo Alvo</DialogTitle>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Alvos são entidades do sistema sobre as quais as permissões atuam.
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenCreateSubjectDialog(false)} size="small"
            sx={{ width: 40, height: 40, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
            <IconX size={18} />
          </IconButton>
        </Stack>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {subjectDialogError && <Alert severity="error" sx={{ mb: 2 }}>{subjectDialogError}</Alert>}
          <InputLabel sx={{ mb: 0.5 }}>Descrição *</InputLabel>
          <SubjectActionDescriptionField
            value={editSubjectDescription}
            onChange={setEditSubjectDescription}
            placeholder="Ex: usuario, produto, fatura"
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" color="secondary" onClick={() => setOpenCreateSubjectDialog(false)}
            sx={{ minWidth: 100, height: 40, borderRadius: 1.5 }}>Cancelar</Button>
          <Button variant="contained" onClick={() => handleCreateSubjectSave(editSubjectDescription)}
            disabled={editSubjectDescription.trim().length < 3}
            sx={{ minWidth: 140, height: 40, borderRadius: 1.5 }}>Salvar Alvo</Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================== */}
      {/* DIALOG EDITAR ALVO                                    */}
      {/* ===================================================== */}

      <Dialog open={openEditSubjectDialog} onClose={() => setOpenEditSubjectDialog(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 2.5 } }}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 3, pb: 2 }}>
          <DialogTitle sx={{ p: 0, fontSize: 20, fontWeight: 600 }}>Editar Alvo</DialogTitle>
          <IconButton onClick={() => setOpenEditSubjectDialog(false)} size="small"
            sx={{ width: 40, height: 40, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
            <IconX size={18} />
          </IconButton>
        </Stack>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {subjectDialogError && <Alert severity="error" sx={{ mb: 2 }}>{subjectDialogError}</Alert>}
          <InputLabel sx={{ mb: 0.5 }}>Descrição *</InputLabel>
          <SubjectActionDescriptionField
            value={editSubjectDescription}
            onChange={setEditSubjectDescription}
            placeholder="Ex: usuario, produto, fatura"
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" color="secondary" onClick={() => setOpenEditSubjectDialog(false)}
            sx={{ minWidth: 100, height: 40, borderRadius: 1.5 }}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditSubjectSave}
            disabled={editSubjectDescription.trim().length < 3}
            sx={{ minWidth: 140, height: 40, borderRadius: 1.5 }}>Atualizar Alvo</Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================== */}
      {/* DIALOG DELETAR ALVO                                   */}
      {/* ===================================================== */}

      <Dialog open={openDeleteSubjectDialog} onClose={() => setOpenDeleteSubjectDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 22, fontWeight: 600, px: 3, py: 2.5 }}>
          Excluir Alvo
          <IconButton size="small" onClick={() => setOpenDeleteSubjectDialog(false)}><IconX size={18} /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 4 }}>
          <Stack sx={{ alignItems: 'center', textAlign: 'center', gap: 2 }}>
            <Box sx={{ width: 120, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, bgcolor: 'grey.50', color: 'error.main' }}>
              <IconTrash size={56} stroke={1.2} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Tem certeza que deseja excluir?</Typography>
            <Typography variant="body1" color="text.secondary">
              O alvo <Typography component="span" color="primary.main" fontWeight={500}>{menuSubject?.description}</Typography> será excluído permanentemente.
              Permissões associadas a este alvo podem ser afetadas.
            </Typography>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" color="secondary" onClick={() => setOpenDeleteSubjectDialog(false)}
            sx={{ minWidth: 100, height: 40, borderRadius: 1.5 }}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDeleteSubjectConfirm}
            sx={{ minWidth: 140, height: 40, borderRadius: 1.5 }}>Excluir</Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================== */}
      {/* DIALOG CRIAR AÇÃO                                     */}
      {/* ===================================================== */}

      <Dialog open={openCreateActionDialog} onClose={() => setOpenCreateActionDialog(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 2.5 } }}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 3, pb: 2 }}>
          <Box>
            <DialogTitle sx={{ p: 0, fontSize: 20, fontWeight: 600 }}>Nova Ação</DialogTitle>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Ações definem o que pode ser feito sobre um alvo (ex: ler, criar, deletar).
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenCreateActionDialog(false)} size="small"
            sx={{ width: 40, height: 40, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
            <IconX size={18} />
          </IconButton>
        </Stack>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {actionDialogError && <Alert severity="error" sx={{ mb: 2 }}>{actionDialogError}</Alert>}
          <InputLabel sx={{ mb: 0.5 }}>Descrição *</InputLabel>
          <SubjectActionDescriptionField
            value={editActionDescription}
            onChange={setEditActionDescription}
            placeholder="Ex: ler, criar, atualizar, deletar"
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" color="secondary" onClick={() => setOpenCreateActionDialog(false)}
            sx={{ minWidth: 100, height: 40, borderRadius: 1.5 }}>Cancelar</Button>
          <Button variant="contained" onClick={() => handleCreateActionSave(editActionDescription)}
            disabled={editActionDescription.trim().length < 3}
            sx={{ minWidth: 140, height: 40, borderRadius: 1.5 }}>Salvar Ação</Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================== */}
      {/* DIALOG EDITAR AÇÃO                                    */}
      {/* ===================================================== */}

      <Dialog open={openEditActionDialog} onClose={() => setOpenEditActionDialog(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 2.5 } }}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 3, pb: 2 }}>
          <DialogTitle sx={{ p: 0, fontSize: 20, fontWeight: 600 }}>Editar Ação</DialogTitle>
          <IconButton onClick={() => setOpenEditActionDialog(false)} size="small"
            sx={{ width: 40, height: 40, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
            <IconX size={18} />
          </IconButton>
        </Stack>
        <Divider />
        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {actionDialogError && <Alert severity="error" sx={{ mb: 2 }}>{actionDialogError}</Alert>}
          <InputLabel sx={{ mb: 0.5 }}>Descrição *</InputLabel>
          <SubjectActionDescriptionField
            value={editActionDescription}
            onChange={setEditActionDescription}
            placeholder="Ex: ler, criar, atualizar, deletar"
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" color="secondary" onClick={() => setOpenEditActionDialog(false)}
            sx={{ minWidth: 100, height: 40, borderRadius: 1.5 }}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditActionSave}
            disabled={editActionDescription.trim().length < 3}
            sx={{ minWidth: 140, height: 40, borderRadius: 1.5 }}>Atualizar Ação</Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================== */}
      {/* DIALOG DELETAR AÇÃO                                   */}
      {/* ===================================================== */}

      <Dialog open={openDeleteActionDialog} onClose={() => setOpenDeleteActionDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 22, fontWeight: 600, px: 3, py: 2.5 }}>
          Excluir Ação
          <IconButton size="small" onClick={() => setOpenDeleteActionDialog(false)}><IconX size={18} /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, py: 4 }}>
          <Stack sx={{ alignItems: 'center', textAlign: 'center', gap: 2 }}>
            <Box sx={{ width: 120, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, bgcolor: 'grey.50', color: 'error.main' }}>
              <IconTrash size={56} stroke={1.2} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Tem certeza que deseja excluir?</Typography>
            <Typography variant="body1" color="text.secondary">
              A ação <Typography component="span" color="primary.main" fontWeight={500}>{menuAction?.description}</Typography> será excluída permanentemente.
              Permissões associadas a esta ação podem ser afetadas.
            </Typography>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" color="secondary" onClick={() => setOpenDeleteActionDialog(false)}
            sx={{ minWidth: 100, height: 40, borderRadius: 1.5 }}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDeleteActionConfirm}
            sx={{ minWidth: 140, height: 40, borderRadius: 1.5 }}>Excluir</Button>
        </DialogActions>
      </Dialog>

    </Stack>
  );
}
