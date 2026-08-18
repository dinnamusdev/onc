# Histórico da Sessão - Otimização de Performance

## Data: 2026-08-17

## Problema Original
- **Erro**: Module not found: Can't resolve 'swr' em `src/states/snackbar.ts:4:1`
- **Causa**: Dependência `swr` não estava instalada no projeto
- **Solução**: `npm install swr` (instalado com sucesso)

## Problema Principal Identificado
- **Sintoma**: Tempo de renderização extremamente lento (70 segundos)
- **Comportamento**: Cada F5 demorava o mesmo tempo, sem cache efetivo
- **Logs**: `GET / 200 in 103s (compile: 33.4s, render: 70s)`

## Análise de Performance Realizada

### 1. Investigação de Componentes Lentos
- **ProviderWrapper**: Múltiplos providers aninhados (ConfigProvider, ThemeCustomization, RTLLayout, Notistack, Snackbar, Locales)
- **Locales Component**: Carregamento dinâmico de JSON com useEffect
- **ThemeCustomization**: `buildPalette()` computacionalmente cara
- **useLocalStorage**: Leitura inicial de localStorage bloqueante
- **Snackbar com SWR**: Overhead desnecessário para estado local

### 2. Análise de Opções de Remoção
**Ganho estimado removendo funcionalidades não usadas:**
- Remover RTL (hebraico/aramaico): 10-15% (7-10.5s)
- Remover customização de temas: 25-35% (17.5-24.5s) 
- Remover ConfigProvider: 15-20% (10.5-14s)
- **Ganho total**: 50-70% (redução de 35-49s)

### 3. Descoberta do Problema Real
O problema **não era performance de runtime**, mas sim **recompilação desnecessária**:
- Next.js estava recompilando tudo a cada F5
- Configuração webpack problemática
- Conflito entre Turbopack (Next.js 16) e config webpack

## Soluções Implementadas

### 1. Correção do next.config.mjs
**Removido:**
```javascript
webpack: (config, { dev, isServer }) => {
  if (dev) {
    config.cache = {
      type: 'filesystem',
      allowCollectingMemory: true,
      compression: false // desabilita compressão para evitar o problema de 'cache compaction'
    };
  }
  return config;
}
```

**Motivo:** Esta configuração era necessária para webpack, mas o Next.js 16 usa Turbopack por padrão, que gerencia cache automaticamente.

### 2. Verificação do package.json
- Já estava correto: `"dev": "next dev"` (sem `--webpack`)

## Estado Atual
- **Erro de build anterior**: Conflito entre Turbopack e configuração webpack
- **Ação tomada**: Removida configuração webpack do next.config.mjs
- **Build**: Em andamento (testando `npm run build`)

## Próximos Passos Recomendados

### Imediatos:
1. **Verificar se o build agora funciona** após remoção da config webpack
2. **Testar `npm run dev`** para ver se o cache do Turbopack funciona melhor
3. **Comparar tempos** entre desenvolvimento e produção

### Opcionais (se ainda houver lentidão):
1. **Testar produção**: `npm run build && npm start` (código pré-compilado)
2. **Remover funcionalidades não usadas** (RTL, customização de temas, ConfigProvider)
3. **Simplificar Snackbar**: Remover SWR e usar useState simples

## Arquivos Modificados
- `package.json`: Adicionada dependência `swr`
- `next.config.mjs`: Removida configuração webpack problemática

## Comandos Úteis
```bash
# Desenvolvimento (com Turbopack)
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Limpar cache se necessário
rm -rf .next
```

## Observações Importantes
- O Next.js 16 usa Turbopack por padrão (10x mais rápido que webpack)
- A configuração webpack antiga estava causando conflitos
- Em produção, o código é pré-compilado e não recompila a cada F5
