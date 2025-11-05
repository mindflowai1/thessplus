import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import {
  Calendar,
  Plus,
  Loader2,
  RefreshCw,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  CalendarDays,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import { listReminders } from '@/services/googleCalendar'
import { cn } from '@/lib/utils'
import { CreateEventDialog } from '@/components/CreateEventDialog'

interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  location?: string
  attendees?: Array<{
    email: string
    displayName?: string
  }>
  htmlLink?: string
  status?: string
}

export function CalendarPage() {
  const { user, signInWithGoogle } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsGoogleAuth, setNeedsGoogleAuth] = useState(false)
  const [createEventOpen, setCreateEventOpen] = useState(false)

  const fetchEvents = async () => {
    if (!user) return

    setLoading(true)
    setError(null)
    setNeedsGoogleAuth(false)
    try {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1) // Último mês
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 2) // Próximos 2 meses

      // Format dates as YYYY-MM-DD for the API
      const startDateStr = startDate.toISOString().split('T')[0]
      const endDateStr = endDate.toISOString().split('T')[0]

      const eventsList = await listReminders(startDateStr, endDateStr)

      setEvents(eventsList as CalendarEvent[])
      setNeedsGoogleAuth(false)
    } catch (err: any) {
      console.error('Error fetching calendar events:', err)
      
      // Check if it's a token error
      if (err.message?.includes('Google token not found')) {
        setNeedsGoogleAuth(true)
        setError('Você precisa conectar sua conta do Google Calendar para visualizar eventos.')
      } else {
        setError(err.message || 'Erro ao carregar eventos do Google Calendar. Verifique se você autorizou o acesso.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleConnectGoogle = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Error connecting to Google:', error)
      setError('Erro ao conectar com o Google. Tente novamente.')
    }
  }

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user])

  const getEventDate = (event: CalendarEvent): Date | null => {
    const dateTime = event.start.dateTime || event.start.date
    if (!dateTime) return null
    
    // Parse the date correctly
    const date = new Date(dateTime)
    // Validate the date
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateTime)
      return null
    }
    
    return date
  }

  const getEventEndDate = (event: CalendarEvent): Date | null => {
    const dateTime = event.end.dateTime || event.end.date
    if (!dateTime) return null
    
    // Parse the date correctly
    const date = new Date(dateTime)
    // Validate the date
    if (isNaN(date.getTime())) {
      console.error('Invalid end date:', dateTime)
      return null
    }
    
    return date
  }

  const formatEventDate = (event: CalendarEvent) => {
    const date = getEventDate(event)
    if (!date) return 'Data não disponível'

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    // Check if it's an all-day event
    const isAllDay = !event.start.dateTime && event.start.date

    if (eventDate.getTime() === today.getTime()) {
      if (isAllDay) {
        return 'Hoje (dia todo)'
      }
      return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    }

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (eventDate.getTime() === tomorrow.getTime()) {
      if (isAllDay) {
        return 'Amanhã (dia todo)'
      }
      return `Amanhã, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    }

    if (isAllDay) {
      return formatDate(event.start.date || '')
    }

    return `${formatDate(date.toISOString())}, ${date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  const formatEventEndTime = (event: CalendarEvent) => {
    const endDate = getEventEndDate(event)
    if (!endDate) return null

    const isAllDay = !event.end.dateTime && event.end.date
    if (isAllDay) return null

    return endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const getEventDuration = (event: CalendarEvent): string => {
    const startDate = getEventDate(event)
    const endDate = getEventEndDate(event)
    if (!startDate || !endDate) return ''

    const diffMs = endDate.getTime() - startDate.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours === 0) {
      return `${diffMinutes} min`
    }
    if (diffMinutes === 0) {
      return `${diffHours}h`
    }
    return `${diffHours}h ${diffMinutes}min`
  }

  const isEventUpcoming = (event: CalendarEvent): boolean => {
    const eventDate = getEventDate(event)
    if (!eventDate) return false

    const now = new Date()
    
    // For all-day events, compare only the date
    if (!event.start.dateTime && event.start.date) {
      const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
      const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      // All-day events are upcoming if they are today or in the future
      return eventDateOnly.getTime() >= todayOnly.getTime()
    }

    // For timed events, compare with end time (if event hasn't ended yet, it's upcoming)
    const endDate = getEventEndDate(event)
    if (endDate) {
      // Event is upcoming if it hasn't ended yet
      return endDate.getTime() >= now.getTime()
    }

    // Fallback: compare with start time
    return eventDate.getTime() >= now.getTime()
  }

  const getUpcomingEvents = () => {
    return events
      .filter(isEventUpcoming)
      .sort((a, b) => {
        const dateA = getEventDate(a)
        const dateB = getEventDate(b)
        if (!dateA || !dateB) return 0
        return dateA.getTime() - dateB.getTime()
      })
  }

  const getPastEvents = () => {
    return events
      .filter((event) => !isEventUpcoming(event))
      .sort((a, b) => {
        const dateA = getEventDate(a)
        const dateB = getEventDate(b)
        if (!dateA || !dateB) return 0
        return dateB.getTime() - dateA.getTime()
      })
  }

  const upcomingEvents = getUpcomingEvents()
  const pastEvents = getPastEvents()

  const getDaysUntilEvent = (event: CalendarEvent): number | null => {
    const eventDate = getEventDate(event)
    if (!eventDate) return null

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
    const diffTime = eventDateOnly.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground mt-1">
            Seus eventos e compromissos do Google Calendar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchEvents} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Atualizar
          </Button>
          <Button 
            size="sm"
            onClick={() => setCreateEventOpen(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && events.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingEvents.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Eventos agendados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos Passados</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pastEvents.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Eventos concluídos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Neste período</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Message / Google Auth Required */}
      {error && (
        <Card className={cn(
          "border-2",
          needsGoogleAuth 
            ? "border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20"
            : "border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20"
        )}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className={cn(
                "h-5 w-5 mt-0.5 flex-shrink-0",
                needsGoogleAuth 
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-red-600 dark:text-red-400"
              )} />
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium mb-1",
                  needsGoogleAuth
                    ? "text-blue-900 dark:text-blue-200"
                    : "text-red-900 dark:text-red-200"
                )}>
                  {needsGoogleAuth ? 'Conecte sua conta do Google' : 'Erro ao carregar eventos'}
                </p>
                <p className={cn(
                  "text-sm mb-3",
                  needsGoogleAuth
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-red-700 dark:text-red-300"
                )}>{error}</p>
                {needsGoogleAuth && (
                  <Button 
                    onClick={handleConnectGoogle}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="currentColor"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="currentColor"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="currentColor"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="currentColor"
                      />
                    </svg>
                    Conectar com Google Calendar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && events.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Carregando eventos do Google Calendar...</p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && events.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum evento encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Você ainda não tem eventos no Google Calendar para este período.
            </p>
            <Button 
              size="sm"
              onClick={() => setCreateEventOpen(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Evento
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Próximos Eventos</h2>
            <span className="text-sm text-muted-foreground">{upcomingEvents.length} evento(s)</span>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => {
              const daysUntil = getDaysUntilEvent(event)
              const endTime = formatEventEndTime(event)
              const duration = getEventDuration(event)
              const isToday = daysUntil === 0

              return (
                <Card
                  key={event.id}
                  className={cn(
                    'hover:shadow-lg transition-all cursor-pointer border-l-4',
                    isToday
                      ? 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20'
                      : 'border-l-blue-500 hover:border-l-blue-600'
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={cn(
                              'h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0',
                              isToday
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : 'bg-blue-100 dark:bg-blue-900/30'
                            )}
                          >
                            <Calendar
                              className={cn(
                                'h-6 w-6',
                                isToday ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg mb-1 truncate">{event.summary}</CardTitle>
                            <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">{formatEventDate(event)}</span>
                                {endTime && (
                                  <>
                                    <span>—</span>
                                    <span>{endTime}</span>
                                  </>
                                )}
                                {duration && (
                                  <>
                                    <span className="mx-1">•</span>
                                    <span>{duration}</span>
                                  </>
                                )}
                              </div>
                              {daysUntil !== null && daysUntil > 0 && (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                                  {daysUntil === 1 ? 'Amanhã' : `Em ${daysUntil} dias`}
                                </span>
                              )}
                              {isToday && (
                                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                                  Hoje
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {(event.location || (event.attendees && event.attendees.length > 0)) && (
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate max-w-xs">{event.location}</span>
                              </div>
                            )}
                            {event.attendees && event.attendees.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>
                                  {event.attendees.length} participante{event.attendees.length > 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{event.description}</p>
                        )}
                      </div>

                      {event.htmlLink && (
                        <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                          <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Abrir
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Eventos Passados</h2>
            <span className="text-sm text-muted-foreground">{pastEvents.length} evento(s)</span>
          </div>
          <div className="space-y-3">
            {pastEvents.slice(0, 10).map((event) => {
              const endTime = formatEventEndTime(event)
              const duration = getEventDuration(event)

              return (
                <Card key={event.id} className="opacity-70 hover:opacity-100 transition-opacity border-l-4 border-l-gray-300">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg mb-1 truncate">{event.summary}</CardTitle>
                            <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{formatEventDate(event)}</span>
                                {endTime && (
                                  <>
                                    <span>—</span>
                                    <span>{endTime}</span>
                                  </>
                                )}
                                {duration && (
                                  <>
                                    <span className="mx-1">•</span>
                                    <span>{duration}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {(event.location || (event.attendees && event.attendees.length > 0)) && (
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate max-w-xs">{event.location}</span>
                              </div>
                            )}
                            {event.attendees && event.attendees.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>
                                  {event.attendees.length} participante{event.attendees.length > 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {event.htmlLink && (
                        <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                          <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Create Event Dialog */}
      <CreateEventDialog
        open={createEventOpen}
        onOpenChange={setCreateEventOpen}
        onEventCreated={fetchEvents}
      />
    </div>
  )
}
