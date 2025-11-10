/**
 * Código para Node "Code" no N8N
 * Processa mensagem do WhatsApp e extrai dados do evento
 */

// Mensagem recebida do WhatsApp
const message = $input.item.json.message || $input.item.json.body || '';
const from = $input.item.json.from || $input.item.json.wa_id || '';

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

// Função para processar data
function processDate(dateStr, isTomorrow = false, isToday = false) {
  if (dateStr) {
    // Data específica: "15/01"
    const [day, month] = dateStr.split('/');
    const year = new Date().getFullYear();
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } else if (isTomorrow) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  } else if (isToday) {
    return new Date().toISOString().split('T')[0];
  }
  return null;
}

// Tentar extrair dados com padrão completo
const fullMatch = message.match(patterns.full);
if (fullMatch) {
  eventData.title = fullMatch[1].trim();
  eventData.date = processDate(fullMatch[2], message.toLowerCase().includes('amanhã'), message.toLowerCase().includes('hoje'));
  
  // Processar hora
  const hour = fullMatch[3].padStart(2, '0');
  const minute = fullMatch[4] || '00';
  eventData.time = `${hour}:${minute}`;
} else {
  // Tentar padrão apenas com data
  const dateMatch = message.match(patterns.dateOnly);
  if (dateMatch) {
    eventData.title = dateMatch[1].trim();
    eventData.date = processDate(dateMatch[2], message.toLowerCase().includes('amanhã'), message.toLowerCase().includes('hoje'));
    eventData.time = '09:00'; // Hora padrão
  } else {
    // Apenas título
    const titleMatch = message.match(patterns.titleOnly);
    if (titleMatch) {
      eventData.title = titleMatch[1].trim();
      // Data padrão: amanhã
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      eventData.date = tomorrow.toISOString().split('T')[0];
      eventData.time = '09:00'; // Hora padrão
    }
  }
}

// Validar dados
if (!eventData.title) {
  return {
    error: true,
    message: 'Não foi possível identificar o título do evento. Use: "Criar evento: Título [data] [hora]"',
    from: from
  };
}

if (!eventData.date) {
  return {
    error: true,
    message: 'Não foi possível identificar a data do evento. Use: "hoje", "amanhã" ou "DD/MM"',
    from: from
  };
}

// Calcular end time (1 hora depois)
const startDateTime = new Date(`${eventData.date}T${eventData.time}:00`);
const endDateTime = new Date(startDateTime);
endDateTime.setHours(endDateTime.getHours() + 1);

eventData.startDateTime = startDateTime.toISOString();
eventData.endDateTime = endDateTime.toISOString();
eventData.error = false;

return eventData;






