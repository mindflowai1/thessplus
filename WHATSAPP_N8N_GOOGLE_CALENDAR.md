# 📱 WhatsApp + N8N + Google Calendar (Sem OAuth)

Este documento explica como criar eventos no Google Calendar via WhatsApp usando N8N, **sem necessidade de login OAuth do usuário**.

## 🎯 Objetivo

Permitir que usuários criem eventos no Google Calendar enviando mensagens via WhatsApp, processadas pelo N8N, sem precisar fazer login com Google OAuth.

## 🔑 Solução: Service Account

Ao invés de usar OAuth (que requer login do usuário), usaremos **Google Service Account** que permite criar eventos programaticamente sem autenticação do usuário.

---

## 📋 Pré-requisitos

1. **Conta Google Cloud** com projeto criado
2. **N8N** instalado e configurado
3. **WhatsApp Business API** ou **Twilio WhatsApp** ou **Evolution API**
4. **Acesso ao Supabase** (para salvar referências)

---

## 🔧 Configuração Passo a Passo

### 1. Criar Service Account no Google Cloud

#### 1.1. Acessar Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Selecione seu projeto (ou crie um novo)

#### 1.2. Habilitar Google Calendar API

1. Vá em **APIs & Services** > **Library**
2. Procure por **Google Calendar API**
3. Clique em **Enable**

#### 1.3. Criar Service Account

1. Vá em **APIs & Services** > **Credentials**
2. Clique em **Create Credentials** > **Service Account**
3. Preencha:
   - **Service account name**: `n8n-calendar-bot`
   - **Service account ID**: `n8n-calendar-bot` (gerado automaticamente)
   - **Description**: `Service account para criar eventos via N8N`
4. Clique em **Create and Continue**
5. Role: Deixe vazio ou selecione **Editor** (se necessário)
6. Clique em **Done**

#### 1.4. Criar Chave JSON

1. Clique no Service Account criado
2. Vá na aba **Keys**
3. Clique em **Add Key** > **Create new key**
4. Selecione **JSON**
5. Clique em **Create**
6. **IMPORTANTE**: Salve o arquivo JSON baixado (você precisará dele no N8N)

#### 1.5. Compartilhar Calendário com Service Account

1. Acesse [Google Calendar](https://calendar.google.com)
2. Clique no calendário que deseja usar (ou crie um novo)
3. Clique em **Settings and sharing**
4. Na seção **Share with specific people**, clique em **Add people**
5. Adicione o email do Service Account (formato: `n8n-calendar-bot@seu-projeto.iam.gserviceaccount.com`)
6. Permissão: **Make changes to events**
7. Clique em **Send**

**Alternativa**: Criar um calendário compartilhado apenas para o bot

---

### 2. Configurar N8N

#### 2.1. Instalar N8N

```bash
# Via npm
npm install -g n8n

# Via Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Acesse: `http://localhost:5678`

#### 2.2. Instalar Nodes Necessários

No N8N, instale os seguintes nodes:

1. **HTTP Request** (nativo)
2. **WhatsApp** (via Evolution API ou Twilio)
3. **Google Calendar** (nativo ou custom)
4. **Code** (nativo - para processar mensagens)

#### 2.3. Configurar Variáveis de Ambiente

No N8N, configure as seguintes variáveis:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=n8n-calendar-bot@seu-projeto.iam.gserviceaccount.com
GOOGLE_CALENDAR_ID=primary  # ou ID do calendário compartilhado
GOOGLE_TIMEZONE=America/Sao_Paulo
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

---

### 3. Criar Workflow no N8N

#### 3.1. Estrutura do Workflow

```
WhatsApp Webhook
    ↓
Processar Mensagem (Code Node)
    ↓
Extrair Dados do Evento (Code Node)
    ↓
Criar Evento no Google Calendar (HTTP Request)
    ↓
Salvar no Banco de Dados (HTTP Request)
    ↓
Enviar Confirmação via WhatsApp (HTTP Request)
```

#### 3.2. Node 1: WhatsApp Webhook

**Tipo**: Webhook (HTTP Request)

**Configuração**:
- **Method**: POST
- **Path**: `/whatsapp-calendar`
- **Response Mode**: Response Node

**Exemplo de payload recebido**:
```json
{
  "from": "5531999999999",
  "message": "Criar evento: Reunião amanhã às 14h",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

#### 3.3. Node 2: Processar Mensagem (Code)

**Tipo**: Code

**Código JavaScript**:

```javascript
// Extrair dados da mensagem
const message = $input.item.json.message || $input.item.json.body;
const from = $input.item.json.from || $input.item.json.wa_id;

// Padrões de reconhecimento
const patterns = {
  // "Criar evento: Título amanhã às 14h"
  // "Criar evento: Título em 15/01 às 14h"
  // "Criar evento: Título hoje às 14h"
  full: /criar evento:\s*(.+?)\s+(?:amanhã|hoje|em\s+(\d{1,2}\/\d{1,2}))\s+às\s+(\d{1,2}):(\d{2})/i,
  
  // "Criar evento: Título amanhã"
  dateOnly: /criar evento:\s*(.+?)\s+(?:amanhã|hoje|em\s+(\d{1,2}\/\d{1,2}))/i,
  
  // "Criar evento: Título"
  titleOnly: /criar evento:\s*(.+)/i
};

let eventData = {
  title: null,
  date: null,
  time: null,
  description: null,
  from: from
};

// Tentar extrair dados com padrão completo
const fullMatch = message.match(patterns.full);
if (fullMatch) {
  eventData.title = fullMatch[1].trim();
  
  // Processar data
  if (fullMatch[2]) {
    // Data específica: "15/01"
    const [day, month] = fullMatch[2].split('/');
    const year = new Date().getFullYear();
    eventData.date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } else if (message.toLowerCase().includes('amanhã')) {
    // Amanhã
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    eventData.date = tomorrow.toISOString().split('T')[0];
  } else if (message.toLowerCase().includes('hoje')) {
    // Hoje
    eventData.date = new Date().toISOString().split('T')[0];
  }
  
  // Processar hora
  const hour = fullMatch[3].padStart(2, '0');
  const minute = fullMatch[4] || '00';
  eventData.time = `${hour}:${minute}`;
} else {
  // Tentar padrão apenas com data
  const dateMatch = message.match(patterns.dateOnly);
  if (dateMatch) {
    eventData.title = dateMatch[1].trim();
    
    if (dateMatch[2]) {
      const [day, month] = dateMatch[2].split('/');
      const year = new Date().getFullYear();
      eventData.date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (message.toLowerCase().includes('amanhã')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      eventData.date = tomorrow.toISOString().split('T')[0];
    } else if (message.toLowerCase().includes('hoje')) {
      eventData.date = new Date().toISOString().split('T')[0];
    }
    
    // Hora padrão: 09:00
    eventData.time = '09:00';
  } else {
    // Apenas título
    const titleMatch = message.match(patterns.titleOnly);
    if (titleMatch) {
      eventData.title = titleMatch[1].trim();
      // Data padrão: amanhã
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      eventData.date = tomorrow.toISOString().split('T')[0];
      // Hora padrão: 09:00
      eventData.time = '09:00';
    }
  }
}

// Validar dados
if (!eventData.title) {
  return {
    error: true,
    message: 'Não foi possível identificar o título do evento. Use: "Criar evento: Título [data] [hora]"'
  };
}

if (!eventData.date) {
  return {
    error: true,
    message: 'Não foi possível identificar a data do evento. Use: "hoje", "amanhã" ou "DD/MM"'
  };
}

return {
  ...eventData,
  error: false
};
```

#### 3.4. Node 3: Autenticar com Google (Code)

**Tipo**: Code

**Código JavaScript** (usando JWT para Service Account):

```javascript
// Carregar credenciais do Service Account
// IMPORTANTE: Armazene o JSON do Service Account como variável de ambiente
const serviceAccount = JSON.parse($env.GOOGLE_SERVICE_ACCOUNT_JSON);

// Criar JWT para autenticação
const jwt = require('jsonwebtoken');
const now = Math.floor(Date.now() / 1000);

const token = jwt.sign(
  {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600, // 1 hora
    scope: 'https://www.googleapis.com/auth/calendar'
  },
  serviceAccount.private_key,
  { algorithm: 'RS256' }
);

// Obter access token
const tokenResponse = await $http.request({
  method: 'POST',
  url: 'https://oauth2.googleapis.com/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: token
  }
});

return {
  accessToken: tokenResponse.access_token,
  eventData: $input.item.json
};
```

**Alternativa Simples**: Usar biblioteca `googleapis` no N8N (se disponível)

#### 3.5. Node 4: Criar Evento no Google Calendar (HTTP Request)

**Tipo**: HTTP Request

**Configuração**:
- **Method**: POST
- **URL**: `https://www.googleapis.com/calendar/v3/calendars/{{$env.GOOGLE_CALENDAR_ID}}/events`
- **Authentication**: Generic Credential Type
- **Generic Auth Type**: Header Auth
- **Name**: `Authorization`
- **Value**: `Bearer {{$json.accessToken}}`

**Body (JSON)**:
```json
{
  "summary": "{{$json.eventData.title}}",
  "description": "{{$json.eventData.description || 'Criado via WhatsApp'}}",
  "start": {
    "dateTime": "{{$json.eventData.date}}T{{$json.eventData.time}}:00",
    "timeZone": "{{$env.GOOGLE_TIMEZONE}}"
  },
  "end": {
    "dateTime": "{{$json.eventData.date}}T{{$json.eventData.time}}:00",
    "timeZone": "{{$env.GOOGLE_TIMEZONE}}"
  },
  "reminders": {
    "useDefault": false,
    "overrides": [
      {
        "method": "email",
        "minutes": 1440
      },
      {
        "method": "popup",
        "minutes": 30
      }
    ]
  }
}
```

**Cálculo de end time** (adicionar 1 hora):
```javascript
// No Code Node anterior, calcular end time
const startDateTime = new Date(`${eventData.date}T${eventData.time}:00`);
const endDateTime = new Date(startDateTime);
endDateTime.setHours(endDateTime.getHours() + 1);

eventData.endDateTime = endDateTime.toISOString();
```

#### 3.6. Node 5: Salvar no Banco de Dados (HTTP Request)

**Tipo**: HTTP Request

**Configuração**:
- **Method**: POST
- **URL**: `{{$env.SUPABASE_URL}}/rest/v1/reminders`
- **Authentication**: Generic Credential Type
- **Generic Auth Type**: Header Auth
- **Name**: `apikey`
- **Value**: `{{$env.SUPABASE_SERVICE_ROLE_KEY}}`
- **Additional Header**: `Authorization: Bearer {{$env.SUPABASE_SERVICE_ROLE_KEY}}`
- **Additional Header**: `Content-Type: application/json`
- **Additional Header**: `Prefer: return=representation`

**Body (JSON)**:
```json
{
  "user_id": "{{$json.eventData.from}}",
  "title": "{{$json.eventData.title}}",
  "description": "{{$json.eventData.description || null}}",
  "date": "{{$json.eventData.date}}",
  "time": "{{$json.eventData.time}}",
  "google_event_id": "{{$json.id}}"
}
```

**Nota**: Você precisará criar uma tabela ou mapear `user_id` com o número do WhatsApp.

#### 3.7. Node 6: Enviar Confirmação via WhatsApp

**Tipo**: HTTP Request (Evolution API ou Twilio)

**Configuração (Evolution API)**:
- **Method**: POST
- **URL**: `https://sua-evolution-api.com/message/sendText/{{$env.EVOLUTION_API_INSTANCE}}`
- **Headers**: 
  - `apikey: {{$env.EVOLUTION_API_KEY}}`
  - `Content-Type: application/json`

**Body (JSON)**:
```json
{
  "number": "{{$json.eventData.from}}",
  "text": "✅ Evento criado com sucesso!\n\n📅 {{$json.summary}}\n📆 Data: {{$json.start.dateTime}}\n🔗 Link: {{$json.htmlLink}}"
}
```

---

## 📝 Exemplos de Mensagens WhatsApp

### Formato 1: Completo
```
Criar evento: Reunião com cliente amanhã às 14h
```

### Formato 2: Com data específica
```
Criar evento: Apresentação em 20/01 às 10h
```

### Formato 3: Apenas título e data
```
Criar evento: Consulta médica amanhã
```

### Formato 4: Apenas título
```
Criar evento: Lembrete importante
```

---

## 🔐 Segurança

### 1. Validar Número do WhatsApp

Adicione validação para aceitar apenas números autorizados:

```javascript
const authorizedNumbers = [
  '5531999999999',
  '5531888888888'
];

if (!authorizedNumbers.includes(from)) {
  return {
    error: true,
    message: 'Número não autorizado'
  };
}
```

### 2. Rate Limiting

Configure rate limiting no N8N para evitar spam.

### 3. Sanitizar Entrada

Sempre valide e sanitize os dados recebidos do WhatsApp.

---

## 🧪 Testando

### 1. Testar Webhook

```bash
curl -X POST http://localhost:5678/webhook/whatsapp-calendar \
  -H "Content-Type: application/json" \
  -d '{
    "from": "5531999999999",
    "message": "Criar evento: Teste amanhã às 14h"
  }'
```

### 2. Verificar Evento no Google Calendar

1. Acesse [Google Calendar](https://calendar.google.com)
2. Verifique se o evento foi criado no calendário compartilhado

### 3. Verificar Banco de Dados

```sql
SELECT * FROM reminders 
WHERE google_event_id IS NOT NULL 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## 🚀 Deploy em Produção

### 1. Configurar Variáveis de Ambiente no N8N

No N8N, configure:

```env
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
GOOGLE_CALENDAR_ID=primary
GOOGLE_TIMEZONE=America/Sao_Paulo
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-key
EVOLUTION_API_KEY=sua-key
EVOLUTION_API_INSTANCE=sua-instance
```

### 2. Configurar HTTPS

Use um proxy reverso (nginx, Caddy) ou configure SSL no N8N.

### 3. Monitorar Logs

Configure logging no N8N para monitorar erros.

---

## 📚 Recursos Adicionais

### Bibliotecas Úteis

- **googleapis** (Node.js): Cliente oficial do Google APIs
- **jsonwebtoken**: Para criar JWT do Service Account
- **date-fns**: Para manipulação de datas

### Documentação

- [Google Calendar API](https://developers.google.com/calendar/api/v3/reference)
- [Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [N8N Documentation](https://docs.n8n.io/)

---

## 🔄 Fluxo Alternativo: Usar Biblioteca googleapis

Se o N8N suportar instalar pacotes npm, você pode usar a biblioteca oficial:

```javascript
const { google } = require('googleapis');

const serviceAccount = JSON.parse($env.GOOGLE_SERVICE_ACCOUNT_JSON);

const auth = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  ['https://www.googleapis.com/auth/calendar']
);

const calendar = google.calendar({ version: 'v3', auth });

const event = {
  summary: eventData.title,
  description: eventData.description || 'Criado via WhatsApp',
  start: {
    dateTime: `${eventData.date}T${eventData.time}:00`,
    timeZone: 'America/Sao_Paulo',
  },
  end: {
    dateTime: `${eventData.date}T${eventData.time}:00`,
    timeZone: 'America/Sao_Paulo',
  },
};

const result = await calendar.events.insert({
  calendarId: $env.GOOGLE_CALENDAR_ID,
  resource: event,
});

return {
  eventId: result.data.id,
  htmlLink: result.data.htmlLink,
  ...eventData
};
```

---

## ✅ Checklist de Implementação

- [ ] Criar Service Account no Google Cloud
- [ ] Habilitar Google Calendar API
- [ ] Baixar JSON do Service Account
- [ ] Compartilhar calendário com Service Account
- [ ] Instalar e configurar N8N
- [ ] Configurar webhook do WhatsApp
- [ ] Criar workflow no N8N
- [ ] Testar criação de eventos
- [ ] Configurar salvamento no banco de dados
- [ ] Configurar envio de confirmação via WhatsApp
- [ ] Implementar validações de segurança
- [ ] Fazer deploy em produção

---

**Última Atualização**: Janeiro 2025







