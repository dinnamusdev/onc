// @next
import { NextResponse } from 'next/server';

// @project
import mockUsers from './data';

/***************************  MOCK - LOGIN  ***************************/

export async function login(request: Request) {
  try {
    const body = await request.json(); // Parse the JSON body
    const user = mockUsers.find((user) => user.email === body.email && user.password === body.password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        contact: user.contact,
        dialcode: user.dialcode,
        firstname: user.firstname,
        lastname: user.lastname,
        access_token: user.access_token
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  MOCK - GET USER  ***************************/

export async function getUser(token: string) {
  try {
    const user = mockUsers.find((user) => user.access_token === token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }
    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        contact: user.contact,
        dialcode: user.dialcode,
        firstname: user.firstname,
        lastname: user.lastname
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  MOCK - SIGN UP  ***************************/

export async function signUp(request: Request) {
  try {
    const body = await request.json();
    console.log(body);
    return NextResponse.json({ status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  MOCK - VERIFY OTP  ***************************/

export async function verifyOtp(request: Request) {
  try {
    const body = await request.json();
    console.log(body);
    return NextResponse.json({ status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  MOCK - RESEND OTP  ***************************/

export async function resend(request: Request) {
  try {
    const body = await request.json();
    console.log(body);
    return NextResponse.json({ status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  MOCK - FORGOT PASSWORD  ***************************/

export async function forgotPassword(request: Request) {
  try {
    const body = await request.json();
    console.log(body);
    return NextResponse.json({ status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  MOCK - RESET PASSWORD  ***************************/

export async function resetPassword(request: Request) {
  try {
    const body = await request.json();
    console.log(body);
    return NextResponse.json({ status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  MOCK - SIGN OUT  ***************************/

export async function signOut() {
  try {
    return NextResponse.json({ status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  MOCK - REQUEST CODE PASSWORD RESET  ***************************/

export async function requestCodePasswordReset(request: Request) {
  try {
    const body = await request.json();
    console.log(body);

    // Check if user exists
    const user = mockUsers.find((user) => user.email === body.email);
    if (!user) {
      return NextResponse.json({ error: 'Email não encontrado no sistema' }, { status: 404 });
    }

    // Generate recovery code (6 digits) - in real implementation, this would be sent by email
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate internal token for API validation
    const internalToken = 'mock-internal-token-' + Date.now() + '-' + recoveryCode;

    console.log(`=== MOCK EMAIL SERVICE ===`);
    console.log(`Para: ${body.email}`);
    console.log(`Código de recuperação: ${recoveryCode}`);
    console.log(`=======================`);

    return NextResponse.json({
      status: 200,
      internalToken: internalToken,
      recoveryCode: recoveryCode, // Only for testing - in production, this would be sent by email
      message: 'Código de recuperação enviado para o email'
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  MOCK - GET USER PROFILE  ***************************/

export async function getUserProfile(request: Request) {
  try {
    const body = await request.json();
    const user = mockUsers.find((user) => user.email === body.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        contact: user.contact,
        dialcode: user.dialcode,
        firstname: user.firstname,
        lastname: user.lastname
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Export as a single object for easy import
/***************************  MOCK - ACTIVATE ACCOUNT  ***************************/

export async function activateAccount(request: Request) {
  const { searchParams } = new URL(request.url);
  const idUsuario = searchParams.get('IdUsuario') ?? searchParams.get('idUsuario');
  const token =
    searchParams.get('Token') ??
    searchParams.get('token') ??
    searchParams.get('CodigoAtivacao') ??
    searchParams.get('codigoAtivacao');

  if (!idUsuario || !token) {
    return NextResponse.json({ error: 'Parâmetros de ativação ausentes' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Conta ativada com sucesso (mock)' }, { status: 200 });
}

const mockAuth = {
  login,
  getUser,
  signUp,
  activateAccount,
  verifyOtp,
  resend,
  forgotPassword,
  resetPassword,
  signOut,
  getUserProfile,
  requestCodePasswordReset
};

export default mockAuth;
