# Implementação de Endpoints API ONC - Recuperação de Senha

## 📋 Endpoints a Implementar

Você precisa implementar 3 endpoints na API ONC para suportar o fluxo de recuperação de senha com envio real de emails.

## 🔧 Estrutura Sugerida

```python
# Estrutura de pastas sugerida na API ONC
/api/
  /auth/
    /api/
      /Login/
        request-code-password-reset.py  # Endpoint 1
        verify-recovery-code.py        # Endpoint 2
        do-reset-password.py           # Endpoint 3
```

## 📡 Endpoint 1: Solicitar Código de Recuperação

**Arquivo:** `request-code-password-reset.py`

```python
import random
import datetime
import json
from flask import Flask, request, jsonify
from database import get_user_by_email, save_recovery_token

app = Flask(__name__)

def generate_recovery_code():
    """Gera código de 6 dígitos"""
    return str(random.randint(100000, 999999))

def generate_internal_token(email, code):
    """Gera token interno para validação"""
    timestamp = int(datetime.datetime.now().timestamp())
    return f"internal-{timestamp}-{email}-{code}"

@app.route('/auth/api/Login/request-code-password-reset', methods=['POST'])
def request_code_password_reset():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email é obrigatório'}), 400
        
        # Verificar se usuário existe
        user = get_user_by_email(email)
        if not user:
            return jsonify({'error': 'Email não encontrado no sistema'}), 404
        
        # Gerar código de recuperação
        recovery_code = generate_recovery_code()
        
        # Gerar token interno
        internal_token = generate_internal_token(email, recovery_code)
        
        # Salvar no banco de dados (com expiração de 30 minutos)
        expiry_time = datetime.datetime.now() + datetime.timedelta(minutes=30)
        save_recovery_token(email, internal_token, recovery_code, expiry_time)
        
        # Enviar email com o código
        send_recovery_email(email, recovery_code, user.get('name', 'Usuário'))
        
        return jsonify({
            'internalToken': internal_token,
            'message': 'Código de recuperação enviado para o email'
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao processar solicitação: {str(e)}'}), 500

def send_recovery_email(email, code, user_name):
    """Envia email com código de recuperação"""
    # Configurar seu serviço de email aqui
    subject = "Código de Recuperação de Senha"
    body = f"""
    Olá {user_name},
    
    Recebemos uma solicitação para redefinir sua senha.
    
    Seu código de recuperação é: {code}
    
    Este código expira em 30 minutos.
    
    Se você não solicitou esta recuperação, ignore este email.
    
    Atenciosamente,
    Equipe ONC
    """
    
    # Implementar envio real de email
    # Exemplo com SendGrid:
    # import sendgrid
    # from sendgrid.helpers.mail import Mail
    # 
    # message = Mail(
    #     from_email='noreply@seu-dominio.com',
    #     to_emails=email,
    #     subject=subject,
    #     html_content=body
    # )
    # sg = sendgrid.SendGridAPIClient(api_key='SUA_API_KEY')
    # sg.send(message)
    
    print(f"=== EMAIL SERVICE ===")
    print(f"Para: {email}")
    print(f"Código: {code}")
    print(f"==================")

if __name__ == '__main__':
    app.run(debug=True)
```

## 📡 Endpoint 2: Validar Código de Recuperação

**Arquivo:** `verify-recovery-code.py`

```python
import datetime
from flask import Flask, request, jsonify
from database import get_recovery_token, invalidate_recovery_token, generate_recovery_token

app = Flask(__name__)

@app.route('/auth/api/Login/verify-recovery-code', methods=['POST'])
def verify_recovery_code():
    try:
        data = request.get_json()
        email = data.get('email')
        code = data.get('code')
        internal_token = data.get('internalToken')
        
        if not all([email, code, internal_token]):
            return jsonify({'error': 'Todos os campos são obrigatórios'}), 400
        
        # Buscar token no banco de dados
        recovery_data = get_recovery_token(internal_token)
        
        if not recovery_data:
            return jsonify({'error': 'Token inválido ou expirado'}), 400
        
        # Verificar se o email corresponde
        if recovery_data['email'] != email:
            return jsonify({'error': 'Token inválido para este email'}), 400
        
        # Verificar se o código corresponde
        if recovery_data['code'] != code:
            # Incrementar tentativas falhas
            increment_failed_attempts(internal_token)
            
            # Verificar se excedeu tentativas máximas
            if recovery_data.get('failed_attempts', 0) >= 5:
                invalidate_recovery_token(internal_token)
                return jsonify({'error': 'Muitas tentativas falhas. Solicite novo código.'}), 400
            
            return jsonify({'error': 'Código de recuperação inválido'}), 400
        
        # Verificar expiração
        if datetime.datetime.now() > recovery_data['expiry_time']:
            invalidate_recovery_token(internal_token)
            return jsonify({'error': 'Código expirado. Solicite novo código.'}), 400
        
        # Gerar token de autorização para reset de senha
        recovery_token = generate_recovery_token(email)
        
        # Invalidar o token interno (uso único)
        invalidate_recovery_token(internal_token)
        
        return jsonify({
            'recoveryToken': recovery_token,
            'message': 'Código validado com sucesso'
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao validar código: {str(e)}'}), 500

def generate_recovery_token(email):
    """Gera token de autorização para reset de senha"""
    timestamp = int(datetime.datetime.now().timestamp())
    return f"recovery-{timestamp}-{email}"

def increment_failed_attempts(internal_token):
    """Incrementa contador de tentativas falhas"""
    # Implementar atualização no banco de dados
    pass

if __name__ == '__main__':
    app.run(debug=True)
```

## 📡 Endpoint 3: Redefinir Senha

**Arquivo:** `do-reset-password.py`

```python
import re
import datetime
from flask import Flask, request, jsonify
from database import validate_recovery_token, update_user_password

app = Flask(__name__)

def validate_password_strength(password):
    """Valida força da senha"""
    if len(password) < 8:
        return False, "A senha deve ter no mínimo 8 caracteres"
    
    if not re.search(r'[A-Z]', password):
        return False, "A senha deve conter pelo menos uma letra maiúscula"
    
    if not re.search(r'[a-z]', password):
        return False, "A senha deve conter pelo menos uma letra minúscula"
    
    if not re.search(r'[0-9]', password):
        return False, "A senha deve conter pelo menos um número"
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "A senha deve conter pelo menos um caractere especial"
    
    return True, "Senha válida"

@app.route('/auth/api/Login/do-reset-password', methods=['POST'])
def do_reset_password():
    try:
        data = request.get_json()
        email = data.get('email')
        token = data.get('token')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')
        
        if not all([email, token, password, confirm_password]):
            return jsonify({'error': 'Todos os campos são obrigatórios'}), 400
        
        # Validar senhas coincidem
        if password != confirm_password:
            return jsonify({'error': 'As senhas não coincidem'}), 400
        
        # Validar força da senha
        is_valid, message = validate_password_strength(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Validar token de recuperação
        token_data = validate_recovery_token(token)
        if not token_data:
            return jsonify({'error': 'Token de autorização inválido ou expirado'}), 400
        
        # Verificar se o email corresponde ao token
        if token_data['email'] != email:
            return jsonify({'error': 'Token inválido para este email'}), 400
        
        # Verificar expiração do token (5 minutos)
        if datetime.datetime.now() > token_data['expiry_time']:
            return jsonify({'error': 'Token expirado. Solicite nova recuperação.'}), 400
        
        # Atualizar senha no banco de dados
        update_user_password(email, password)
        
        # Invalidar token (uso único)
        invalidate_recovery_token(token)
        
        # Enviar email de confirmação (opcional)
        send_password_reset_confirmation(email, token_data.get('user_name', 'Usuário'))
        
        return jsonify({
            'message': 'Senha redefinida com sucesso'
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao redefinir senha: {str(e)}'}), 500

def send_password_reset_confirmation(email, user_name):
    """Envia email de confirmação de reset de senha"""
    subject = "Senha Redefinida com Sucesso"
    body = f"""
    Olá {user_name},
    
    Sua senha foi redefinida com sucesso.
    
    Se você não fez esta alteração, entre em contato imediatamente com o suporte.
    
    Atenciosamente,
    Equipe ONC
    """
    
    # Implementar envio real de email
    print(f"=== CONFIRMATION EMAIL ===")
    print(f"Para: {email}")
    print(f"Senha redefinida com sucesso")
    print(f"========================")

def invalidate_recovery_token(token):
    """Invalida token de recuperação"""
    # Implementar invalidação no banco de dados
    pass

if __name__ == '__main__':
    app.run(debug=True)
```

## 🗄️ Estrutura do Banco de Dados

Você precisará criar tabelas para armazenar os tokens de recuperação:

```sql
-- Tabela de tokens de recuperação
CREATE TABLE recovery_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    internal_token VARCHAR(255) UNIQUE NOT NULL,
    recovery_code VARCHAR(6) NOT NULL,
    recovery_token VARCHAR(255) UNIQUE,
    expiry_time DATETIME NOT NULL,
    failed_attempts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT FALSE
);

-- Índices para performance
CREATE INDEX idx_recovery_tokens_email ON recovery_tokens(email);
CREATE INDEX idx_recovery_tokens_internal_token ON recovery_tokens(internal_token);
CREATE INDEX idx_recovery_tokens_recovery_token ON recovery_tokens(recovery_token);
```

## 🔧 Funções do Banco de Dados

```python
import sqlite3
import datetime

def get_db_connection():
    """Conexão com banco de dados"""
    conn = sqlite3.connect('onc_database.db')
    conn.row_factory = sqlite3.Row
    return conn

def get_user_by_email(email):
    """Busca usuário por email"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else None

def save_recovery_token(email, internal_token, recovery_code, expiry_time):
    """Salva token de recuperação no banco"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO recovery_tokens (email, internal_token, recovery_code, expiry_time)
        VALUES (?, ?, ?, ?)
    ''', (email, internal_token, recovery_code, expiry_time))
    conn.commit()
    conn.close()

def get_recovery_token(internal_token):
    """Busca token de recuperação"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM recovery_tokens 
        WHERE internal_token = ? AND used = FALSE
    ''', (internal_token,))
    token = cursor.fetchone()
    conn.close()
    return dict(token) if token else None

def validate_recovery_token(recovery_token):
    """Valida token de autorização"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM recovery_tokens 
        WHERE recovery_token = ? AND used = FALSE
    ''', (recovery_token,))
    token = cursor.fetchone()
    conn.close()
    return dict(token) if token else None

def update_user_password(email, new_password):
    """Atualiza senha do usuário"""
    # Importar hashlib para hash da senha
    import hashlib
    hashed_password = hashlib.sha256(new_password.encode()).hexdigest()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE users SET password = ? WHERE email = ?
    ''', (hashed_password, email))
    conn.commit()
    conn.close()

def invalidate_recovery_token(token):
    """Invalida token (marca como usado)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE recovery_tokens SET used = TRUE 
        WHERE internal_token = ? OR recovery_token = ?
    ''', (token, token))
    conn.commit()
    conn.close()

def increment_failed_attempts(internal_token):
    """Incrementa tentativas falhas"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE recovery_tokens 
        SET failed_attempts = failed_attempts + 1 
        WHERE internal_token = ?
    ''', (internal_token,))
    conn.commit()
    conn.close()
```

## 📧 Configuração de Serviço de Email

### Opção 1: SendGrid (Recomendado)

```python
import sendgrid
from sendgrid.helpers.mail import Mail

def send_email_sendgrid(to_email, subject, body):
    sg = sendgrid.SendGridAPIClient(api_key='SUA_API_KEY_SENDGRID')
    message = Mail(
        from_email='noreply@seu-dominio.com',
        to_emails=to_email,
        subject=subject,
        html_content=body
    )
    response = sg.send(message)
    return response
```

### Opção 2: AWS SES

```python
import boto3

def send_email_aws_ses(to_email, subject, body):
    client = boto3.client(
        'ses',
        region_name='us-east-1',
        aws_access_key_id='SUA_ACCESS_KEY',
        aws_secret_access_key='SUA_SECRET_KEY'
    )
    response = client.send_email(
        Source='noreply@seu-dominio.com',
        Destination={'ToAddresses': [to_email]},
        Message={
            'Subject': {'Data': subject},
            'Body': {'Html': {'Data': body}}
        }
    )
    return response
```

### Opção 3: SMTP Próprio

```python
import smtplib
from email.mime.text import MIMEText

def send_email_smtp(to_email, subject, body):
    msg = MIMEText(body, 'html')
    msg['Subject'] = subject
    msg['From'] = 'noreply@seu-dominio.com'
    msg['To'] = to_email
    
    with smtplib.SMTP('smtp.seu-provedor.com', 587) as server:
        server.starttls()
        server.login('seu-email@dominio.com', 'sua-senha')
        server.send_message(msg)
```

## 🚀 Implementação Completa

Para implementar tudo junto, você pode criar um arquivo principal:

```python
# main.py
from flask import Flask
from request_code_password_reset import request_code_password_reset
from verify_recovery_code import verify_recovery_code  
from do_reset_password import do_reset_password

app = Flask(__name__)

# Registrar os endpoints
app.add_url_rule('/auth/api/Login/request-code-password-reset', 
                  'request_code_password_reset', 
                  request_code_password_reset, 
                  methods=['POST'])

app.add_url_rule('/auth/api/Login/verify-recovery-code',
                  'verify_recovery_code',
                  verify_recovery_code, 
                  methods=['POST'])

app.add_url_rule('/auth/api/Login/do-reset-password',
                  'do_reset_password',
                  do_reset_password,
                  methods=['POST'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
```

## 🧪 Testes

Após implementar, teste os endpoints:

```bash
# Teste 1: Solicitar código
curl -X POST http://seu-servidor:8080/auth/api/Login/request-code-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@exemplo.com"}'

# Teste 2: Validar código
curl -X POST http://seu-servidor:8080/auth/api/Login/verify-recovery-code \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@exemplo.com","code":"123456","internalToken":"token-gerado"}'

# Teste 3: Redefinir senha
curl -X POST http://seu-servidor:8080/auth/api/Login/do-reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@exemplo.com","token":"recovery-token","password":"Nova@123","confirmPassword":"Nova@123"}'
```

## 📝 Checklist de Implementação

- [ ] Criar tabela `recovery_tokens` no banco de dados
- [ ] Implementar funções do banco de dados
- [ ] Implementar endpoint `request-code-password-reset`
- [ ] Implementar endpoint `verify-recovery-code`
- [ ] Implementar endpoint `do-reset-password`
- [ ] Configurar serviço de email (SendGrid/AWS SES/SMTP)
- [ ] Testar todos os endpoints
- [ ] Atualizar arquivo `.env` no projeto Next.js com `ONC_API_BASE_URL`
- [ ] Mudar provider para ONC no projeto Next.js

Após implementar, o sistema funcionará com envio real de emails!