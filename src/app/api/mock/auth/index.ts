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
const mockAuth = { login, getUser, signUp, verifyOtp, resend, forgotPassword, resetPassword, signOut, getUserProfile };

export default mockAuth;
