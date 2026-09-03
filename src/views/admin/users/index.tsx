'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';

// @mui
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';
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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @icons
import {
  IconCamera,
  IconBan,
  IconCalendar,
  IconCheck,
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

// @project
import CreateUserDialog from '@/sections/users/CreateUserDialog';
import { getUsers } from '@/utils/api/users';

/***************************  MOCK DATA  ***************************/

interface UserRow {
  id: string;
  name: string;
  username: string;
  roles: string[];
  lastActivity: string;
  lastActivityDate: string;
  date: string;
  status: 'Ativo' | 'Pendente' | 'Bloqueado' | 'Denunciado';
}

const statusColorMap: Record<UserRow['status'], 'success' | 'warning' | 'error' | 'info'> = {
  Ativo: 'success',
  Pendente: 'warning',
  Bloqueado: 'error',
  Denunciado: 'info'
};

const mockUsers: UserRow[] = [
  {
    id: '1',
    name: 'Stacy Reichel',
    username: 'stacy_reichel.880',
    roles: ['Gestor', 'Admin', '+4 mais'],
    lastActivity: 'Criado',
    lastActivityDate: '19 dias atrás',
    date: '23 Jul 2025',
    status: 'Ativo'
  },
  {
    id: '2',
    name: 'Roderick Rohan',
    username: 'roderick.rohan',
    roles: ['Gerente', 'Admin', '+2 mais'],
    lastActivity: 'Desconectou',
    lastActivityDate: '20 dias atrás',
    date: '19 Jul 2025',
    status: 'Pendente'
  },
  {
    id: '3',
    name: 'Audrey Leffler MD',
    username: 'audrey_leffler',
    roles: ['Gerente', 'Admin', '+1 mais'],
    lastActivity: 'Cadastrado',
    lastActivityDate: '1 mês atrás',
    date: '19 Jul 2025',
    status: 'Denunciado'
  },
  {
    id: '4',
    name: 'Allison Mosciski',
    username: 'allison_mosciski',
    roles: ['Atendente', 'Developer', '+6 mais'],
    lastActivity: 'Criado',
    lastActivityDate: '19 dias atrás',
    date: '19 Jul 2025',
    status: 'Bloqueado'
  },
  {
    id: '5',
    name: 'Maureen Aufderhar',
    username: 'maureen_aufderhar',
    roles: ['Atendente', 'Engineer', '+2 mais'],
    lastActivity: 'Desconectou',
    lastActivityDate: '20 dias atrás',
    date: '18 Jul 2025',
    status: 'Ativo'
  }
];

/***************************  USERS - VIEW  ***************************/

interface UsersViewProps {
  showCreateButton?: boolean;
}

export default function UsersView({ showCreateButton = true }: UsersViewProps) {
  const [users, setUsers] = useState<UserRow[]>(mockUsers);

  // Carrega usuários reais do backend, mapeando UserResponseDTO -> UserRow.
  // Em caso de erro, mantém o mock.
  const reloadData = useCallback(async () => {
    const { data, error } = await getUsers();

    if (!error && Array.isArray(data)) {
      const mapped: UserRow[] = data.map((u: Record<string, unknown>) => {
        const isAtivo = u.isAtivo;
        const status: UserRow['status'] =
          isAtivo === false || isAtivo === 0 ? 'Bloqueado' : 'Ativo';
        const dataCadastro = u.dataCadastro ? String(u.dataCadastro) : '';

        return {
          id: String(u.id ?? ''),
          name: String(u.nomeCompleto || u.userName || u.email || ''),
          username: String(u.userName || u.email || ''),
          roles: [],
          lastActivity: 'Cadastrado',
          lastActivityDate: '',
          date: dataCadastro ? new Date(dataCadastro).toLocaleDateString('pt-BR') : '',
          status
        };
      });
      setUsers(mapped);
    }
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // Search
  const [search, setSearch] = useState('');

  // Filtro
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<UserRow['status'][]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Menu dos três pontinhos
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUser, setMenuUser] = useState<UserRow | null>(null);

  // Modal editar
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');

  const [editEmail, setEditEmail] = useState('');
  const [editCountryCode, setEditCountryCode] = useState('BR');
  const [editContact, setEditContact] = useState('');
  const [editAdmissionDate, setEditAdmissionDate] = useState('');
  const [editZipCode, setEditZipCode] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editStatus, setEditStatus] = useState<UserRow['status']>('Ativo');
  const [editRoles, setEditRoles] = useState<string[]>([]);

  // Modal bloquear
  const [openBlockDialog, setOpenBlockDialog] = useState(false);

  // Modal deletar
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const roles = ['Gestor', 'Admin', 'Gerente', 'Atendente', 'Developer', 'Engineer'];

  const statuses: UserRow['status'][] = ['Ativo', 'Pendente', 'Denunciado', 'Bloqueado'];

  const allSelected = selected.length === users.length && users.length > 0;

  /*************************** MENU ***************************/

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: UserRow) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  /*************************** EDITAR ***************************/

  const handleEditOpen = () => {
    if (!menuUser) return;

    const nameParts = menuUser.name.trim().split(' ');

    setEditName(nameParts[0] || '');
    setEditUsername(menuUser.username);

    setEditEmail('');
    setEditCountryCode('BR');
    setEditContact('');
    setEditAdmissionDate('');
    setEditZipCode('');
    setEditAddress('');

    setEditStatus(menuUser.status);

    setEditRoles(menuUser.roles.filter((role) => !role.startsWith('+')));

    handleMenuClose();
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handleEditSave = () => {
    if (!menuUser) return;

    setUsers((current) =>
      current.map((user) =>
        user.id === menuUser.id
          ? {
              ...user,
              name: editName.trim() || user.name,
              username: editUsername.trim() || user.username,
              status: editStatus,
              roles: editRoles.length > 0 ? editRoles : user.roles
            }
          : user
      )
    );

    setOpenEditDialog(false);
    setMenuUser(null);
  };

  /*************************** BLOQUEAR ***************************/

  const handleBlockOpen = () => {
    handleMenuClose();
    setOpenBlockDialog(true);
  };

  const handleBlockClose = () => {
    setOpenBlockDialog(false);
  };

  const handleBlockConfirm = () => {
    if (!menuUser) return;

    setUsers((current) =>
      current.map((user) =>
        user.id === menuUser.id
          ? {
              ...user,
              status: 'Bloqueado'
            }
          : user
      )
    );

    setOpenBlockDialog(false);
    setMenuUser(null);
  };

  /*************************** DELETAR ***************************/

  const handleDeleteOpen = () => {
    handleMenuClose();
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = () => {
    if (!menuUser) return;

    setUsers((current) => current.filter((user) => user.id !== menuUser.id));

    setSelected((current) => current.filter((id) => id !== menuUser.id));

    setOpenDeleteDialog(false);
    setMenuUser(null);
  };

  /*************************** SELEÇÃO ***************************/

  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(users.map((user) => user.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  /*************************** FILTROS ***************************/

  const toggleRole = (role: string) => {
    setSelectedRoles((current) => (current.includes(role) ? current.filter((item) => item !== role) : [...current, role]));
  };

  const toggleStatus = (status: UserRow['status']) => {
    setSelectedStatuses((current) => (current.includes(status) ? current.filter((item) => item !== status) : [...current, status]));
  };

  const handleResetFilters = () => {
    setSelectedRoles([]);
    setSelectedStatuses([]);
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const handleApplyFilters = () => {
    setPage(1);
    setOpenFilter(false);
  };

  const handleRemoveIndividualFilter = (filter: string, type: 'role' | 'status' | 'dateFrom' | 'dateTo') => {
    if (type === 'role') {
      setSelectedRoles((current) => current.filter((item) => item !== filter));
    } else if (type === 'status') {
      setSelectedStatuses((current) => current.filter((item) => item !== filter));
    } else if (type === 'dateFrom') {
      setDateFrom('');
    } else if (type === 'dateTo') {
      setDateTo('');
    }
    setPage(1);
  };

  const handleClearAllFilters = () => {
    setSelectedRoles([]);
    setSelectedStatuses([]);
    setDateFrom('');
    setDateTo('');
    setSearch('');
    setPage(1);
  };

  const hasActiveFilters =
    search.trim() !== '' || selectedRoles.length > 0 || selectedStatuses.length > 0 || dateFrom !== '' || dateTo !== '';

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const normalizedSearch = search.trim().toLowerCase();

      const matchesSearch =
        normalizedSearch === '' ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.username.toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) {
        return false;
      }

      const matchesRole = selectedRoles.length === 0 || user.roles.some((role) => selectedRoles.includes(role));

      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(user.status);

      const userDate = new Date(user.date);

      const matchesFrom = !dateFrom || userDate >= new Date(`${dateFrom}T00:00:00`);

      const matchesTo = !dateTo || userDate <= new Date(`${dateTo}T23:59:59`);

      return matchesRole && matchesStatus && matchesFrom && matchesTo;
    });
  }, [users, search, selectedRoles, selectedStatuses, dateFrom, dateTo]);

  return (
    <Stack
      sx={{
        gap: showCreateButton ? 2.5 : 0,
        position: 'relative'
      }}
    >
      {/* CABEÇALHO */}
      {showCreateButton && (
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
            Usuários
          </Typography>

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
        </Stack>
      )}
      <Card sx={{ p: 0 }}>
        {/* PESQUISA + FILTRO */}
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
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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
                      setPage(1);
                    }}
                    sx={{ p: 0.5 }}
                  >
                    <IconX size={14} />
                  </IconButton>
                </InputAdornment>
              )
            }
            sx={{ width: 280 }}
          />

          <Button variant="outlined" color="primary" startIcon={<IconFilter size={16} />} onClick={() => setOpenFilter(true)}>
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
                    setPage(1);
                  }}
                  sx={{
                    height: 28,
                    fontSize: 13
                  }}
                />
              )}

              {selectedRoles.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  size="small"
                  onDelete={() => handleRemoveIndividualFilter(role, 'role')}
                  sx={{
                    height: 28,
                    fontSize: 13
                  }}
                />
              ))}

              {selectedStatuses.map((status) => (
                <Chip
                  key={status}
                  label={status}
                  size="small"
                  onDelete={() => handleRemoveIndividualFilter(status, 'status')}
                  sx={{
                    height: 28,
                    fontSize: 13
                  }}
                />
              ))}

              {dateFrom && (
                <Chip
                  label={`De: ${dateFrom}`}
                  size="small"
                  onDelete={() => handleRemoveIndividualFilter(dateFrom, 'dateFrom')}
                  sx={{
                    height: 28,
                    fontSize: 13
                  }}
                />
              )}

              {dateTo && (
                <Chip
                  label={`Até: ${dateTo}`}
                  size="small"
                  onDelete={() => handleRemoveIndividualFilter(dateTo, 'dateTo')}
                  sx={{
                    height: 28,
                    fontSize: 13
                  }}
                />
              )}
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

        {/* TABELA */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox checked={filteredUsers.length > 0 && selected.length === filteredUsers.length} onChange={handleSelectAll} />
                </TableCell>

                <TableCell>Perfil</TableCell>
                <TableCell>Papéis</TableCell>
                <TableCell>Última atividade</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(user.id)} onChange={() => handleSelectOne(user.id)} />
                  </TableCell>

                  <TableCell>
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: 'center',
                        gap: 1.5
                      }}
                    >
                      <Avatar sx={{ width: 32, height: 32 }}>{user.name.charAt(0)}</Avatar>

                      <Box>
                        <Typography variant="subtitle2">{user.name}</Typography>

                        <Typography variant="caption" color="text.secondary">
                          {user.username}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Stack
                      direction="row"
                      sx={{
                        gap: 0.5,
                        flexWrap: 'wrap'
                      }}
                    >
                      {user.roles.map((role) => (
                        <Chip key={role} label={role} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{user.lastActivity}</Typography>

                    <Typography variant="caption" color="text.secondary">
                      {user.lastActivityDate}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{user.date}</Typography>
                  </TableCell>

                  <TableCell>
                    <Chip label={user.status} size="small" color={statusColorMap[user.status]} />
                  </TableCell>

                  {/* TRÊS PONTINHOS */}
                  <TableCell align="right">
                    <IconButton size="small" onClick={(event) => handleMenuOpen(event, user)}>
                      <IconDotsVertical size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      Nenhum usuário encontrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINAÇÃO */}
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
            count={10}
            page={page}
            onChange={(_, value) => setPage(value)}
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
      </Card>

      {/* ========================================================= */}
      {/* MENU DOS TRÊS PONTINHOS                                  */}
      {/* ========================================================= */}

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
          onClick={handleEditOpen}
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
          onClick={handleBlockOpen}
          sx={{
            gap: 1.5,
            py: 1.25,
            px: 2
          }}
        >
          <IconBan size={18} />
          <Typography variant="body2">Bloquear</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleDeleteOpen}
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

      {/* ========================================================= */}
      {/* MODAL EDITAR USUÁRIO                                     */}
      {/* ========================================================= */}

      <Dialog
        open={openEditDialog}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: 'calc(100vh - 32px)'
          }
        }}
      >
        {/* CABEÇALHO */}
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
              Editar usuário
            </DialogTitle>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                maxWidth: 430
              }}
            >
              Edite as informações, configurações e permissões personalizadas do usuário.
            </Typography>
          </Box>

          <IconButton onClick={handleEditClose} size="small">
            <IconX size={18} />
          </IconButton>
        </Stack>

        <Divider sx={{ mt: 2 }} />

        <DialogContent
          sx={{
            px: 2,
            py: 2.5,
            overflowY: 'auto'
          }}
        >
          <Stack sx={{ gap: 2.5 }}>
            {/* DADOS PESSOAIS */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                Dados Pessoais
              </Typography>

              <Box
                sx={{
                  position: 'relative',
                  width: 64,
                  height: 64
                }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'error.light',
                    color: 'error.main',
                    fontSize: 22
                  }}
                >
                  {editName.charAt(0).toUpperCase()}
                </Avatar>

                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    width: 34,
                    height: 34,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    color: 'error.main',

                    '&:hover': {
                      bgcolor: 'background.paper'
                    }
                  }}
                >
                  <IconCamera size={15} />
                </IconButton>
              </Box>
            </Box>

            {/* NOME + SOBRENOME */}
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <InputLabel>Nome</InputLabel>

                <OutlinedInput value={editName} onChange={(event) => setEditName(event.target.value)} placeholder="ex. John" fullWidth />
              </Box>

              <Box sx={{ flex: 1 }}>
                <InputLabel>Sobrenome</InputLabel>

                <OutlinedInput placeholder="ex. Doe" fullWidth />
              </Box>
            </Stack>

            {/* NOME DE USUÁRIO */}
            <Box>
              <InputLabel>Nome de usuário</InputLabel>

              <OutlinedInput
                value={editUsername}
                onChange={(event) => setEditUsername(event.target.value)}
                placeholder="ex. john.doe"
                fullWidth
              />
            </Box>

            {/* E-MAIL */}
            <Box>
              <InputLabel>E-mail *</InputLabel>

              <OutlinedInput
                value={editEmail}
                onChange={(event) => setEditEmail(event.target.value)}
                placeholder="exemplo@gmail.com"
                fullWidth
              />
            </Box>

            {/* CONTATO + DATA */}
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <InputLabel>Contato *</InputLabel>

                <Stack direction="row" sx={{ gap: 1 }}>
                  <Select
                    value={editCountryCode}
                    onChange={(event) => setEditCountryCode(event.target.value)}
                    size="small"
                    sx={{
                      minWidth: 92
                    }}
                  >
                    <MenuItem value="BR">BR +55</MenuItem>

                    <MenuItem value="US">US +1</MenuItem>

                    <MenuItem value="PT">PT +351</MenuItem>
                  </Select>

                  <OutlinedInput
                    value={editContact}
                    onChange={(event) => setEditContact(event.target.value)}
                    placeholder="ex. 9876x xxxxx"
                    fullWidth
                  />
                </Stack>
              </Box>

              <Box sx={{ flex: 1 }}>
                <InputLabel>Data de Admissão *</InputLabel>

                <OutlinedInput
                  value={editAdmissionDate}
                  onChange={(event) => setEditAdmissionDate(event.target.value)}
                  type="date"
                  fullWidth
                />
              </Box>
            </Stack>

            {/* CEP */}
            <Box>
              <InputLabel>CEP</InputLabel>

              <OutlinedInput
                value={editZipCode}
                onChange={(event) => setEditZipCode(event.target.value)}
                placeholder="00000-000"
                fullWidth
              />
            </Box>

            {/* ENDEREÇO */}
            <Box>
              <InputLabel>Endereço</InputLabel>

              <TextField
                value={editAddress}
                onChange={(event) => setEditAddress(event.target.value)}
                placeholder="Insira um endereço..."
                fullWidth
                multiline
                minRows={2}
              />
            </Box>

            {/* STATUS */}
            <Box>
              <InputLabel sx={{ mb: 1 }}>Status</InputLabel>

              <RadioGroup
                value={editStatus}
                onChange={(event) => setEditStatus(event.target.value as UserRow['status'])}
                row
                sx={{
                  gap: 1.5,
                  flexWrap: 'wrap'
                }}
              >
                <FormControlLabel value="Ativo" control={<Radio size="small" />} label="Ativo" />

                <FormControlLabel value="Pendente" control={<Radio size="small" />} label="Pendente" />

                <FormControlLabel value="Denunciado" control={<Radio size="small" />} label="Denunciado" />

                <FormControlLabel value="Bloqueado" control={<Radio size="small" />} label="Bloqueado" />
              </RadioGroup>
            </Box>

            {/* PAPÉIS */}
            <Box>
              <InputLabel sx={{ mb: 1 }}>Papéis (Opcional)</InputLabel>

              <Stack
                direction="row"
                sx={{
                  gap: 0.75,
                  flexWrap: 'wrap'
                }}
              >
                {roles.map((role) => {
                  const selectedRole = editRoles.includes(role);

                  return (
                    <Chip
                      key={role}
                      label={role}
                      size="small"
                      variant={selectedRole ? 'filled' : 'outlined'}
                      onClick={() => {
                        setEditRoles((current) => (current.includes(role) ? current.filter((item) => item !== role) : [...current, role]));
                      }}
                      sx={{
                        cursor: 'pointer'
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <Divider />

        {/* RODAPÉ */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            justifyContent: 'flex-end',
            gap: 1
          }}
        >
          <Button variant="outlined" color="secondary" onClick={handleEditClose}>
            Cancelar
          </Button>

          <Button variant="contained" color="error" onClick={handleEditSave}>
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL BLOQUEAR USUÁRIO                                   */}
      {/* ========================================================= */}

      <Dialog
        open={openBlockDialog}
        onClose={handleBlockClose}
        maxWidth="xs"
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
            justifyContent: 'space-between'
          }}
        >
          Bloquear usuário
          <IconButton size="small" onClick={handleBlockClose}>
            <IconX size={18} />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ py: 3 }}>
          <Stack
            sx={{
              alignItems: 'center',
              textAlign: 'center',
              gap: 2
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'warning.lighter',
                color: 'warning.main'
              }}
            >
              <IconBan size={28} />
            </Avatar>

            <Typography variant="h6">Tem certeza que deseja bloquear?</Typography>

            <Typography variant="body2" color="text.secondary">
              {menuUser && (
                <>
                  O usuário <strong>{menuUser.name}</strong> será bloqueado e não poderá acessar o sistema.
                </>
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
          <Button variant="outlined" onClick={handleBlockClose}>
            Cancelar
          </Button>

          <Button variant="contained" color="warning" onClick={handleBlockConfirm}>
            Bloquear
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL DELETAR USUÁRIO                                    */}
      {/* ========================================================= */}

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteClose}
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
          Deletar usuário
          <IconButton size="small" onClick={handleDeleteClose}>
            <IconX size={18} />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ px: 3, py: 4 }}>
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
                bgcolor: 'grey.50'
              }}
            >
              <IconTrash size={72} stroke={1.2} color="currentColor" />
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600
              }}
            >
              Tem certeza que deseja deletar?
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 500
              }}
            >
              {menuUser ? (
                <>
                  Ao deletar o usuário{' '}
                  <Typography component="span" color="primary.main" fontWeight={500}>
                    {menuUser.name}
                  </Typography>{' '}
                  todos os registros relacionados serão removidos. Tenha cuidado com esta ação.
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
          <Button variant="outlined" onClick={handleDeleteClose}>
            Cancelar
          </Button>

          <Button variant="contained" color="error" startIcon={<IconTrash size={18} />} onClick={handleDeleteConfirm}>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL DE FILTRO                                          */}
      {/* ========================================================= */}

      <Dialog
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        PaperProps={{
          sx: {
            width: 352,
            maxWidth: 'calc(100% - 32px)',
            borderRadius: 1.5
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* CABEÇALHO */}
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1.5
            }}
          >
            <Typography variant="subtitle1">Filtrar</Typography>

            <IconButton size="small" onClick={() => setOpenFilter(false)}>
              <IconX size={18} />
            </IconButton>
          </Stack>

          <Divider />

          <Stack sx={{ p: 2, gap: 2.5 }}>
            {/* PESQUISA DOS FILTROS */}
            <OutlinedInput
              size="small"
              placeholder="Pesquisar filtros"
              startAdornment={
                <InputAdornment position="start">
                  <IconSearch size={15} />
                </InputAdornment>
              }
              fullWidth
            />

            {/* PAPÉIS */}
            <Stack sx={{ gap: 1 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Papel
                </Typography>

                {selectedRoles.length > 0 && (
                  <Chip
                    label={`${selectedRoles.length} selecionado${selectedRoles.length > 1 ? 's' : ''}`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 22 }}
                  />
                )}
              </Stack>

              {roles.map((role) => (
                <Stack
                  key={role}
                  direction="row"
                  onClick={() => toggleRole(role)}
                  sx={{
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  <Checkbox
                    size="small"
                    checked={selectedRoles.includes(role)}
                    icon={
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 0.5
                        }}
                      />
                    }
                    checkedIcon={
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'primary.main',
                          color: 'white'
                        }}
                      >
                        <IconCheck size={11} />
                      </Box>
                    }
                    sx={{ p: 0.5 }}
                  />

                  <Typography variant="body2">{role}</Typography>
                </Stack>
              ))}
            </Stack>

            {/* STATUS */}
            <Stack sx={{ gap: 1 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>

                {selectedStatuses.length > 0 && (
                  <Chip
                    label={`${selectedStatuses.length} selecionado${selectedStatuses.length > 1 ? 's' : ''}`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 22 }}
                  />
                )}
              </Stack>

              {statuses.map((status) => (
                <Stack
                  key={status}
                  direction="row"
                  onClick={() => toggleStatus(status)}
                  sx={{
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'pointer'
                  }}
                >
                  <Checkbox
                    size="small"
                    checked={selectedStatuses.includes(status)}
                    icon={
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 0.5
                        }}
                      />
                    }
                    checkedIcon={
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'primary.main',
                          color: 'white'
                        }}
                      >
                        <IconCheck size={11} />
                      </Box>
                    }
                    sx={{ p: 0.5 }}
                  />

                  <Typography variant="body2">{status}</Typography>
                </Stack>
              ))}
            </Stack>

            {/* DATA */}
            <Stack sx={{ gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Data
              </Typography>

              <Stack direction="row" sx={{ gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="De"
                  type="date"
                  value={dateFrom}
                  onChange={(event) => setDateFrom(event.target.value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true
                    },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconCalendar size={16} />
                        </InputAdornment>
                      )
                    }
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Até"
                  type="date"
                  value={dateTo}
                  onChange={(event) => setDateTo(event.target.value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true
                    },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconCalendar size={16} />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Stack>
            </Stack>
          </Stack>

          <Divider />

          {/* RODAPÉ */}
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1.5
            }}
          >
            <Button variant="text" color="secondary" onClick={handleResetFilters}>
              Resetar
            </Button>

            <Button variant="contained" onClick={handleApplyFilters}>
              Aplicar
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL CRIAR USUÁRIO                                     */}
      {/* ========================================================= */}

      <CreateUserDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreate={(data) => {
          // O usuário já foi persistido no backend (POST /api/users) pelo diálogo.
          // Aqui apenas recebemos o retorno para eventual atualização de UI.
          console.log('Usuário criado:', data);
        }}
      />
    </Stack>
  );
}
