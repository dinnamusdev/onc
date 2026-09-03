# Stack Tecnológica - ONC

## 📦 Dependências Principais

### Core Framework
```json
{
  "next": "16.1.6",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "typescript": "5.9.3"
}
```

**Detalhes:**
- Next.js 16: App Router, Server Components, Turbopack
- React 19: Latest features, concurrent rendering
- TypeScript 5.9: Strict mode, latest syntax

### UI Framework
```json
{
  "@mui/material": "7.3.8",
  "@mui/material-nextjs": "7.3.8",
  "@emotion/react": "11.14.0",
  "@emotion/styled": "11.14.1",
  "@emotion/cache": "11.14.0"
}
```

**Detalhes:**
- Material-UI v7: Latest major version with improved performance
- Emotion: CSS-in-JS engine, better than styled-components
- MUI Next.js integration: Optimized for Next.js App Router

### Ícones & Visual
```json
{
  "@tabler/icons-react": "3.37.1",
  "react-device-detect": "2.2.3",
  "stylis": "4.3.6",
  "stylis-plugin-rtl": "2.1.1"
}
```

**Detalhes:**
- Tabler Icons: 4000+ icons, tree-shakable
- Device detect: Responsive behavior
- Stylis: CSS processor for Emotion
- RTL plugin: Right-to-left language support

### Data Fetching & State
```json
{
  "axios": "1.13.5",
  "swr": "^2.5.1",
  "react-hook-form": "7.71.2"
}
```

**Detalhes:**
- Axios: HTTP client with interceptors
- SWR: Data fetching, caching, revalidation
- React Hook Form: Form state management, validation

### Tabelas & Dados
```json
{
  "@tanstack/react-table": "8.21.3",
  "lodash-es": "4.17.23"
}
```

**Detalhes:**
- TanStack Table: Headless UI for tables
- Lodash-es: Utility functions, tree-shakable

### Autenticação & Forms
```json
{
  "react-otp-input": "3.1.1",
  "react-dropzone": "^19.3.0",
  "notistack": "3.0.2"
}
```

**Detalhes:**
- OTP Input: 2FA verification
- Dropzone: File upload
- Notistack: Toast notifications

### Internacionalização
```json
{
  "react-intl": "8.1.3"
}
```

**Detalhes:**
- React Intl: i18n, formatting, pluralization

### Scrollbar
```json
{
  "simplebar-react": "3.3.2"
}
```

**Detalhes:**
- Custom scrollbar styling

## 🔧 DevDependencies

### Linting & Formatting
```json
{
  "eslint": "9.39.3",
  "eslint-config-next": "16.1.6",
  "eslint-config-prettier": "10.1.8",
  "eslint-plugin-prettier": "5.5.5",
  "prettier": "3.8.1"
}
```

**Detalhes:**
- ESLint 9: Flat config format
- Prettier: Code formatting
- Next.js ESLint config: Framework-specific rules

### TypeScript Types
```json
{
  "@types/node": "25.3.2",
  "@types/react": "19.2.14",
  "@types/react-dom": "19.2.3",
  "@types/lodash-es": "4.17.12"
}
```

**Detalhes:**
- Type definitions for packages

## 🚀 Scripts

### Development
```bash
npm run dev        # Next.js dev server with Turbopack
```

### Build
```bash
npm run build      # Production build
npm run start      # Start production server
```

### Quality
```bash
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run prettier   # Format with Prettier
```

## ⚙️ Configurações

### Next.js Config
```javascript
// next.config.mjs
{
  experimental: {
    optimizePackageImports: ['@mui/material', 'lodash-es']
  },
  images: {
    remotePatterns: [...]
  },
  headers: {
    Content-Security-Policy: ...
  }
}
```

### TypeScript Config
```json
{
  "compilerOptions": {
    "target": "es5",
    "strict": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### ESLint Config
```javascript
// eslint.config.mjs
- Flat config format
- Next.js preset
- Prettier integration
- TypeScript support
```

## 🗂️ Estrutura de Pastas

### Source Structure
```
src/
├── app/                 # Next.js App Router
│   ├── (admin)/        # Admin route group
│   ├── (auth)/         # Auth route group
│   ├── api/            # API routes
│   └── layout.tsx      # Root layout
├── components/         # Reusable components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── layouts/            # Layout components
├── menu/               # Navigation config
├── sections/           # Feature sections
├── themes/             # Theme configuration
├── types/              # TypeScript types
├── utils/              # Utilities
│   ├── api/           # API clients
│   ├── route-guard/   # Route guards
│   └── validation-schema/ # Validation schemas
└── views/              # Page views
```

## 🔑 Chaves de Configuração

### Environment Variables
```env
ONC_API_BASE_URL=http://seu-servidor.com.br
NEXT_PUBLIC_VERSION=v2.1.0
NEXT_PUBLIC_PATH=
NEXT_PUBLIC_BASE_NAME=
NEXT_PUBLIC_API_HOST=
```

### Config Context Keys
```typescript
{
  currentTheme: 'light' | 'dark',
  themeDirection: 'ltr' | 'rtl',
  miniDrawer: boolean,
  i18n: string
}
```

### Auth Context Keys
```typescript
{
  AUTH_USER_KEY: string,
  AUTH_CONFIG_KEY: string
}
```

## 🎨 Sistema de Temas

### Theme Structure
```
src/themes/
├── index.tsx              # Theme initialization
├── palette.ts             # Color palette
├── typography.ts          # Typography config
├── custom-shadows.tsx     # Custom shadows
└── overrides/             # Component overrides
    ├── Button.tsx
    ├── Card.tsx
    └── ...
```

### Palette Colors
- Primary: Custom brand color
- Secondary: Accent color
- Success: Green variants
- Error: Red variants
- Warning: Yellow variants
- Info: Blue variants

## 🔌 Integrações

### API ONC
```typescript
// src/utils/api/auth/index.ts
- login()
- signUp()
- forgotPassword()
- resetPassword()
- verifyOtp()
- resendOtp()
- logout()
- requestCodePasswordReset()
- verifyRecoveryCode()
```

### Firebase (Configurado)
- Auth domain
- API keys
- CSP headers

### Supabase (Configurado)
- URL
- CSP headers

## 📊 Performance

### Otimizações Ativas
- Turbopack bundler
- optimizePackageImports
- Dynamic imports
- Image optimization
- Code splitting
- Tree shaking

### Bundle Size
- MUI: ~300KB (gzipped)
- React: ~40KB (gzipped)
- Next.js: ~70KB (gzipped)
- Total: ~500KB (gzipped)

## 🌐 Browser Support

### Target Browsers
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

### Polyfills
- Core-js (via Next.js)
- Regenerator runtime

## 🔒 Segurança

### Headers
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### Dependencies
- Regular updates
- Security audits
- No known vulnerabilities

## 🧪 Testing (Planejado)

### Tools Considerados
- Jest: Unit testing
- React Testing Library: Component testing
- Playwright: E2E testing
- MSW: API mocking

## 📦 Build Output

### .next Structure
```
.next/
├── static/              # Static assets
├── server/              # Server bundles
├── client/              # Client bundles
└── types/               # TypeScript types
```

### Production
- Static HTML for initial load
- JavaScript bundles
- CSS chunks
- Image assets

## 🚀 Deploy

### Platforms
- Vercel (Recomendado)
- Netlify
- AWS Amplify
- Docker containers

### Requirements
- Node.js 18+
- NPM or Yarn
- Environment variables

## 📈 Monitoramento (Planejado)

### Tools
- Vercel Analytics
- Sentry (Error tracking)
- Google Analytics
- Speed insights

## 🔮 Roadmap Tecnológico

### Short Term
- Implement testing suite
- Add PWA support
- Optimize bundle size
- Add monitoring

### Medium Term
- Migrate to App Router fully
- Add SSR for critical pages
- Implement caching strategy
- Add A/B testing

### Long Term
- Micro-frontend architecture
- Edge functions
- Real-time features
- Advanced analytics

## 📚 Documentação

### Links Úteis
- Next.js: https://nextjs.org/docs
- Material-UI: https://mui.com/
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/

### Internos
- AGENTS.md - Documentação geral
- ARQUITETURA.md - Arquitetura detalhada
- ONC_API_INTEGRATION.md - Integração API
- ONC_ENDPOINTS_IMPLEMENTATION.md - Endpoints

## 🐛 Troubleshooting

### Common Issues
- Build fails: Clear .next cache
- MUI styles: Check emotion cache
- Auth errors: Verify API URL
- Theme issues: Clear localStorage

### Debug Commands
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 💡 Tips & Tricks

### Development
- Use Turbopack for faster builds
- Leverage Next.js hot reload
- Use TypeScript strict mode
- Enable ESLint auto-fix

### Performance
- Dynamic import heavy components
- Optimize images
- Use SWR for data caching
- Minimize re-renders

### Code Quality
- Follow import order convention
- Use TypeScript types
- Write meaningful commits
- Review before merging
