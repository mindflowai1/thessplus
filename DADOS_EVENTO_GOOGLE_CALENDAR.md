# 📅 Dados Enviados para Google Calendar API

Este documento detalha quais dados são coletados do usuário e enviados para criar eventos no Google Calendar.

## 📋 Fluxo de Dados

```
1. Usuário preenche formulário (CreateEventDialog)
   ↓
2. Dados são enviados para createReminder()
   ↓
3. Dados são formatados e enviados para Google Calendar API
   ↓
4. Evento é criado no Google Calendar
   ↓
5. Referência é salva no banco de dados local (reminders)
```

---

## 📝 Dados Coletados do Usuário

### Formulário (`CreateEventDialog.tsx`)

O usuário preenche os seguintes campos:

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| **title** | `string` | ✅ Sim | Título do evento |
| **description** | `string` | ❌ Não | Descrição detalhada do evento |
| **date** | `string` (YYYY-MM-DD) | ✅ Sim | Data do evento |
| **startTime** | `string` (HH:MM) | ❌ Não* | Hora de início |
| **endTime** | `string` (HH:MM) | ❌ Não* | Hora de término |
| **location** | `string` | ❌ Não | Local do evento |
| **isAllDay** | `boolean` | ❌ Não | Se o evento é de dia inteiro |

\* *Obrigatório apenas se `isAllDay = false`*

**Exemplo de dados coletados:**
```typescript
{
  title: "Reunião com cliente",
  description: "Discutir projeto X",
  date: "2024-01-15",
  startTime: "14:00",
  endTime: "15:00",
  location: "Sala de reuniões",
  isAllDay: false
}
```

---

## 🔄 Dados Enviados para `createReminder()`

A função `createReminder()` recebe um objeto do tipo `Reminder`:

```typescript
interface Reminder {
  id?: string
  title: string              // ✅ Obrigatório
  description?: string       // ❌ Opcional
  date: string              // ✅ Obrigatório (YYYY-MM-DD)
  time?: string             // ❌ Opcional (HH:MM)
  googleEventId?: string    // ❌ Opcional (preenchido após criação)
}
```

**Exemplo de chamada:**
```typescript
const googleEventId = await createReminder({
  title: "Reunião com cliente",
  description: "Discutir projeto X",
  date: "2024-01-15",
  time: "14:00"  // Se isAllDay = false
})
```

**Observações:**
- Se `isAllDay = true`, o campo `time` não é enviado (fica `undefined`)
- Se `isAllDay = false`, o campo `time` contém a hora de início
- O campo `endTime` do formulário **NÃO é enviado** - a duração é calculada automaticamente (1 hora)

---

## 🌐 Dados Enviados para Google Calendar API

### Endpoint
```
POST https://www.googleapis.com/calendar/v3/calendars/primary/events
```

### Headers
```json
{
  "Authorization": "Bearer {provider_token}",
  "Content-Type": "application/json"
}
```

### Body (JSON)

O objeto enviado para a API do Google Calendar:

```json
{
  "summary": "Reunião com cliente",
  "description": "Discutir projeto X",
  "start": {
    "dateTime": "2024-01-15T14:00:00.000Z",
    "timeZone": "America/Sao_Paulo"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00.000Z",
    "timeZone": "America/Sao_Paulo"
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

### Mapeamento de Dados

| Campo do Formulário | Campo Google Calendar API | Transformação |
|---------------------|---------------------------|---------------|
| `title` | `summary` | Direto |
| `description` | `description` | Direto (ou string vazia se não fornecido) |
| `date` + `time` | `start.dateTime` | Combinado: `${date}T${time}` → ISO 8601 |
| - | `start.timeZone` | Fixo: `"America/Sao_Paulo"` |
| - | `end.dateTime` | Calculado: `start + 1 hora` |
| - | `end.timeZone` | Fixo: `"America/Sao_Paulo"` |
| - | `reminders` | Fixo: Email 24h antes + Popup 30min antes |

### Cálculo de Data/Hora

**Se `time` for fornecido:**
```typescript
const eventStart = new Date(`${reminder.date}T${reminder.time}`)
// Exemplo: "2024-01-15T14:00" → 2024-01-15T14:00:00.000Z
```

**Se `time` NÃO for fornecido (dia inteiro):**
```typescript
const eventStart = new Date(`${reminder.date}T09:00:00`)
// Exemplo: "2024-01-15T09:00:00" → 2024-01-15T09:00:00.000Z
```

**Cálculo do horário de término:**
```typescript
const eventEnd = new Date(eventStart)
eventEnd.setHours(eventEnd.getHours() + 1)  // Sempre +1 hora
```

### Lembretes (Reminders)

Os lembretes são **fixos** e configurados automaticamente:

```json
{
  "reminders": {
    "useDefault": false,
    "overrides": [
      {
        "method": "email",
        "minutes": 1440    // 24 horas antes (24 * 60 = 1440 minutos)
      },
      {
        "method": "popup",
        "minutes": 30      // 30 minutos antes
      }
    ]
  }
}
```

**Observação:** O campo `location` do formulário **NÃO é enviado** para a API do Google Calendar atualmente.

---

## 💾 Dados Salvos no Banco de Dados Local

Após criar o evento no Google Calendar, uma referência é salva na tabela `reminders`:

```sql
INSERT INTO reminders (
  user_id,
  title,
  description,
  date,
  time,
  google_event_id
) VALUES (
  'user-uuid',
  'Reunião com cliente',
  'Discutir projeto X',
  '2024-01-15',
  '14:00:00',
  'google-event-id-123'
)
```

### Campos Salvos

| Campo | Valor | Fonte |
|-------|-------|-------|
| `user_id` | UUID do usuário | `supabase.auth.getUser()` |
| `title` | Título do evento | Formulário |
| `description` | Descrição | Formulário (ou `null`) |
| `date` | Data (DATE) | Formulário |
| `time` | Hora (TIME) | Formulário (ou `null` se dia inteiro) |
| `google_event_id` | ID do evento | Retornado pela API do Google |

---

## 📊 Exemplo Completo

### 1. Usuário preenche formulário:
```typescript
{
  title: "Reunião com cliente",
  description: "Discutir projeto X",
  date: "2024-01-15",
  startTime: "14:00",
  endTime: "15:00",
  location: "Sala de reuniões",
  isAllDay: false
}
```

### 2. Dados enviados para `createReminder()`:
```typescript
{
  title: "Reunião com cliente",
  description: "Discutir projeto X",
  date: "2024-01-15",
  time: "14:00"
}
```

### 3. Dados enviados para Google Calendar API:
```json
{
  "summary": "Reunião com cliente",
  "description": "Discutir projeto X",
  "start": {
    "dateTime": "2024-01-15T14:00:00.000Z",
    "timeZone": "America/Sao_Paulo"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00.000Z",
    "timeZone": "America/Sao_Paulo"
  },
  "reminders": {
    "useDefault": false,
    "overrides": [
      { "method": "email", "minutes": 1440 },
      { "method": "popup", "minutes": 30 }
    ]
  }
}
```

### 4. Resposta da API:
```json
{
  "id": "abc123def456",
  "summary": "Reunião com cliente",
  "description": "Discutir projeto X",
  "start": {
    "dateTime": "2024-01-15T14:00:00-03:00",
    "timeZone": "America/Sao_Paulo"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00-03:00",
    "timeZone": "America/Sao_Paulo"
  },
  ...
}
```

### 5. Dados salvos no banco:
```sql
INSERT INTO reminders VALUES (
  'user-uuid',
  'Reunião com cliente',
  'Discutir projeto X',
  '2024-01-15',
  '14:00:00',
  'abc123def456'
)
```

---

## ⚠️ Observações Importantes

### Campos NÃO Enviados para Google Calendar

1. **`location`**: O campo local do formulário **não é enviado** para a API
2. **`endTime`**: O horário de término do formulário **não é usado** - sempre calculado como `start + 1 hora`

### Campos Fixos/Calculados

1. **`timeZone`**: Sempre `"America/Sao_Paulo"`
2. **`end.dateTime`**: Sempre `start + 1 hora`
3. **`reminders`**: Sempre configurado com email 24h antes e popup 30min antes

### Autenticação

- O token de autenticação (`provider_token`) é obtido da sessão do Supabase
- O token é obtido via `supabase.auth.getSession()`
- O token é válido apenas se o usuário fez login com Google OAuth

---

## 🔧 Melhorias Futuras

### Campos que poderiam ser adicionados:

1. **`location`**: Enviar local do evento para a API
2. **`endTime`**: Usar horário de término do formulário ao invés de calcular
3. **`attendees`**: Adicionar participantes ao evento
4. **`colorId`**: Definir cor do evento
5. **`recurrence`**: Adicionar recorrência (diário, semanal, etc.)

### Exemplo de implementação futura:

```typescript
const event = {
  summary: reminder.title,
  description: reminder.description || '',
  start: {
    dateTime: eventStart.toISOString(),
    timeZone: 'America/Sao_Paulo',
  },
  end: {
    dateTime: eventEnd.toISOString(),  // Usar endTime do formulário
    timeZone: 'America/Sao_Paulo',
  },
  location: reminder.location || '',  // Adicionar local
  attendees: reminder.attendees || [],  // Adicionar participantes
  reminders: {
    useDefault: false,
    overrides: [
      { method: 'email', minutes: 24 * 60 },
      { method: 'popup', minutes: 30 },
    ],
  },
}
```

---

## 📚 Referências

- [Google Calendar API - Events: insert](https://developers.google.com/calendar/api/v3/reference/events/insert)
- [Google Calendar API - Event Resource](https://developers.google.com/calendar/api/v3/reference/events#resource)
- Código fonte: `src/services/googleCalendar.ts`
- Componente: `src/components/CreateEventDialog.tsx`











