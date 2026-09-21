'use client';

import React, { type ReactNode } from 'react';

// @mui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import { useTheme } from '@mui/material/styles';

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
  IconAlertTriangle,
  IconLock,
  IconTrendingUp,
  IconServer,
  IconFileText,
  IconAlertCircle,
  IconUserShield,
  IconDownload
} from '@tabler/icons-react';

/***************************  DASHBOARD - TYPES  ***************************/

interface StatTileProps {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: ReactNode;
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

interface SecurityAlert {
  icon: ReactNode;
  iconColor: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  time: string;
}

interface TopPermission {
  name: string;
  usageCount: number;
  rolesCount: number;
  bgColor: string;
}

interface TrendDataPoint {
  period: string;
  value: number;
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

const securityAlerts: SecurityAlert[] = [
  {
    icon: <IconLock size={14} />,
    iconColor: '#DE3730',
    severity: 'high',
    title: 'Múltiplas tentativas de login falhadas',
    description: 'IP: 192.168.1.15 - 5 tentativas em 10 minutos',
    time: 'há 2 min'
  },
  {
    icon: <IconShieldCheck size={14} />,
    iconColor: '#AE6600',
    severity: 'medium',
    title: 'Permissão modificada',
    description: 'Admin "write:users" removida da permissão "Operador"',
    time: 'há 25 min'
  },
  {
    icon: <IconAlertTriangle size={14} />,
    iconColor: '#22892F',
    severity: 'low',
    title: 'Sessão expirada',
    description: 'Usuário "rafael.mendes@onc.org.br" foi desconectado',
    time: 'há 1 h'
  },
  {
    icon: <IconLock size={14} />,
    iconColor: '#DE3730',
    severity: 'high',
    title: 'Acesso não autorizado detectado',
    description: 'Tentativa de acesso a área administrativa sem permissão',
    time: 'há 2 h'
  },
  {
    icon: <IconShieldCheck size={14} />,
    iconColor: '#AE6600',
    severity: 'medium',
    title: 'Senha alterada',
    description: 'Usuário "ana.costa@onc.org.br" alterou sua senha',
    time: 'há 3 h'
  }
];

const topPermissions: TopPermission[] = [
  { name: 'read:users', usageCount: 847, rolesCount: 5, bgColor: 'linear-gradient(135deg, #008394 0%, #00607A 100%)' },
  { name: 'write:users', usageCount: 634, rolesCount: 4, bgColor: 'linear-gradient(135deg, #22892F 0%, #006E1C 100%)' },
  { name: 'read:reports', usageCount: 523, rolesCount: 3, bgColor: 'linear-gradient(135deg, #AE6600 0%, #8B5000 100%)' },
  { name: 'delete:users', usageCount: 156, rolesCount: 2, bgColor: 'linear-gradient(135deg, #B71C1C 0%, #8E0000 100%)' },
  { name: 'manage:roles', usageCount: 98, rolesCount: 1, bgColor: 'linear-gradient(135deg, #5A5C78 0%, #424654 100%)' },
  { name: 'read:logs', usageCount: 87, rolesCount: 2, bgColor: 'linear-gradient(135deg, #008394 0%, #00607A 100%)' },
  { name: 'admin:settings', usageCount: 65, rolesCount: 1, bgColor: 'linear-gradient(135deg, #22892F 0%, #006E1C 100%)' }
];

const userTrendData: TrendDataPoint[] = [
  { period: 'Seg', value: 1204 },
  { period: 'Ter', value: 1224 },
  { period: 'Qua', value: 1240 },
  { period: 'Qui', value: 1248 },
  { period: 'Sex', value: 1264 },
  { period: 'Sab', value: 1274 },
  { period: 'Dom', value: 1284 },
  { period: 'Seg', value: 1290 },
  { period: 'Ter', value: 1310 },
  { period: 'Qua', value: 1325 }
];

/***************************  DASHBOARD - STAT TILE  ***************************/

function StatTile({ title, value, trend, trendLabel, icon }: StatTileProps) {
  const theme = useTheme();
  const isPositive = trend >= 0;

  return (
    <Card
      elevation={0}
      sx={{
        background: theme.palette.background.paper,
        borderRadius: 3,
        p: { xs: 2, sm: 2.5 },
        color: theme.palette.text.primary,
        boxShadow: `0px 6px 24px 0px rgba(0,0,0,0.10), 0px 0px 2px 0px rgba(0,0,0,0.10)`,
        ...theme.applyStyles('dark', {
          background: '#1B1B1F',
          boxShadow: `0px 6px 24px 0px rgba(0,0,0,0.30), 0px 0px 2px 0px rgba(0,0,0,0.30)`
        })
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Stack sx={{ gap: 0.75 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.text.secondary, 
              fontWeight: 500, 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em',
              ...theme.applyStyles('dark', {
                color: '#C7C5D0'
              })
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h3" 
            sx={{ 
              color: theme.palette.text.primary, 
              fontWeight: 700, 
              lineHeight: 1.2,
              ...theme.applyStyles('dark', {
                color: '#E4E1E6'
              })
            }}
          >
            {value}
          </Typography>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 0.4, mt: 0.25 }}>
            {isPositive
              ? <IconArrowUpRight size={15} color={theme.palette.mode === 'dark' ? '#C7C5D0' : theme.palette.text.secondary} />
              : <IconArrowDownRight size={15} color={theme.palette.mode === 'dark' ? '#C7C5D0' : theme.palette.text.secondary} />}
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.text.secondary, 
                fontWeight: 600,
                ...theme.applyStyles('dark', {
                  color: '#C7C5D0'
                })
              }}
            >
              {Math.abs(trend)}%
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.text.disabled,
                ...theme.applyStyles('dark', {
                  color: '#91909A'
                })
              }}
            >
              {trendLabel}
            </Typography>
          </Stack>
        </Stack>
        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48, borderRadius: 2 }}>
          {React.cloneElement(icon as React.ReactElement, { color: '#fff' } as any)}
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

/***************************  DASHBOARD - SECURITY ALERTS  ***************************/

function SecurityAlertsWidget({ sx = {} }: { sx?: any }) {
  return (
    <MainCard sx={{ height: '100%', ...sx }}>
      <Stack sx={{ gap: 2, height: '100%' }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Alertas de Segurança</Typography>
          <Chip label={`${securityAlerts.length} recentes`} color="error" size="small" />
        </Stack>
        <Divider />
        <Stack sx={{ gap: 0, flex: 1, justifyContent: 'space-around' }}>
          {securityAlerts.map((alert, idx) => (
            <Stack
              key={idx}
              direction="row"
              sx={{
                gap: 1.5,
                py: 1.5,
                borderBottom: idx < securityAlerts.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
                alignItems: 'flex-start'
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: `${alert.iconColor}18`,
                  color: alert.iconColor,
                  mt: 0.25
                }}
              >
                {alert.icon}
              </Avatar>
              <Stack sx={{ gap: 0.25, flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {alert.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                  {alert.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.70rem', mt: 0.25 }}>
                  {alert.time}
                </Typography>
              </Stack>
              <Chip
                label={alert.severity}
                size="small"
                color={alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'default'}
                sx={{ height: 20, fontSize: '0.65rem', ml: 'auto' }}
              />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </MainCard>
  );
}

/***************************  DASHBOARD - TOP PERMISSIONS  ***************************/

function TopPermissionsWidget({ sx = {} }: { sx?: any }) {
  return (
    <MainCard sx={{ height: '100%', ...sx }}>
      <Stack sx={{ gap: 2, height: '100%' }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Top Permissões</Typography>
          <Typography variant="caption" color="text.secondary">{topPermissions.length} mais usadas</Typography>
        </Stack>
        <Divider />
        <Stack sx={{ gap: 1.5, flex: 1, justifyContent: 'space-around' }}>
          {topPermissions.map((perm, idx) => (
            <Stack key={idx} sx={{ gap: 0.75 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{perm.name}</Typography>
                <Chip label={`${perm.rolesCount} papéis`} size="small" variant="outlined" />
              </Stack>
              <Stack
                sx={{
                  height: 8,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${(perm.usageCount / 847) * 100}%`,
                    background: perm.bgColor,
                    borderRadius: 1
                  }}
                />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {perm.usageCount} usos
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </MainCard>
  );
}

/***************************  DASHBOARD - WAVE CHART  ***************************/

interface WaveDataPoint {
  month: string;
  value: number;
}

const waveData: WaveDataPoint[] = [
  { month: 'Jan', value: 120 },
  { month: 'Fev', value: 145 },
  { month: 'Mar', value: 132 },
  { month: 'Abr', value: 158 },
  { month: 'Mai', value: 175 },
  { month: 'Jun', value: 189 },
  { month: 'Jul', value: 203 },
  { month: 'Ago', value: 221 },
  { month: 'Set', value: 245 },
  { month: 'Out', value: 267 },
  { month: 'Nov', value: 289 },
  { month: 'Dez', value: 312 }
];

function WaveChartWidget() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const width = 1000;
  const height = 200;
  const padding = 20;

  const maxValue = Math.max(...waveData.map(d => d.value));
  const minValue = Math.min(...waveData.map(d => d.value));
  const valueRange = maxValue - minValue;

  const points = waveData.map((point, index) => {
    const x = padding + (index / (waveData.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((point.value - minValue) / valueRange) * (height - 2 * padding);
    return { x, y, value: point.value, month: point.month };
  });

  // Criar curva suave usando bezier
  const pathData = points.reduce((acc, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    const prevPoint = points[index - 1];
    const cp1x = prevPoint.x + (point.x - prevPoint.x) / 2;
    const cp1y = prevPoint.y;
    const cp2x = prevPoint.x + (point.x - prevPoint.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  }, '');

  // Área preenchida
  const areaPath = `${pathData} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <MainCard sx={{ width: '100%' }}>
      <Stack sx={{ gap: 2 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Tendência de Atividade</Typography>
            <Typography variant="caption" color="text.secondary">Crescimento mensal de usuários ativos</Typography>
          </Stack>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Chip label="2024" size="small" variant="outlined" />
            <Chip label="+160%" size="small" color="success" />
          </Stack>
        </Stack>
        <Divider />
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', height: 'auto', maxHeight: '300px' }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop
                  offset="0%"
                  stopColor={isDark ? '#B71C1C' : '#B71C1C'}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={isDark ? '#B71C1C' : '#B71C1C'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            {/* Área preenchida */}
            <path
              d={areaPath}
              fill="url(#waveGradient)"
              style={{ transition: 'all 0.3s ease' }}
            />
            {/* Linha da onda */}
            <path
              d={pathData}
              fill="none"
              stroke={isDark ? '#EF9A9A' : '#B71C1C'}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'all 0.3s ease' }}
            />
            {/* Pontos de dados */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  fill={isDark ? '#EF9A9A' : '#B71C1C'}
                  style={{ transition: 'all 0.3s ease' }}
                />
                <text
                  x={point.x}
                  y={point.y - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isDark ? '#E4E1E6' : '#1B1B1F'}
                  fontWeight="600"
                >
                  {point.value}
                </text>
                <text
                  x={point.x}
                  y={height - 5}
                  textAnchor="middle"
                  fontSize="9"
                  fill={isDark ? '#C7C5D0' : '#46464F'}
                >
                  {point.month}
                </text>
              </g>
            ))}
          </svg>
        </Box>
      </Stack>
    </MainCard>
  );
}

/***************************  DASHBOARD - USER TREND  ***************************/

function UserTrendWidget({ sx = {} }: { sx?: any }) {
  return (
    <MainCard sx={{ height: '100%', ...sx }}>
      <Stack sx={{ gap: 2, height: '100%' }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Tendência de Usuários</Typography>
          <Chip label="Últimos 10 dias" size="small" variant="outlined" />
        </Stack>
        <Divider />
        <Stack sx={{ gap: 3, flex: 1, justifyContent: 'space-between' }}>
          <Stack direction="row" sx={{ alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, gap: 1 }}>
            {userTrendData.map((point, idx) => (
              <Stack key={idx} sx={{ alignItems: 'center', gap: 1, flex: 1 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: (point.value / 1400) * 150,
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                    opacity: 0.8,
                    transition: 'all 0.2s',
                    '&:hover': { opacity: 1, transform: 'scaleY(1.05)' }
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  {point.period}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                1.325 usuários
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total este período
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
              <IconTrendingUp size={16} color="#22892F" />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#22892F' }}>
                +121 (+10.1%)
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </MainCard>
  );
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
            icon={<IconUsers size={24} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatTile
            title="Sessões Ativas"
            value="47"
            trend={12.5}
            trendLabel="vs. ontem"
            icon={<IconActivity size={24} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatTile
            title="Permissões"
            value="218"
            trend={3.1}
            trendLabel="esta semana"
            icon={<IconShieldCheck size={24} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatTile
            title="Papéis Cadastrados"
            value="32"
            trend={-2.4}
            trendLabel="vs. mês anterior"
            icon={<IconKey size={24} />}
          />
        </Grid>
      </Grid>

      {/* ── Secondary KPI Stats ── */}
      <Grid container spacing={{ xs: 2, sm: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatTile
            title="Logs de Auditoria"
            value="1.547"
            trend={15.8}
            trendLabel="esta semana"
            icon={<IconFileText size={24} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatTile
            title="Erros do Sistema"
            value="8"
            trend={-45.3}
            trendLabel="vs. ontem"
            icon={<IconAlertCircle size={24} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatTile
            title="Segurança da Conta"
            value="98%"
            trend={2.1}
            trendLabel="score geral"
            icon={<IconUserShield size={24} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatTile
            title="Atualizações Pendentes"
            value="3"
            trend={0}
            trendLabel="aguardando"
            icon={<IconDownload size={24} />}
          />
        </Grid>
      </Grid>

      {/* ── Wave Chart ── */}
      <WaveChartWidget />

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

        {/* Security Alerts */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <SecurityAlertsWidget sx={{ height: '100%' }} />
        </Grid>

        {/* User Trend Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <UserTrendWidget sx={{ height: '100%' }} />
        </Grid>

        {/* Top Permissions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TopPermissionsWidget sx={{ height: '100%' }} />
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12, lg: 6 }}>
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

        {/* Coverage progress bars */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <MainCard sx={{ height: '100%' }}>
            <Stack sx={{ gap: 2, height: '100%' }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Cobertura de Permissões</Typography>
                <Typography variant="caption" color="text.secondary">por papel</Typography>
              </Stack>
              <Divider />
              <Stack sx={{ gap: 2, flex: 1, justifyContent: 'space-around' }}>
                <ProgressCard title="Administrador" value="100%" progress={{ value: 100, color: 'primary' }} />
                <ProgressCard title="Auditor" value="78%" progress={{ value: 78, color: 'info' }} />
                <ProgressCard title="Operador" value="54%" progress={{ value: 54, color: 'warning' }} />
                <ProgressCard title="Visualizador" value="31%" progress={{ value: 31, color: 'success' }} />
                <ProgressCard title="Convidado" value="12%" progress={{ value: 12, color: 'error' }} />
                <ProgressCard title="Desenvolvedor" value="67%" progress={{ value: 67, color: 'secondary' }} />
                <ProgressCard title="Suporte" value="45%" progress={{ value: 45, color: 'info' }} />
              </Stack>
            </Stack>
          </MainCard>
        </Grid>

      </Grid>

      {/* ── System Health ── */}
      <Grid container spacing={{ xs: 2, sm: 2.5 }}>
        <Grid size={{ xs: 12 }}>
          <MainCard sx={{ height: '100%' }}>
            <Stack sx={{ gap: 2, height: '100%' }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Status do Sistema</Typography>
                <Chip label="Operacional" color="success" size="small" />
              </Stack>
              <Divider />
              <Stack sx={{ gap: 0, flex: 1 }}>
                {[
                  { label: 'API de Autenticação ONC', status: 'online', latency: '42 ms' },
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
