# Integração API ONC - Recuperação de Senha

## 📋 Visão Geral

Este documento especifica os endpoints e formatos de resposta que a API ONC deve implementar para suportar o fluxo de recuperação de senha com envio real de emails.

## 🔧 Configuração

No arquivo `.env`, configure a URL base da API ONC:

```env
ONC_API_BASE_URL=http://seu-servidor-onc.com.br
```

## 📡 Endpoints Necessários

### 1. Solicitar Código de Recuperação

**Endpoint:** `POST /auth/api/Login/request-code-password-reset`

**Request:**
```json
{
  "email": "usuario@exemplo.com"
}
```

**Response (Sucesso):**
```json
{
  "internalToken": "token-interno-gerado-pela-api",
  "message": "Código de recuperação enviado para o email"
}
```

**Response (Erro - Email não encontrado):**
```json
{
  "error": "Email não encontrado no sistema"
}
```

**Response (Erro - Servidor):**
```json
{
  "error": "Erro ao processar solicitação"
}
```

**Comportamento Esperado:**
1. Verificar se o email existe no sistema
2. Se não existir, retornar erro 404
3. Se existir:
   - Gerar código de recuperação de 6 dígitos
   - Gerar token interno para validação
   - Enviar código por email para o usuário
   - Retornar o token interno (o código NÃO deve ser retornado)

### 2. Validar Código de Recuperação

**Endpoint:** `POST /auth/api/Login/verify-recovery-code`

**Request:**
```json
{
  "email": "usuario@exemplo.com",
  "code": "123456",
  "internalToken": "token-interno-gerado-anteriormente"
}
```

**Response (Sucesso):**
```json
{
  "recoveryToken": "token-autorizacao-reset-senha",
  "message": "Código validado com sucesso"
}
```

**Response (Erro - Código inválido):**
```json
{
  "error": "Código de recuperação inválido"
}
```

**Response (Erro - Token expirado):**
```json
{
  "error": "Token expirado. Solicite novo código."
}
```

**Comportamento Esperado:**
1. Validar o código de recuperação contra o token interno
2. Validar se o token não expirou (recomendado: 15-30 minutos)
3. Se válido:
   - Gerar token de autorização para reset de senha
   - Retornar o token de autorização
4. Se inválido:
   - Retornar erro apropriado
   - Incrementar contador de tentativas falhas (opcional)

### 3. Redefinir Senha

**Endpoint:** `POST /auth/api/Login/do-reset-password`

**Request:**
```json
{
  "email": "usuario@exemplo.com",
  "token": "token-autorizacao-reset-senha",
  "password": "NovaSenha@123",
  "confirmPassword": "NovaSenha@123"
}
```

**Response (Sucesso):**
```json
{
  "message": "Senha redefinida com sucesso"
}
```

**Response (Erro - Token inválido):**
```json
{
  "error": "Token de autorização inválido"
}
```

**Response (Erro - Senha fraca):**
```json
{
  "error": "A senha não atende aos requisitos mínimos"
}
```

**Comportamento Esperado:**
1. Validar o token de autorização
2. Validar força da senha (mínimo 8 caracteres, maiúscula, minúscula, número, especial)
3. Atualizar a senha no sistema
3. Invalidar o token de autorização (uso único)
4. Enviar confirmação por email (opcional)

## 📧 Serviço de Email

A API ONC deve implementar o envio de emails com:

### Email de Recuperação de Senha

**Assunto:** Código de Recuperação de Senha

**Corpo:**
```
Olá [Nome do Usuário],

Recebemos uma solicitação para redefinir sua senha.

Seu código de recuperação é: [CÓDIGO-6-DÍGITOS]

Este código expira em 30 minutos.

Se você não solicitou esta recuperação, ignore este email.

Atenciosamente,
Equipe ONC
```

### Email de Confirmação (Opcional)

**Assunto:** Senha Redefinida com Sucesso

**Corpo:**
```
Olá [Nome do Usuário],

Sua senha foi redefinida com sucesso.

Se você não fez esta alteração, entre em contato imediatamente com o suporte.

Atenciosamente,
Equipe ONC
```

## 🔒 Segurança

1. **Código de Recuperação:**
   - 6 dígitos numéricos
   - Expiração: 15-30 minutos
   - Máximo de tentativas: 3-5
   - Não deve ser retornado na resposta da API

2. **Token Interno:**
   - Usado apenas para validação do código
   - Não exposto ao usuário final
   - Pode conter metadados de validação

3. **Token de Autorização:**
   - Gerado após validação bem-sucedida
   - Uso único (invalidado após reset)
   - Expiração curta (5-10 minutos)

4. **Rate Limiting:**
   - Limitar solicitações por IP/email
   - Bloquear após múltiplas tentativas falhas

## 🧪 Testes

### Ambiente de Desenvolvimento

Para testes em desenvolvimento, a API pode opcionalmente retornar o código:

```json
{
  "internalToken": "token-teste",
  "recoveryCode": "123456", // Apenas em desenvolvimento
  "message": "Código de recuperação enviado"
}
```

**Importante:** Nunca retornar o código em produção!

### Ambiente de Produção

Em produção, o código deve ser enviado apenas por email, nunca retornado na resposta.

## 📝 Exemplo de Fluxo Completo

1. **Usuário solicita recuperação:**
   ```
   POST /auth/api/Login/request-code-password-reset
   { "email": "user@exemplo.com" }
   ```

2. **API responde:**
   ```json
   { "internalToken": "abc123xyz" }
   ```

3. **API envia email:** Código `456789` enviado para user@exemplo.com

4. **Usuário insere código:**
   ```
   POST /auth/api/Login/verify-recovery-code
   { "email": "user@exemplo.com", "code": "456789", "internalToken": "abc123xyz" }
   ```

5. **API valida e responde:**
   ```json
   { "recoveryToken": "recovery-xyz789" }
   ```

6. **Usuário redefine senha:**
   ```
   POST /auth/api/Login/do-reset-password
   { "email": "user@exemplo.com", "token": "recovery-xyz789", "password": "Nova@123", "confirmPassword": "Nova@123" }
   ```

7. **API responde:**
   ```json
   { "message": "Senha redefinida com sucesso" }
   ```

## 🚀 Implementação Recomendada

### Validador de Código

```python
def validate_recovery_code(email, code, internal_token):
    # Verificar se email existe
    user = get_user_by_email(email)
    if not user:
        return False, "Email não encontrado"
    
    # Validar token interno
    if not validate_internal_token(internal_token, email):
        return False, "Token inválido"
    
    # Validar código
    stored_code = get_stored_code(internal_token)
    if stored_code != code:
        increment_failed_attempts(internal_token)
        return False, "Código inválido"
    
    # Verificar expiração
    if is_token_expired(internal_token):
        return False, "Código expirado"
    
    return True, generate_recovery_token(email)
```

### Gerador de Código

```python
import random

def generate_recovery_code():
    return str(random.randint(100000, 999999))
```

### Serviço de Email

```python
def send_recovery_email(email, code, user_name):
    subject = "Código de Recuperação de Senha"
    body = f"""
    Olá {user_name},
    
    Seu código de recuperação é: {code}
    
    Este código expira em 30 minutos.
    """
    send_email(email, subject, body)
```

## 📞 Suporte

Para dúvidas sobre a implementação, entre em contato com a equipe de desenvolvimento.