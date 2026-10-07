'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

// @mui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
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
import Typography from '@mui/material/Typography';

// @icons
import {
  IconBan,
  IconCertificate,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFilter,
  IconPlus,
  IconSearch,
  IconTrash,
  IconX
} from '@tabler/icons-react';

// @project
import EditLeadDialog, { EditableLead } from '@/sections/leads/EditLeadDialog';
import CreateLeadCertificacaoDialog from '@/sections/leads-certificacao/CreateLeadCertificacaoDialog';
import ManageCertificacaoDialog from '@/sections/leads-certificacao/ManageCertificacaoDialog';
import LeadCertificacaoDetailsDialog, { LeadCertificacaoDetails } from '@/sections/leads-certificacao/LeadCertificacaoDetailsDialog';
import { deleteLead, getLeads, updateLead } from '@/utils/api/lead';
import { openSnackbar } from '@/states/snackbar';

// @types
import { EnumSetorEmpresa, EnumTipoPropostaLead, LeadDTO, enumToSetor } from '@/types/lead';
import { SnackbarProps } from '@/types/snackbar';

/***************************  TYPES  ***************************/

interface LeadRow {
  id: number;
  nomeContato: string;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
  whatsapp: string;
  comoPodemosAjudar: string;
  tipoProposta: EnumTipoPropostaLead;
  setor: EnumSetorEmpresa;
  isAtivo: boolean;
  isAceitaPoliticaPrivacidade: boolean;
  hasCertificacao: boolean;
}

type ActiveStatus = 'Ativo' | 'Inativo';
type ComplementarStatus = 'Enviada' | 'Pendente';

/***************************  HELPERS  ***************************/

function mapDTOToRow(dto: LeadDTO): LeadRow {
  return {
    id: dto.id,
    nomeContato: dto.nomeContato,
    empresa: dto.empresa,
    cargo: dto.cargo,
    email: dto.email,
    telefone: dto.telefone,
    whatsapp: dto.whatsapp,
    comoPodemosAjudar: dto.comoPodemosAjudar,
    tipoProposta: dto.tipoProposta,
    setor: dto.setor,
    isAtivo: dto.isAtivo,
    isAceitaPoliticaPrivacidade: !!dto.isAceitaPoliticaPrivacidade,
    hasCertificacao: !!dto.certificacao
  };
}

function rowToEditableLead(row: LeadRow): EditableLead {
  return {
    id: row.id,
    tipoProposta: 'certificacao',
    nomeContato: row.nomeContato,
    empresa: row.empresa,
    setor: enumToSetor(row.setor),
    cargo: row.cargo,
    email: row.email,
    telefone: row.telefone,
    whatsapp: row.whatsapp,
    comoPodemosAjudar: row.comoPodemosAjudar,
    aceitaPoliticaPrivacidade: row.isAceitaPoliticaPrivacidade,
    isAtivo: row.isAtivo
  };
}

function rowToDetails(row: LeadRow): LeadCertificacaoDetails {
  return { ...row };
}

/***************************  LEADS DE CERTIFICACAO - VIEW  ***************************/

export default function LeadsCertificacaoView() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const reloadData = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await getLeads({ page: 1, pageSize: 1000 });

    if (!error && data) {
      setLeads(data.items.map(mapDTOToRow).filter((row) => row.tipoProposta === EnumTipoPropostaLead.Certificacao));
    } else if (error) {
      openSnackbar({ open: true, message: error, variant: 'alert', severity: 'error', alert: { color: 'error' } } as SnackbarProps);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Pesquisa
  const [search, setSearch] = useState('');

  // Filtro
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<ActiveStatus[]>([]);
  const [selectedComplementar, setSelectedComplementar] = useState<ComplementarStatus[]>([]);

  // Menu dos três pontinhos
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuLead, setMenuLead] = useState<LeadRow | null>(null);

  // Modal de criação
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // Modal de detalhes
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [detailsLead, setDetailsLead] = useState<LeadCertificacaoDetails | null>(null);

  // Modal de edição
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingLead, setEditingLead] = useState<EditableLead | null>(null);

  // Modal de gestão da certificação
  const [openManageDialog, setOpenManageDialog] = useState(false);
  const [managingLead, setManagingLead] = useState<LeadRow | null>(null);

  // Modal ativar/desativar
  const [openToggleActiveDialog, setOpenToggleActiveDialog] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState(false);

  // Modal excluir
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /*************************** MENU ***************************/

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, lead: LeadRow) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuLead(lead);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  /*************************** DETALHES ***************************/

  const openDetails = (lead: LeadRow) => {
    setDetailsLead(rowToDetails(lead));
    setOpenDetailsDialog(true);
  };

  const handleRowClick = (lead: LeadRow) => {
    openDetails(lead);
  };

  const handleViewDetailsFromMenu = () => {
    if (!menuLead) return;
    openDetails(menuLead);
    handleMenuClose();
  };

  const handleDetailsClose = () => {
    setOpenDetailsDialog(false);
    setDetailsLead(null);
  };

  /*************************** EDITAR ***************************/

  const handleEditOpen = () => {
    if (!menuLead) return;
    setEditingLead(rowToEditableLead(menuLead));
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setEditingLead(null);
    setMenuLead(null);
  };

  /*************************** GERENCIAR CERTIFICACAO ***************************/

  const handleManageOpen = () => {
    if (!menuLead) return;
    setManagingLead(menuLead);
    setOpenManageDialog(true);
    handleMenuClose();
  };

  const handleManageClose = () => {
    setOpenManageDialog(false);
    setManagingLead(null);
    setMenuLead(null);
  };

  /*************************** ATIVAR / DESATIVAR ***************************/

  const handleToggleActiveOpen = () => {
    handleMenuClose();
    setOpenToggleActiveDialog(true);
  };

  const handleToggleActiveClose = () => {
    setOpenToggleActiveDialog(false);
  };

  const handleToggleActiveConfirm = async () => {
    if (!menuLead) return;

    setIsTogglingActive(true);

    const payload = {
      ...rowToEditableLead(menuLead),
      isAtivo: !menuLead.isAtivo
    };
    const { id, ...formData } = payload;
    const { error } = await updateLead(id, formData);

    setIsTogglingActive(false);

    if (error) {
      openSnackbar({ open: true, message: error, variant: 'alert', severity: 'error', alert: { color: 'error' } } as SnackbarProps);
      return;
    }

    await reloadData();
    setOpenToggleActiveDialog(false);
    setMenuLead(null);
    openSnackbar({
      open: true,
      message: menuLead.isAtivo ? 'Lead desativada com sucesso' : 'Lead ativada com sucesso',
      variant: 'alert',
      severity: 'success',
      alert: { color: 'success' }
    } as SnackbarProps);
  };

  /*************************** EXCLUIR ***************************/

  const handleDeleteOpen = () => {
    handleMenuClose();
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = async () => {
    if (!menuLead) return;

    setIsDeleting(true);
    const { error } = await deleteLead(menuLead.id);
    setIsDeleting(false);

    if (error) {
      openSnackbar({ open: true, message: error, variant: 'alert', severity: 'error', alert: { color: 'error' } } as SnackbarProps);
      return;
    }

    await reloadData();
    setOpenDeleteDialog(false);
    setMenuLead(null);
    openSnackbar({
      open: true,
      message: 'Lead de certificação excluída com sucesso',
      variant: 'alert',
      severity: 'success',
      alert: { color: 'success' }
    } as SnackbarProps);
  };

  /*************************** FILTROS ***************************/

  const toggleStatus = (status: ActiveStatus) => {
    setSelectedStatuses((current) => (current.includes(status) ? current.filter((item) => item !== status) : [...current, status]));
  };

  const toggleComplementar = (status: ComplementarStatus) => {
    setSelectedComplementar((current) => (current.includes(status) ? current.filter((item) => item !== status) : [...current, status]));
  };

  const handleResetFilters = () => {
    setSelectedStatuses([]);
    setSelectedComplementar([]);
    setPage(1);
  };

  const handleApplyFilters = () => {
    setPage(1);
    setOpenFilter(false);
  };

  const handleRemoveIndividualFilter = (type: 'status' | 'complementar', value: string) => {
    if (type === 'status') {
      setSelectedStatuses((current) => current.filter((item) => item !== value));
    } else if (type === 'complementar') {
      setSelectedComplementar((current) => current.filter((item) => item !== value));
    }
    setPage(1);
  };

  const handleClearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedComplementar([]);
    setSearch('');
    setPage(1);
  };

  const hasActiveFilters = search.trim() !== '' || selectedStatuses.length > 0 || selectedComplementar.length > 0;

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const normalizedSearch = search.trim().toLowerCase();

      const matchesSearch =
        normalizedSearch === '' ||
        lead.nomeContato.toLowerCase().includes(normalizedSearch) ||
        lead.empresa.toLowerCase().includes(normalizedSearch) ||
        lead.email.toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) return false;

      const leadStatus: ActiveStatus = lead.isAtivo ? 'Ativo' : 'Inativo';
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(leadStatus);

      const leadComplementar: ComplementarStatus = lead.hasCertificacao ? 'Enviada' : 'Pendente';
      const matchesComplementar = selectedComplementar.length === 0 || selectedComplementar.includes(leadComplementar);

      return matchesStatus && matchesComplementar;
    });
  }, [leads, search, selectedStatuses, selectedComplementar]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / rowsPerPage));
  const paginatedLeads = filteredLeads.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  return (
    <Stack sx={{ gap: 2.5, position: 'relative' }}>
      {/* CABEÇALHO */}
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', minHeight: 40 }}>
        <Typography variant="h5" sx={{ lineHeight: '40px' }}>
          Leads de Certificação
        </Typography>

        <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={() => setOpenCreateDialog(true)}>
          Nova Lead de Certificação
        </Button>
      </Stack>

      <Card sx={{ p: 0 }}>
        {/* PESQUISA + FILTRO */}
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <OutlinedInput
            size="small"
            placeholder="Pesquise por nome, empresa ou e-mail"
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
            sx={{ width: 320 }}
          />

          <Button variant="outlined" color="primary" startIcon={<IconFilter size={16} />} onClick={() => setOpenFilter(true)}>
            Filtrar
          </Button>
        </Stack>

        {/* FILTROS ATIVOS */}
        {hasActiveFilters && (
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2, pt: 0 }}>
            <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap', flex: 1 }}>
              {search.trim() !== '' && (
                <Chip
                  label={`Busca: "${search}"`}
                  size="small"
                  onDelete={() => {
                    setSearch('');
                    setPage(1);
                  }}
                  sx={{ height: 28, fontSize: 13 }}
                />
              )}

              {selectedStatuses.map((status) => (
                <Chip
                  key={status}
                  label={status}
                  size="small"
                  onDelete={() => handleRemoveIndividualFilter('status', status)}
                  sx={{ height: 28, fontSize: 13 }}
                />
              ))}

              {selectedComplementar.map((status) => (
                <Chip
                  key={status}
                  label={`Complemento: ${status}`}
                  size="small"
                  onDelete={() => handleRemoveIndividualFilter('complementar', status)}
                  sx={{ height: 28, fontSize: 13 }}
                />
              ))}
            </Stack>

            <Button variant="text" size="small" onClick={handleClearAllFilters} sx={{ ml: 1, fontSize: 13, color: 'text.secondary' }}>
              Limpar tudo
            </Button>
          </Stack>
        )}

        {/* TABELA */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Contato</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Dados de Certificação</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  hover
                  onClick={() => handleRowClick(lead)}
                  sx={{
                    cursor: 'pointer',
                    ...(lead.isAtivo ? {} : { opacity: 0.6, backgroundColor: 'action.disabledBackground' })
                  }}
                >
                  <TableCell>
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>{lead.nomeContato?.charAt(0) || 'L'}</Avatar>
                      <Box>
                        <Typography variant="subtitle2">{lead.nomeContato}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {lead.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{lead.empresa}</Typography>
                  </TableCell>

                  <TableCell>
                    <Chip label={lead.isAtivo ? 'Ativo' : 'Inativo'} size="small" color={lead.isAtivo ? 'success' : 'error'} />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={lead.hasCertificacao ? 'Enviados' : 'Pendentes'}
                      size="small"
                      color={lead.hasCertificacao ? 'info' : 'warning'}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleMenuOpen(event, lead);
                      }}
                    >
                      <IconDotsVertical size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {!isLoading && paginatedLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      Nenhuma lead de certificação encontrada.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Stack sx={{ alignItems: 'center', py: 4 }}>
                      <CircularProgress size={24} />
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINAÇÃO */}
        <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center', p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            siblingCount={1}
            boundaryCount={1}
            renderItem={(item) => {
              if (item.type === 'previous') {
                return (
                  <PaginationItem
                    {...item}
                    slots={{
                      previous: () => (
                        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', gap: 0.5, whiteSpace: 'nowrap' }}>
                          <IconChevronLeft size={16} />
                          <span>Anterior</span>
                        </Stack>
                      )
                    }}
                    sx={{ width: 82, minWidth: 82, height: 32, px: 1, borderRadius: 1, fontSize: '14px', flexShrink: 0, '&.Mui-disabled': { opacity: 0.45 } }}
                  />
                );
              }

              if (item.type === 'next') {
                return (
                  <PaginationItem
                    {...item}
                    slots={{
                      next: () => (
                        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', gap: 0.5, whiteSpace: 'nowrap' }}>
                          <span>Próximo</span>
                          <IconChevronRight size={16} />
                        </Stack>
                      )
                    }}
                    sx={{ width: 82, minWidth: 82, height: 32, px: 1, borderRadius: 1, fontSize: '14px', flexShrink: 0, '&.Mui-disabled': { opacity: 0.45 } }}
                  />
                );
              }

              return (
                <PaginationItem
                  {...item}
                  sx={{ width: item.type === 'page' ? 32 : 'auto', minWidth: item.type === 'page' ? 32 : 32, height: 32, borderRadius: 1, fontSize: '14px', flexShrink: 0 }}
                />
              );
            }}
            sx={{ '& .MuiPagination-ul': { alignItems: 'center', justifyContent: 'center', gap: 0.5, flexWrap: 'nowrap' } }}
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: { sx: { mt: 0.5, minWidth: 220, borderRadius: 2, boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.12)', overflow: 'hidden' } }
        }}
      >
        <MenuItem onClick={handleViewDetailsFromMenu} sx={{ gap: 1.5, py: 1.25, px: 2 }}>
          <IconEye size={18} />
          <Typography variant="body2">Ver detalhes</Typography>
        </MenuItem>

        <MenuItem onClick={handleEditOpen} sx={{ gap: 1.5, py: 1.25, px: 2 }}>
          <IconEdit size={18} />
          <Typography variant="body2">Editar lead</Typography>
        </MenuItem>

        <MenuItem onClick={handleManageOpen} sx={{ gap: 1.5, py: 1.25, px: 2 }}>
          <IconCertificate size={18} />
          <Typography variant="body2">Gerenciar certificação</Typography>
        </MenuItem>

        {menuLead?.isAtivo ? (
          <MenuItem onClick={handleToggleActiveOpen} sx={{ gap: 1.5, py: 1.25, px: 2, color: 'warning.main' }}>
            <IconBan size={18} />
            <Typography variant="body2">Desativar</Typography>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleToggleActiveOpen} sx={{ gap: 1.5, py: 1.25, px: 2, color: 'success.main' }}>
            <IconCheck size={18} />
            <Typography variant="body2">Ativar</Typography>
          </MenuItem>
        )}

        <MenuItem onClick={handleDeleteOpen} sx={{ gap: 1.5, py: 1.25, px: 2, color: 'error.main' }}>
          <IconTrash size={18} />
          <Typography variant="body2">Excluir</Typography>
        </MenuItem>
      </Menu>

      {/* ========================================================= */}
      {/* MODAL CRIAR LEAD DE CERTIFICACAO                         */}
      {/* ========================================================= */}

      <CreateLeadCertificacaoDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreated={() => {
          setOpenCreateDialog(false);
          reloadData();
        }}
      />

      {/* ========================================================= */}
      {/* MODAL DETALHES DO LEAD                                   */}
      {/* ========================================================= */}

      <LeadCertificacaoDetailsDialog open={openDetailsDialog} onClose={handleDetailsClose} lead={detailsLead} />

      {/* ========================================================= */}
      {/* MODAL EDITAR LEAD                                        */}
      {/* ========================================================= */}

      <EditLeadDialog
        open={openEditDialog}
        lead={editingLead}
        onClose={handleEditClose}
        onUpdated={() => {
          handleEditClose();
          reloadData();
        }}
      />

      {/* ========================================================= */}
      {/* MODAL GERENCIAR CERTIFICACAO                             */}
      {/* ========================================================= */}

      <ManageCertificacaoDialog
        open={openManageDialog}
        onClose={handleManageClose}
        leadId={managingLead?.id ?? null}
        leadNomeContato={managingLead?.nomeContato}
        onSaved={() => {
          handleManageClose();
          reloadData();
        }}
      />

      {/* ========================================================= */}
      {/* MODAL ATIVAR / DESATIVAR LEAD                            */}
      {/* ========================================================= */}

      <Dialog open={openToggleActiveDialog} onClose={handleToggleActiveClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {menuLead?.isAtivo ? 'Desativar lead' : 'Ativar lead'}
          <IconButton size="small" onClick={handleToggleActiveClose}>
            <IconX size={18} />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ py: 3 }}>
          <Stack sx={{ alignItems: 'center', textAlign: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: menuLead?.isAtivo ? 'warning.lighter' : 'success.lighter',
                color: menuLead?.isAtivo ? 'warning.main' : 'success.main'
              }}
            >
              {menuLead?.isAtivo ? <IconBan size={28} /> : <IconCheck size={28} />}
            </Avatar>

            <Typography variant="h6">
              {menuLead?.isAtivo ? 'Tem certeza que deseja desativar?' : 'Tem certeza que deseja ativar?'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {menuLead && (
                <>
                  A lead de <strong>{menuLead.nomeContato}</strong> ({menuLead.empresa}) será{' '}
                  {menuLead.isAtivo ? 'marcada como inativa' : 'marcada como ativa'}.
                </>
              )}
            </Typography>

            {menuLead?.isAtivo && (
              <Typography variant="caption" color="text.secondary">
                Atenção: o backend atual não exibe leads inativas na listagem nem na busca — após desativar, ela deixará de aparecer
                aqui.
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
          <Button variant="outlined" onClick={handleToggleActiveClose}>
            Cancelar
          </Button>

          <Button
            variant="contained"
            color={menuLead?.isAtivo ? 'warning' : 'success'}
            onClick={handleToggleActiveConfirm}
            disabled={isTogglingActive}
          >
            {menuLead?.isAtivo ? 'Desativar' : 'Ativar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL EXCLUIR LEAD                                       */}
      {/* ========================================================= */}

      <Dialog open={openDeleteDialog} onClose={handleDeleteClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Excluir lead de certificação
          <IconButton size="small" onClick={handleDeleteClose}>
            <IconX size={18} />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ py: 3 }}>
          <Stack sx={{ alignItems: 'center', textAlign: 'center', gap: 2 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'error.lighter', color: 'error.main' }}>
              <IconTrash size={28} />
            </Avatar>

            <Typography variant="h6">Tem certeza que deseja excluir?</Typography>

            <Typography variant="body2" color="text.secondary">
              {menuLead && (
                <>
                  A lead de <strong>{menuLead.nomeContato}</strong> ({menuLead.empresa}) será excluída permanentemente. Esta ação não
                  pode ser desfeita.
                </>
              )}
            </Typography>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
          <Button variant="outlined" onClick={handleDeleteClose}>
            Cancelar
          </Button>

          <Button variant="contained" color="error" onClick={handleDeleteConfirm} disabled={isDeleting}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL DE FILTRO                                          */}
      {/* ========================================================= */}

      <Dialog
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        PaperProps={{ sx: { width: 420, maxWidth: 'calc(100% - 32px)', borderRadius: 1.5 } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
            <Typography variant="subtitle1">Filtrar</Typography>
            <IconButton size="small" onClick={() => setOpenFilter(false)}>
              <IconX size={18} />
            </IconButton>
          </Stack>

          <Divider />

          <Stack sx={{ p: 2, gap: 2.5 }}>
            {/* STATUS */}
            <Stack sx={{ gap: 1 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                {selectedStatuses.length > 0 && (
                  <Chip label={`${selectedStatuses.length} selecionado${selectedStatuses.length > 1 ? 's' : ''}`} size="small" variant="outlined" sx={{ height: 22 }} />
                )}
              </Stack>

              {(['Ativo', 'Inativo'] as ActiveStatus[]).map((status) => (
                <Stack key={status} direction="row" onClick={() => toggleStatus(status)} sx={{ alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                  <Checkbox size="small" checked={selectedStatuses.includes(status)} />
                  <Typography variant="body2">{status}</Typography>
                </Stack>
              ))}
            </Stack>

            {/* DADOS DE CERTIFICACAO */}
            <Stack sx={{ gap: 1 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Dados de Certificação
                </Typography>
                {selectedComplementar.length > 0 && (
                  <Chip label={`${selectedComplementar.length} selecionado${selectedComplementar.length > 1 ? 's' : ''}`} size="small" variant="outlined" sx={{ height: 22 }} />
                )}
              </Stack>

              {(['Enviada', 'Pendente'] as ComplementarStatus[]).map((status) => (
                <Stack key={status} direction="row" onClick={() => toggleComplementar(status)} sx={{ alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                  <Checkbox size="small" checked={selectedComplementar.includes(status)} />
                  <Typography variant="body2">{status}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Divider />

          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', p: 1.5 }}>
            <Button variant="text" color="secondary" onClick={handleResetFilters}>
              Cancelar
            </Button>

            <Button variant="contained" onClick={handleApplyFilters}>
              Aplicar
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
