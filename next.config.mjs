/** @type {import('next').NextConfig} */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;

const ONC_API_URL = process.env.ONC_API_BASE_URL || 'http://env-0887520.sp1.br.saveincloud.net.br';

const connectSources = [
  `'self'`,
  'data:',
  'https://cdn.jsdelivr.net',
  'https://identitytoolkit.googleapis.com',
  'https://securetoken.googleapis.com',
  ONC_API_URL,
  SUPABASE_URL
]
  .filter(Boolean)
  .join(' ');

const defaultSources = [`'self'`, FIREBASE_AUTH_DOMAIN].filter(Boolean).join(' ');

const cspHeader = `
    default-src ${defaultSources};
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://flagcdn.com;
    font-src 'self';
    object-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    connect-src ${connectSources};
`;

const nextConfig = {
  // Removida configuração webpack - Turbopack no Next.js 16 gerencia cache automaticamente
  // optimizePackageImports faz tree-shaking dos "barris" pesados, reduzindo
  // drasticamente o tempo de compilação/avaliação de módulos em dev.
  // Substitui o modularizeImports do MUI (cobre o mesmo caso de forma mais robusta).
  //
  // ATENÇÃO: NÃO incluir '@tabler/icons-react' aqui. O componente DynamicIcon usa
  // `import * as TablerIcons` + acesso dinâmico por nome (TablerIcons[name]). O
  // optimizePackageImports não suporta acesso dinâmico ao namespace, o que deixa
  // os ícones `undefined` e causa erro 500 ao renderizar o menu.
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/lab', 'lodash-es']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '**'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, '')
          }
        ]
      }
    ];
  }
};

export default nextConfig;
