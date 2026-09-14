// @next
import { NextResponse } from 'next/server';

const ONC_API = process.env.ONC_API_BASE_URL || 'http://env-0887520.sp1.br.saveincloud.net.br';

/***************************  ONC - GET USERS  ***************************/

export async function getUsers(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userName = searchParams.get('userName');
    const cpf = searchParams.get('cpf');

    const queryParams = new URLSearchParams();
    if (email) queryParams.append('email', email);
    if (userName) queryParams.append('userName', userName);
    if (cpf) queryParams.append('cpf', cpf);

    const res = await fetch(`${ONC_API}/auth/api/Users?${queryParams.toString()}`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to fetch users' }, { status: res.status });
    }

    const payload = await res.json();
    // Desempacota o envelope ServiceResponse { data: [...] }
    const data = payload?.data ?? payload;
    return NextResponse.json(Array.isArray(data) ? data : [data], { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - GET USER BY ID  ***************************/

export async function getUserById(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Backend: GET /auth/api/Users/user-by-id?id={uuid} -> UserResponseDTOServiceResponse { data }
    const res = await fetch(`${ONC_API}/auth/api/Users/user-by-id?id=${id}`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to fetch user' }, { status: res.status });
    }

    const payload = await res.json();
    // Desempacota o envelope ServiceResponse { data }
    const data = payload?.data ?? payload;
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - CREATE USER  ***************************/

export async function createUser(request: Request) {
  try {
    const body = await request.json();

    // URL da página de ativação (frontend). O backend usa este valor para montar
    // o link enviado por e-mail: {url_callback}?IdUsuario=...&CodigoAtivacao=...
    const origin = request.headers.get('origin') || new URL(request.url).origin;
    const urlCallback = `${origin}/activate-account`;

    console.log('[createUser] Iniciando criação de usuário');
    console.log('[createUser] Origin:', origin);
    console.log('[createUser] URL Callback:', urlCallback);
    console.log('[createUser] Email:', body.email);
    console.log('[createUser] UserName:', body.userName);

    const requestPayload = {
      userName: body.userName,
      email: body.email,
      password: body.password,
      rePassword: body.rePassword
    };

    console.log('[createUser] Enviando para:', `${ONC_API}/auth/api/Register/register-account`);
    console.log('[createUser] Headers:', { 'Content-Type': 'application/json', url_callback: urlCallback });

    const res = await fetch(`${ONC_API}/auth/api/Register/register-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        url_callback: urlCallback
      },
      body: JSON.stringify(requestPayload)
    });

    console.log('[createUser] Status da resposta:', res.status);
    console.log('[createUser] Headers da resposta:', Object.fromEntries(res.headers.entries()));

    const responseText = await res.text();
    console.log('[createUser] Body da resposta:', responseText);

    if (!res.ok) {
      let error: unknown = {};
      try {
        error = responseText ? JSON.parse(responseText) : {};
      } catch {
        error = { raw: responseText };
      }
      console.log('[createUser] Erro ao criar usuário:', error);
      const errorRecord = typeof error === 'object' && error !== null ? (error as Record<string, unknown>) : {};
      return NextResponse.json({ error: errorRecord.message || errorRecord.title || 'Failed to create user' }, { status: res.status });
    }

    const data = responseText ? JSON.parse(responseText) : null;
    console.log('[createUser] Usuário criado com sucesso:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[createUser] Erro na requisição:', error);
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 });
  }
}

/***************************  ONC - UPDATE USER  ***************************/

export async function updateUser(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const contentType = request.headers.get('content-type') || '';

    let id: string | null;
    let outgoing: FormData;

    // Swagger: PUT /auth/api/Users?id={uuid} com multipart/form-data.
    // Aceita tanto multipart (upload de foto) vindo do client quanto JSON,
    // convertendo para o formato multipart exigido pelo backend.
    if (contentType.includes('multipart/form-data')) {
      const incoming = await request.formData();
      const { searchParams } = new URL(request.url);
      id = searchParams.get('id') ?? (incoming.get('id') as string | null) ?? (incoming.get('Id') as string | null);
      outgoing = incoming;
      outgoing.delete('id');
      outgoing.delete('Id');
    } else {
      const body = await request.json();
      const { searchParams } = new URL(request.url);
      id = searchParams.get('id') ?? body.id ?? null;

      // Mapeia campos (camelCase ou PascalCase) para os campos multipart do swagger.
      const fieldMap: Record<string, string> = {
        userName: 'UserName',
        email: 'Email',
        whatsapp: 'Whatsapp',
        telefone: 'Telefone',
        nomeCompleto: 'NomeCompleto',
        cpf: 'Cpf',
        dataCadastro: 'DataCadastro',
        fotoURL: 'FotoURL',
        isAtivo: 'IsAtivo',
        isAlteraFoto: 'isAlteraFoto',
        logradouro: 'Logradouro',
        numero: 'Numero',
        complemento: 'Complemento',
        bairro: 'Bairro',
        cidade: 'Cidade',
        estado: 'Estado',
        cep: 'CEP'
      };

      outgoing = new FormData();
      const pascalFields = new Set(Object.values(fieldMap));
      for (const [key, value] of Object.entries(body)) {
        if (key === 'id' || value === undefined || value === null) continue;
        // Se já vier em PascalCase (ex.: 'UserName'), mantém; senão traduz via fieldMap.
        const target = fieldMap[key] ?? (pascalFields.has(key) ? key : key);
        outgoing.append(target, String(value));
      }
    }

    const res = await fetch(`${ONC_API}/auth/api/Users?id=${id}`, {
      method: 'PUT',
      headers: {
        // NÃO definir Content-Type: fetch adiciona o boundary do multipart automaticamente.
        ...(authHeader ? { Authorization: authHeader } : {})
      },
      body: outgoing
    });

    const responseText = await res.text();

    if (!res.ok) {
      let error: unknown = {};
      try {
        error = responseText ? JSON.parse(responseText) : {};
      } catch {
        error = { raw: responseText };
      }

      const errorRecord = typeof error === 'object' && error !== null ? (error as Record<string, unknown>) : {};
      const rawErrors = errorRecord.errors;
      // Normaliza para string[] independentemente se o backend retornou array ou { campo: [msgs] }
      const errorsList: string[] = Array.isArray(rawErrors)
        ? (rawErrors as string[])
        : rawErrors && typeof rawErrors === 'object'
          ? (Object.values(rawErrors as Record<string, string[]>) as string[][]).flat()
          : [];
      return NextResponse.json(
        { error: errorRecord.message || errorRecord.title || 'Failed to update user', errors: errorsList },
        { status: res.status }
      );
    }

    const data = responseText ? JSON.parse(responseText) : null;
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/***************************  ONC - DELETE USER  ***************************/

export async function deleteUser(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const res = await fetch(`${ONC_API}/auth/api/Users?id=${id}`, {
      method: 'DELETE',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json({ error: error?.message || error?.title || 'Failed to delete user' }, { status: res.status });
    }

    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Export as a single object for easy import
const oncUsers = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

export default oncUsers;
