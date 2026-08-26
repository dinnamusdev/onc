// @next
import { NextResponse } from 'next/server';

const ONC_API = process.env.ONC_API_BASE_URL || 'http://env-0887520.sp1.br.saveincloud.net.br';

/**
 * Decodifica o payload de um JWT (sem verificar assinatura) para extrair claims
 * como nome, email e role. A verificação da assinatura fica a cargo do backend.
 */
function decodeJwtClaims(token: string): Record<string, unknown> {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return {};
    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(normalized, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return {};
  }
}

const CLAIM_NAME = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
const CLAIM_EMAIL = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
const CLAIM_NAMEID = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const CLAIM_ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

/***************************  ONC - LOGIN  ***************************/

export async function login(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${ONC_API}/auth/api/Login/login-by-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email ?? body.userName, password: body.password })
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data?.message || data?.title || 'Invalid credentials' }, { status: res.status });
    }

    // O ONC retorna { statusCode, message, data: <payload>, success }, onde
    // `data` e a propria string do JWT. O app espera um objeto plano com
    // `access_token` no topo (usado por axios.ts, GuestGuard e AuthContext).
    const payload = data?.data ?? data;

    const token =
      typeof payload === 'string'
        ? payload
        : payload?.token ?? payload?.accessToken ?? payload?.access_token ?? payload?.jwtToken ?? '';

    // Extrai dados do usuario das claims do JWT (o backend so devolve o token).
    const claims = token ? decodeJwtClaims(token) : {};
    const role = (claims[CLAIM_ROLE] as string) ?? (claims['role'] as string) ?? 'user';

    const user = {
      id: (claims[CLAIM_NAMEID] as string) ?? (claims['sub'] as string) ?? '',
      name: (claims[CLAIM_NAME] as string) ?? '',
      email: (claims[CLAIM_EMAIL] as string) ?? body.email ?? '',
      role
    };

    return NextResponse.json(
      {
        ...user,
        access_token: token,
        token
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - GET USER  ***************************/

export async function getUser(token: string) {
  try {
    const res = await fetch(`${ONC_API}/auth/api/AuthTest/private`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // The API doesn't return user data on this endpoint, return token info
    return NextResponse.json({ access_token: token }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - SIGN UP  ***************************/

export async function signUp(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${ONC_API}/auth/api/Cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: body.userName ?? body.email,
        email: body.email,
        password: body.password,
        rePassword: body.rePassword ?? body.confirmPassword ?? body.password
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json({ error: data?.message || data?.title || 'Registration failed' }, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - FORGOT PASSWORD  ***************************/

export async function forgotPassword(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${ONC_API}/auth/api/Login/request-email-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json({ error: data?.message || data?.title || 'Request failed' }, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - RESET PASSWORD  ***************************/

export async function resetPassword(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${ONC_API}/auth/api/Login/do-reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: body.email,
        token: body.token,
        password: body.password,
        confirmPassword: body.confirmPassword ?? body.rePassword ?? body.password
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json({ error: data?.message || data?.title || 'Reset failed' }, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - SIGN OUT  ***************************/

export async function signOut(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    await fetch(`${ONC_API}/auth/api/Logout`, {
      method: 'POST',
      headers: { ...(authHeader ? { Authorization: authHeader } : {}) }
    }).catch(() => {});

    return NextResponse.json({ message: 'Logged out' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - RESEND ACTIVATION  ***************************/

export async function resend(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${ONC_API}/auth/api/Cadastro/resend-activation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body.email)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {      return NextResponse.json({ error: data?.message || 'Resend failed' }, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - REQUEST CODE PASSWORD RESET  ***************************/

export async function requestCodePasswordReset(request: Request) {
  try {
    const body = await request.json();

    console.log('Requesting code password reset for body:', body);

    const res = await fetch(`${ONC_API}/auth/api/Login/request-code-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json({ error: data?.message || data?.title || 'Request failed' }, { status: res.status });
    }

    // ONC API should return internalToken in the response
    // Expected format: { internalToken: string, recoveryCode?: string (for testing) }
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - VERIFY RECOVERY CODE  ***************************/

export async function verifyRecoveryCode(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${ONC_API}/auth/api/Login/verify-recovery-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: body.email,
        code: body.code,
        internalToken: body.internalToken
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json({ error: data?.message || data?.title || 'Verification failed' }, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - GET USER PROFILE  ***************************/

export async function getUserProfile(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${ONC_API}/auth/api/Users?email=${encodeURIComponent(body.email)}`, {
      headers: { Authorization: 'Bearer ' + body.token }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data[0] : data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Export as a single object for easy import
const oncAuth = { login, getUser, signUp, forgotPassword, resetPassword, signOut, resend, getUserProfile, requestCodePasswordReset, verifyRecoveryCode };

export default oncAuth;
