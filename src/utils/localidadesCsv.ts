// @data
import { brazilianStates } from '@/data/brazilianStates';

// @types
import { LocalidadeCertificacao } from '@/types/lead';

export const LOCALIDADES_CSV_HEADERS = [
  'nome',
  'estado',
  'cidade',
  'atividades',
  'totalFuncionarios',
  'funcionariosAdm',
  'funcionariosOp',
  'numeroDeTurnos',
  'horarioInicio',
  'horarioTermino'
] as const;

export const LOCALIDADES_CSV_EXAMPLE = 'Matriz;SP;São Paulo;Produção e administrativo;120;30;90;2;08:00;17:00';

export const LOCALIDADES_CSV_TEMPLATE = `${LOCALIDADES_CSV_HEADERS.join(';')}\n${LOCALIDADES_CSV_EXAMPLE}\n`;

export interface LocalidadesCsvResult {
  localidades: LocalidadeCertificacao[];
  errors: string[];
}

const TIME_REGEX = /^([01]?\d|2[0-3]):[0-5]\d$/;
const VALID_UFS = new Set(brazilianStates.map((state) => state.code));

const normalizeHeader = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();

const EXPECTED_HEADERS = LOCALIDADES_CSV_HEADERS.map(normalizeHeader);

// Lê o texto respeitando aspas (campos com delimitador, aspas duplas escapadas e quebras de linha).
function parseRows(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function parseCount(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  return Number(value);
}

export function parseLocalidadesCsv(rawText: string): LocalidadesCsvResult {
  const text = rawText.replace(/^\uFEFF/, '');
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  const delimiter = firstLine.split(';').length >= firstLine.split(',').length ? ';' : ',';

  const rows = parseRows(text, delimiter).filter((row) => row.some((cell) => cell.trim() !== ''));

  if (rows.length === 0) {
    return { localidades: [], errors: ['O arquivo está vazio.'] };
  }

  const header = rows[0].map((cell) => normalizeHeader(cell));
  const missing = EXPECTED_HEADERS.map((expected, index) => ({ expected, index })).filter(({ expected }) => !header.includes(expected));

  if (missing.length > 0) {
    const missingNames = missing.map(({ index }) => LOCALIDADES_CSV_HEADERS[index]).join(', ');
    return { localidades: [], errors: [`Cabeçalho inválido. Colunas ausentes: ${missingNames}.`] };
  }

  const columnIndex = (name: (typeof LOCALIDADES_CSV_HEADERS)[number]) => header.indexOf(normalizeHeader(name));

  if (rows.length === 1) {
    return { localidades: [], errors: ['O arquivo possui apenas o cabeçalho, sem localidades.'] };
  }

  const localidades: LocalidadeCertificacao[] = [];
  const errors: string[] = [];

  rows.slice(1).forEach((row, rowIndex) => {
    const lineNumber = rowIndex + 2;
    const get = (name: (typeof LOCALIDADES_CSV_HEADERS)[number]) => (row[columnIndex(name)] ?? '').trim();
    const lineErrors: string[] = [];

    const nome = get('nome');
    if (!nome) lineErrors.push('nome obrigatório');

    const estado = get('estado').toUpperCase();
    if (!VALID_UFS.has(estado)) lineErrors.push(`estado inválido ("${get('estado')}")`);

    const numericFields = ['totalFuncionarios', 'funcionariosAdm', 'funcionariosOp', 'numeroDeTurnos'] as const;
    const numbers = {} as Record<(typeof numericFields)[number], number>;
    numericFields.forEach((field) => {
      const parsed = parseCount(get(field));
      if (parsed === null) {
        lineErrors.push(`${field} deve ser um número inteiro`);
      } else {
        numbers[field] = parsed;
      }
    });

    const horarioInicio = get('horarioInicio');
    const horarioTermino = get('horarioTermino');
    if (!TIME_REGEX.test(horarioInicio)) lineErrors.push('horarioInicio deve estar no formato HH:mm');
    if (!TIME_REGEX.test(horarioTermino)) lineErrors.push('horarioTermino deve estar no formato HH:mm');

    if (lineErrors.length > 0) {
      errors.push(`Linha ${lineNumber}: ${lineErrors.join('; ')}.`);
      return;
    }

    localidades.push({
      nome,
      estado,
      cidade: get('cidade'),
      atividades: get('atividades'),
      totalFuncionarios: numbers.totalFuncionarios,
      funcionariosAdm: numbers.funcionariosAdm,
      funcionariosOp: numbers.funcionariosOp,
      numeroDeTurnos: numbers.numeroDeTurnos,
      horarioInicio,
      horarioTermino
    });
  });

  return { localidades: errors.length > 0 ? [] : localidades, errors };
}

export function isCsvFile(file: File): boolean {
  return file.name.toLowerCase().endsWith('.csv');
}
