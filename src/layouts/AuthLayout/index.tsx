'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// @project
import GetImagePath from '@/utils/GetImagePath';

// @types
import { ChildrenProps } from '@/types/root';

const loginBgImage = {
  light: '/assets/images/auth/login-bg.jpg',
  dark: '/assets/images/auth/login-bg.jpg'
};

const lightTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#B71C1C'
    }
  }
});

/***************************  AUTH LAYOUT  ***************************/

export default function AuthLayout({ children }: ChildrenProps) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {/* IMAGEM - 50% DA TELA */}
      <div
        style={{
          flex: '0 0 50%',
          width: '50%',
          height: '100%',
          margin: 0,
          padding: 0,
          backgroundImage: `url(${GetImagePath(loginBgImage)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          boxSizing: 'border-box'
        }}
      />

      {/* FORMULÁRIO - 50% DA TELA */}
      <ThemeProvider theme={lightTheme}>
        <div
          style={{
            flex: '0 0 50%',
            width: '50%',
            height: '100%',
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          <CssBaseline />
          {children}
        </div>
      </ThemeProvider>
    </div>
  );
}
