'use client';

import type { ReactNode } from 'react';

// @mui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// @project
import MainCard from '@/components/MainCard';
import ProgressCard from '@/components/cards/ProgressCard';

// @assets
import {
  IconActivity,
  IconArrowUpRight,
  IconArrowDownRight,
  IconKey,
  IconShieldCheck,
  IconUsers,
  IconClock,
  IconCheck,
  IconX,
  IconAlertTriangle
} from '@tabler/icons-react';

/***************************  DASHBOARD - TYPES  ***************************/

interface StatTileProps {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: ReactNode;
  bgColor: string;
  shadowColor: string;
  iconBg: string;
}

interface RecentUser {
  name: string;
  email: string;
  role: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  since: string;
}

interface ActivityItem {
  icon: ReactNode;
  iconColor: string;
  title: string;
  time: string;
}

/***************************  DASHBOARD - DATA  ***************************/

const recentUsers: RecentUser[] = [
  { name: 'Ana Beatriz Costa', email: 'ana.costa@onc.org.br', role: 'Administrador', status: 'Ativo', since: 'há 2 min' },
  { name: 'Carlos Eduardo Lima', email: 'carlos.lima@onc.org.br', role: 'Auditor', status: 'Ativo', since: 'há 15 min' },
  { name: 'Fernanda Souza', email: 'fernanda.souza@onc.org.br', role: 'Operador', status: 'Pendente', since: 'há 1 h' },
  { name: 'Rafael Mendes', email: 'rafael.mendes@onc.org.br', role: 'Visualizador', status: 'Inativo', since: 'há 3 h' },
  { name: 'Juliana Pereira', email: 'juliana.pereira@onc.org.br', role: 'Auditor', status: 'Ativo', since: 'há 5 h' }
];

const recentActivity: ActivityItem[] = [
  { icon: <IconCheck size={14} />, iconColor: '#22892F', title: 'Novo usuário cadastrado: Ana Beatriz Costa', time: 'há 2 min' },
  { icon: <IconKey size={14} />, iconColor: '#008394', title: 'Papel "Auditor" atribuído a Carlos Lima', time: 'há 15 min' },
  { icon: <IconAlertTriangle size={14} />, iconColor: '#AE6600', title: 'Tentativa de login inválida detectada', time: 'há 42 min' },
  { icon: <IconShieldCheck size={14} />, iconColor: '#B71C1C', title: 'Permissão "read:reports" criada', time: 'há 1 h' },
  { icon: <IconX size={14} />, iconColor: '#DE3730', title: 'Usuário Rafael Mendes desativado', time: 'há 3 h' },
  { icon: <IconUsers size={14} />, iconColor: '#5A5C78', title: '12 usuários importados via lote', time: 'há 5 h' }
];

/***************************  DASHBOARD - STAT TILE  ***************************/

function StatTile({ title, value, trend, trendLabel, icon, bgColor, shadowColor, iconBg }: StatTileProps) {
  const isPositive = trend >= 0;

  return (
    <Card
      elevation={0}
      sx={{
        background: bgColor,
        borderRadius: 3,
        p: { xs: 2, sm: 2.5 },
        color: '#fff',
        boxShadow: `0px 6px 24px 0px ${shadowColor}55, 0px 0px 2px 0px rgba(0,0,0,0.10)`
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Stack sx={{ gap: 0.75 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>
            {value}
          </Typography>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 0.4, mt: 0.25 }}>
            {isPositive
              ? <IconArrowUpRight size={15} color="rgba(255,255,255,0.90)" />
              : <IconArrowDownRight size={15} color="rgba(255,255,255,0.90)" />}
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.90)', fontWeight: 600 }}>
              {Math.abs(trend)}%
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
              {trendLabel}
            </Typography>
          </Stack>
        </Stack>
        <Avatar sx={{ bgcolor: iconBg, width: 48, height: 48, borderRadius: 2 }}>
          {icon}
        </Avatar>
      </Stack>
    </Card>
  );
}

/***************************  DASHBOARD - STATUS CHIP  ***************************/

function StatusChip({ status }: { status: RecentUser['status'] }) {
  const map: Record<RecentUser['status'], { color: 'success' | 'error' | 'warning'; label: string }> = {
    Ativo: { color: 'success', label: 'Ativo' },
    Inativo: { color: 'error', label: 'Inativo' },
    Pendente: { color: 'warning', label: 'Pendente' }
  };
  const { color, label } = map[status];
  return <Chip label={label} color={color} size="small" variant="outlined" />;
}

/***************************  SAMPLE PAGE  ***************************/

export default function SamplePage() {
  return (
    <Stack sx={{ gap: { xs: 2.5, sm: 3.5 } }}>

      {/* ── Page Title ── */}
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 1 }}>
        <Stack>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Visão geral do sistema ONC Certificação</Typography>
        </Stack>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <IconClock size={16} color="#777680" />
          <Typography variant="caption" color="text.secondary">Atualizado agora</Typography>
        </Stack>
      </Stack>

      {/* ── KPI Stat Tiles ── */}
      <Grid container spacing={{ xs: 2, sm: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatTile
            title="Total de Usuários"
            value="1.284"
            trend={8.2}
            trendLabel="vs. mês anterior"
            icon={<IconUsers size={24} color="#fff" />}
            bgColor="linear-gradient(135deg, #008394 0%, #00607A 100%)"
            shadowColor="#008394"
            iconBg="rgba(255,255,255,0.18)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatTile
            title="Sessões Ativas"
            value="47"
            trend={12.5}
            trendLabel="vs. ontem"
            icon={<IconActivity size={24} color="#fff" />}
            bgColor="linear-gradient(135deg, #22892F 0%, #006E1C 100%)"
            shadowColor="#22892F"
            iconBg="rgba(255,255,255,0.18)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatTile
            title="Permissões"
            value="218"
            trend={3.1}
            trendLabel="esta semana"
            icon={<IconShieldCheck size={24} color="#fff" />}
            bgColor="linear-gradient(135deg, #AE6600 0%, #8B5000 100%)"
            shadowColor="#AE6600"
            iconBg="rgba(255,255,255,0.18)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatTile
            title="Papéis Cadastrados"
            value="32"
            trend={-2.4}
            trendLabel="vs. mês anterior"
            icon={<IconKey size={24} color="#fff" />}
            bgColor="linear-gradient(135deg, #B71C1C 0%, #8E0000 100%)"
            shadowColor="#B71C1C"
            iconBg="rgba(255,255,255,0.18)"
          />
        </Grid>
      </Grid>

      {/* ── Main Content Grid ── */}
      <Grid container spacing={{ xs: 2, sm: 2.5 }}>

        {/* Recent Users Table */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <MainCard sx={{ height: '100%' }}>
            <Stack sx={{ gap: 2 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Usuários Recentes</Typography>
                <Chip label="Ver todos" size="small" variant="outlined" color="primary" clickable />
              </Stack>
              <Divider />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>Nome</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>Papel</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }} align="right">Acesso</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentUsers.map((user, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>
                          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.78rem', bgcolor: 'primary.lighter', color: 'primary.dark', fontWeight: 600 }}>
                              {user.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                            </Avatar>
                            <Stack>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                            </Stack>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">{user.role}</Typography>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={user.status} />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption" color="text.secondary">{user.since}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </MainCard>
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <MainCard sx={{ height: '100%' }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Atividade Recente</Typography>
              <Divider />
              <Stack sx={{ gap: 0 }}>
                {recentActivity.map((item, idx) => (
                  <Stack key={idx} direction="row" sx={{ gap: 1.5, py: 1.25, borderBottom: idx < recentActivity.length - 1 ? '1px solid' : 'none', borderColor: 'divider', alignItems: 'flex-start' }}>
                    <Avatar
                      sx={{ width: 28, height: 28, bgcolor: `${item.iconColor}18`, color: item.iconColor, mt: 0.1 }}
                    >
                      {item.icon}
                    </Avatar>
                    <Stack sx={{ gap: 0.25, flex: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.primary', lineHeight: 1.4 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.70rem' }}>
                        {item.time}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </MainCard>
        </Grid>

      </Grid>

      {/* ── System Status ── */}
      <Grid container spacing={{ xs: 2, sm: 2.5 }}>

        {/* Coverage progress bars */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard>
            <Stack sx={{ gap: 2 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Cobertura de Permissões</Typography>
                <Typography variant="caption" color="text.secondary">por papel</Typography>
              </Stack>
              <Divider />
              <Stack sx={{ gap: 2 }}>
                <ProgressCard title="Administrador" value="100%" progress={{ value: 100, color: 'primary' }} />
                <ProgressCard title="Auditor" value="78%" progress={{ value: 78, color: 'info' }} />
                <ProgressCard title="Operador" value="54%" progress={{ value: 54, color: 'warning' }} />
                <ProgressCard title="Visualizador" value="31%" progress={{ value: 31, color: 'success' }} />
                <ProgressCard title="Convidado" value="12%" progress={{ value: 12, color: 'error' }} />
              </Stack>
            </Stack>
          </MainCard>
        </Grid>

        {/* System health / quick stats */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard sx={{ height: '100%' }}>
            <Stack sx={{ gap: 2, height: '100%' }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Status do Sistema</Typography>
                <Chip label="Operacional" color="success" size="small" />
              </Stack>
              <Divider />
              <Stack sx={{ gap: 0, flex: 1 }}>
                {[
                  { label: 'API de Autenticação', status: 'online', latency: '42 ms' },
                  { label: 'Banco de Dados', status: 'online', latency: '18 ms' },
                  { label: 'Serviço de Email', status: 'online', latency: '210 ms' },
                  { label: 'Cache Redis', status: 'degraded', latency: '320 ms' },
                  { label: 'Fila de Eventos', status: 'online', latency: '65 ms' }
                ].map((svc, idx, arr) => (
                  <Stack
                    key={idx}
                    direction="row"
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 1.5,
                      borderBottom: idx < arr.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider'
                    }}
                  >
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: svc.status === 'online' ? 'success.main' : 'warning.main',
                          boxShadow: `0 0 0 3px ${svc.status === 'online' ? '#22892F22' : '#AE660022'}`
                        }}
                      />
                      <Typography variant="body2">{svc.label}</Typography>
                    </Stack>
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">{svc.latency}</Typography>
                      <Chip
                        label={svc.status === 'online' ? 'online' : 'degraded'}
                        size="small"
                        color={svc.status === 'online' ? 'success' : 'warning'}
                        sx={{ height: 20, fontSize: '0.68rem' }}
                      />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </MainCard>
        </Grid>

      </Grid>
    </Stack>
  );
}
