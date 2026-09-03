// @next
import { NextResponse } from 'next/server';

// @project
import { mockUsers } from './data';

// @types
import { User, CreateUserRequest, UpdateUserRequest } from '@/types/users';

// In-memory storage for mock operations
const users = [...mockUsers];

/***************************  MOCK - GET USERS  ***************************/

export async function getUsers(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userName = searchParams.get('userName');
    const cpf = searchParams.get('cpf');

    let filteredUsers = users;

    if (email) {
      filteredUsers = filteredUsers.filter((u) => u.email.includes(email));
    }
    if (userName) {
      filteredUsers = filteredUsers.filter((u) => u.userName.includes(userName));
    }
    if (cpf) {
      filteredUsers = filteredUsers.filter((u) => u.cpf?.includes(cpf));
    }

    return NextResponse.json(filteredUsers, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - GET USER BY ID  ***************************/

export async function getUserById(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const user = users.find((u) => u.id === id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - CREATE USER  ***************************/

export async function createUser(request: Request) {
  try {
    const body: CreateUserRequest = await request.json();

    const newUser: User = {
      id: (users.length + 1).toString(),
      userName: body.userName,
      email: body.email,
      nomeCompleto: body.userName,
      isAtivo: true,
      dataCadastro: new Date().toISOString()
    };

    users.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - UPDATE USER  ***************************/

export async function updateUser(request: Request) {
  try {
    const body: UpdateUserRequest = await request.json();
    const index = users.findIndex((u) => u.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users[index] = {
      ...users[index],
      ...body
    };

    return NextResponse.json(users[index], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

/***************************  MOCK - DELETE USER  ***************************/

export async function deleteUser(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users.splice(index, 1);

    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// Export as a single object for easy import
const mockUsersApi = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

export default mockUsersApi;
