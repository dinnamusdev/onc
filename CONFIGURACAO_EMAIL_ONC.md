# Configuração API ONC - Envio Real de Emails

## ✅ Configuração Atual

O sistema foi configurado para usar o provider **ONC** que fará o envio real de emails.

## 🔧 Arquivos Configurados

### 1. Provider ONC (src/config.ts)
```typescript
export const AUTH_PROVIDER: AuthType = AuthType.ONC;
```

### 2. Endpoint ONC (src/app/api/onc/auth/index.ts)
- **requestCodePasswordReset**: Chama API ONC para solicitar código
- **verifyRecoveryCode**: Valida código com API ONC
- **resetPassword**: Redefine senha via API ONC

## 📋 Configuração Necessária na API ONC

### 1. Variável de Ambiente
No arquivo `.env` do projeto Next.js:

```env
ONC_API_BASE_URL=http://seu-servidor-onc.com.br
```

### 2. Endpoints que a API ONC deve implementar

#### Endpoint 1: Solicitar Código
```
POST /auth/api/Login/request-code-password-reset
Content-Type: application/json

{
  "email": "usuario@exemplo.com"
}
```

**Resposta esperada:**
```json
{
  "internalToken": "token-gerado-pela-api",
  "message": "Código enviado para email"
}
```

**A API ONC deve:**
- Verificar se o email existe
- Gerar código de 6 dígitos
- Enviar código por email
- Retornar `internalToken` (não retornar o código!)

#### Endpoint 2: Validar Código
```
POST /auth/api/Login/verify-recovery-code
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "code": "123456",
  "internalToken": "token-gerado-anteriormente"
}
```

**Resposta esperada:**
```json
{
  "recoveryToken": "token-autorizacao",
  "message": "Código validado"
}
```

**A API ONC deve:**
- Validar o código contra o token interno
- Validar expiração (15-30 minutos)
- Retornar `recoveryToken` se válido

#### Endpoint 3: Redefinir Senha
```
POST /auth/api/Login/do-reset-password
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "token": "token-autorizacao",
  "password": "NovaSenha@123",
  "confirmPassword": "NovaSenha@123"
}
```

**Resposta esperada:**
```json
{
  "message": "Senha redefinida com sucesso"
}
```

## 📧 Configuração do Serviço de Email

A API ONC precisa configurar um serviço de email. Opções comuns:

### Opção 1: SMTP Próprio
```python
import smtplib
from email.mime.text import MIMEText

def send_email(to, subject, body):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = 'noreply@seu-dominio.com'
    msg['To'] = to
    
    with smtplib.SMTP('smtp.seu-provedor.com', 587) as server:
        server.starttls()
        server.login('usuario', 'senha')
        server.send_message(msg)
```

### Opção 2: Serviços de Email (Recomendado)
- **SendGrid**: https://sendgrid.com/
- **AWS SES**: https://aws.amazon.com/ses/
- **Mailgun**: https://www.mailgun.com/
- **Brevo (antigo Sendinblue)**: https://www.brevo.com/

### Exemplo com SendGrid
```python
import sendgrid
from sendgrid.helpers.mail import Mail

def send_recovery_email(email, code):
    message = Mail(
        from_email='noreply@seu-dominio.com',
        to_emails=email,
        subject='Código de Recuperação de Senha',
        html_content=f'<strong>Seu código: {code}</strong>'
    )
    sg = sendgrid.SendGridAPIClient(api_key='SUA_API_KEY')
    sg.send(message)
```

## 🧪 Testes

### Teste com Provider MOCK (Desenvolvimento)
Para testar sem enviar emails reais:

```typescript
// src/config.ts
export const AUTH_PROVIDER: AuthType = AuthType.MOCK;
```

O código aparecerá no console do navegador.

### Teste com Provider ONC (Produção)
```typescript
// src/config.ts
export const AUTH_PROVIDER: AuthType = AuthType.ONC;
```

Configure a URL da API no `.env`:
```env
ONC_API_BASE_URL=http://seu-servidor-onc.com.br
```

## 🔒 Segurança

1. **Nunca retornar o código de recuperação na resposta da API**
2. **Implementar expiração do código (15-30 minutos)**
3. **Limitar tentativas (3-5 tentativas máx)**
4. **Implementar rate limiting por IP/email**
5. **Usar HTTPS em produção**

## 📝 Documentação Completa

Para detalhes completos da integração, veja: `ONC_API_INTEGRATION.md`

## 🚀 Próximos Passos

1. **Configurar variável de ambiente** `ONC_API_BASE_URL`
2. **Implementar os 3 endpoints na API ONC**
3. **Configurar serviço de email na API ONC**
4. **Testar fluxo completo**
5. **Implantar em produção**

## ❓ Suporte

Se precisar de ajuda com a implementação da API ONC, consulte o documento `ONC_API_INTEGRATION.md` que contém exemplos detalhados de implementação.