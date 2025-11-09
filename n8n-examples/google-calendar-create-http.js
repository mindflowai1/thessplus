/**
 * Exemplo de requisição HTTP para criar evento no Google Calendar
 * Use este código como referência para configurar o Node HTTP Request no N8N
 */

// Este é um exemplo de como configurar o HTTP Request Node no N8N
// Não é código executável, apenas referência

/**
 * CONFIGURAÇÃO DO HTTP REQUEST NODE:
 * 
 * Method: POST
 * URL: https://www.googleapis.com/calendar/v3/calendars/{{$env.GOOGLE_CALENDAR_ID}}/events
 * 
 * Authentication:
 *   Type: Generic Credential Type
 *   Generic Auth Type: Header Auth
 *   Name: Authorization
 *   Value: Bearer {{$json.accessToken}}
 * 
 * Headers:
 *   Content-Type: application/json
 * 
 * Body (JSON):
 */
const bodyExample = {
  "summary": "{{$json.eventData.title}}",
  "description": "{{$json.eventData.description || 'Criado via WhatsApp'}}",
  "start": {
    "dateTime": "{{$json.eventData.startDateTime}}",
    "timeZone": "{{$env.GOOGLE_TIMEZONE || 'America/Sao_Paulo'}}"
  },
  "end": {
    "dateTime": "{{$json.eventData.endDateTime}}",
    "timeZone": "{{$env.GOOGLE_TIMEZONE || 'America/Sao_Paulo'}}"
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
};

/**
 * RESPOSTA ESPERADA:
 * {
 *   "id": "abc123def456",
 *   "summary": "Título do Evento",
 *   "htmlLink": "https://calendar.google.com/calendar/event?eid=...",
 *   "start": { ... },
 *   "end": { ... }
 * }
 */





