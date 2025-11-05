import { supabase } from './supabase'

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3'

export interface Reminder {
  id?: string
  title: string
  description?: string
  date: string
  time?: string
  googleEventId?: string
}

/**
 * Cria um lembrete no Google Calendar
 */
export async function createReminder(reminder: Reminder): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.provider_token) {
      throw new Error('Google token not found. Please authenticate with Google.')
    }

    const eventStart = reminder.time 
      ? new Date(`${reminder.date}T${reminder.time}`)
      : new Date(`${reminder.date}T09:00:00`)

    const eventEnd = new Date(eventStart)
    eventEnd.setHours(eventEnd.getHours() + 1)

    const event = {
      summary: reminder.title,
      description: reminder.description || '',
      start: {
        dateTime: eventStart.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: eventEnd.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    }

    const response = await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.provider_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to create calendar event')
    }

    const data = await response.json()
    return data.id
  } catch (error) {
    console.error('Error creating reminder:', error)
    throw error
  }
}

/**
 * Lista os lembretes do Google Calendar
 */
export async function listReminders(startDate?: string, endDate?: string): Promise<any[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.provider_token) {
      throw new Error('Google token not found. Please authenticate with Google.')
    }

    // Parse dates safely - startDate and endDate should be in format YYYY-MM-DD
    let timeMin: string
    if (startDate) {
      // Check if it's already an ISO string or just a date string
      if (startDate.includes('T')) {
        // Already an ISO string, use it directly
        const date = new Date(startDate)
        if (isNaN(date.getTime())) {
          throw new Error(`Invalid start date: ${startDate}`)
        }
        timeMin = date.toISOString()
      } else {
        // Format YYYY-MM-DD, add time
        const date = new Date(`${startDate}T00:00:00Z`)
        if (isNaN(date.getTime())) {
          throw new Error(`Invalid start date: ${startDate}`)
        }
        timeMin = date.toISOString()
      }
    } else {
      timeMin = new Date().toISOString()
    }
    
    let timeMax: string
    if (endDate) {
      // Check if it's already an ISO string or just a date string
      if (endDate.includes('T')) {
        // Already an ISO string, use it directly
        const date = new Date(endDate)
        if (isNaN(date.getTime())) {
          throw new Error(`Invalid end date: ${endDate}`)
        }
        timeMax = date.toISOString()
      } else {
        // Format YYYY-MM-DD, add time
        const date = new Date(`${endDate}T23:59:59Z`)
        if (isNaN(date.getTime())) {
          throw new Error(`Invalid end date: ${endDate}`)
        }
        timeMax = date.toISOString()
      }
    } else {
      timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ahead
    }

    const params = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
    })

    const response = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/primary/events?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      const errorMessage = error.error?.message || 'Failed to fetch calendar events'
      
      // Provide helpful error messages for common issues
      if (response.status === 403) {
        if (errorMessage.includes('has not been used') || errorMessage.includes('disabled')) {
          throw new Error(
            'A API Google Calendar não está habilitada. ' +
            'Habilite em: https://console.cloud.google.com/apis/api/calendar-json.googleapis.com/overview?project=454059341133'
          )
        }
        throw new Error('Erro de autorização (403). Verifique se você autorizou o acesso ao Google Calendar.')
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error listing reminders:', error)
    throw error
  }
}

/**
 * Deleta um lembrete do Google Calendar
 */
export async function deleteReminder(googleEventId: string): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.provider_token) {
      throw new Error('Google token not found. Please authenticate with Google.')
    }

    const response = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/primary/events/${googleEventId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to delete calendar event')
    }
  } catch (error) {
    console.error('Error deleting reminder:', error)
    throw error
  }
}

/**
 * Atualiza um lembrete no Google Calendar
 */
export async function updateReminder(
  googleEventId: string,
  reminder: Partial<Reminder>
): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.provider_token) {
      throw new Error('Google token not found. Please authenticate with Google.')
    }

    // Primeiro, busca o evento atual
    const getResponse = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/primary/events/${googleEventId}`,
      {
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
        },
      }
    )

    if (!getResponse.ok) {
      throw new Error('Failed to fetch event for update')
    }

    const event = await getResponse.json()

    // Atualiza os campos
    if (reminder.title) event.summary = reminder.title
    if (reminder.description !== undefined) event.description = reminder.description
    
    if (reminder.date) {
      const eventStart = reminder.time
        ? new Date(`${reminder.date}T${reminder.time}`)
        : new Date(`${reminder.date}T09:00:00`)
      
      const eventEnd = new Date(eventStart)
      eventEnd.setHours(eventEnd.getHours() + 1)

      event.start = {
        dateTime: eventStart.toISOString(),
        timeZone: 'America/Sao_Paulo',
      }
      event.end = {
        dateTime: eventEnd.toISOString(),
        timeZone: 'America/Sao_Paulo',
      }
    }

    // Atualiza o evento
    const updateResponse = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/primary/events/${googleEventId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )

    if (!updateResponse.ok) {
      const error = await updateResponse.json()
      throw new Error(error.error?.message || 'Failed to update calendar event')
    }
  } catch (error) {
    console.error('Error updating reminder:', error)
    throw error
  }
}

