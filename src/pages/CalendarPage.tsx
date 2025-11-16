import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { listReminders } from '@/services/googleCalendar'
import { cn } from '@/lib/utils'
import { CreateEventDialog } from '@/components/CreateEventDialog'
import { motion } from 'framer-motion'
import './DashboardEngineering.css'

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
  const [pastEventsExpanded, setPastEventsExpanded] = useState(false)

  const fetchEvents = async () => {
    if (!user) return

    setLoading(true)
    setError(null)
    setNeedsGoogleAuth(false)
    try {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1)
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 2)

      const startDateStr = startDate.toISOString().split('T')[0]
      const endDateStr = endDate.toISOString().split('T')[0]

      const eventsList = await listReminders(startDateStr, endDateStr)

      setEvents(eventsList as CalendarEvent[])
      setNeedsGoogleAuth(false)
    } catch (err: any) {
      console.error('Error fetching calendar events:', err)
      
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
    
    const date = new Date(dateTime)
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateTime)
      return null
    }
    
    return date
  }

  const getEventEndDate = (event: CalendarEvent): Date | null => {
    const dateTime = event.end.dateTime || event.end.date
    if (!dateTime) return null
    
    const date = new Date(dateTime)
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
    
    if (!event.start.dateTime && event.start.date) {
      const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
      const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return eventDateOnly.getTime() >= todayOnly.getTime()
    }

    const endDate = getEventEndDate(event)
    if (endDate) {
      return endDate.getTime() >= now.getTime()
    }

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

  const getEventsToday = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    return upcomingEvents.filter(event => {
      const eventDate = getEventDate(event)
      if (!eventDate) return false
      const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
      return eventDateOnly.getTime() === today.getTime()
    })
  }

  const getFutureEvents = () => {
    const eventsToday = getEventsToday()
    const todayIds = new Set(eventsToday.map(e => e.id))
    return upcomingEvents.filter(event => !todayIds.has(event.id))
  }

  const getNextEvent = () => {
    const eventsToday = getEventsToday()
    if (eventsToday.length > 0) return eventsToday[0]
    const futureEvents = getFutureEvents()
    if (futureEvents.length === 0) return null
    return futureEvents[0]
  }

  const eventsToday = getEventsToday()
  const futureEvents = getFutureEvents()

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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto dashboard-animate-fade-in">
        {/* Page Title */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className={cn(
              "h-7 w-7",
              "text-amber-500 dark:text-amber-400"
            )} strokeWidth={2.5} />
            <h1 className={cn(
              "text-3xl lg:text-4xl font-bold tracking-tight",
              "text-foreground"
            )}>
              Agenda
            </h1>
          </div>
          <p className={cn(
            "text-base lg:text-lg text-muted-foreground ml-10",
            "font-medium"
          )}>
            Seus eventos e compromissos do Google Calendar
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEvents}
            disabled={loading}
            className="dashboard-btn-secondary"
          >
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
            className="dashboard-btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </motion.div>

        {/* Stats Cards */}
        {!loading && events.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="dashboard-summary-card dashboard-summary-card-income">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-foreground">Eventos Hoje</CardTitle>
                  <div className="dashboard-summary-icon bg-blue-500/20 border border-blue-500/30">
                    <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="dashboard-summary-value text-blue-600 dark:text-blue-400">
                    {getEventsToday().length}
                  </div>
                  <p className="dashboard-summary-label">
                    <span className="dashboard-badge bg-blue-500/15 border-blue-500/30 text-blue-700 dark:bg-blue-500/15 dark:border-blue-500/30 dark:text-blue-300">
                      {getEventsToday().length === 1 ? 'Evento hoje' : 'Eventos hoje'}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="dashboard-summary-card dashboard-summary-card-balance">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-foreground">Eventos Concluídos</CardTitle>
                  <div className="dashboard-summary-icon bg-green-500/20 border border-green-500/30">
                    <Clock className="h-6 w-6 text-green-600 dark:text-green-400" strokeWidth={2.5} />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="dashboard-summary-value text-green-600 dark:text-green-400">
                    {pastEvents.length}
                  </div>
                  <p className="dashboard-summary-label">
                    <span className="dashboard-badge bg-green-500/15 border-green-500/30 text-green-700 dark:bg-green-500/15 dark:border-green-500/30 dark:text-green-300">
                      Eventos concluídos
                    </span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="dashboard-summary-card dashboard-summary-card-balance">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-foreground">Próximo Evento</CardTitle>
                  <div className="dashboard-summary-icon bg-amber-500/20 border border-amber-500/30">
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" strokeWidth={2.5} />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  {getNextEvent() ? (
                    <>
                      <div className="dashboard-summary-value text-amber-600 dark:text-amber-400 text-lg lg:text-xl mb-2 line-clamp-1">
                        {formatEventDate(getNextEvent()!)}
                      </div>
                      <p className="dashboard-summary-label">
                        <span className="dashboard-badge bg-amber-500/15 border-amber-500/30 text-amber-700 dark:bg-amber-500/15 dark:border-amber-500/30 dark:text-amber-300 inline-block">
                          {getNextEvent()!.summary}
                        </span>
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="dashboard-summary-value text-amber-600 dark:text-amber-400">
                        —
                      </div>
                      <p className="dashboard-summary-label">
                        <span className="dashboard-badge bg-amber-500/15 border-amber-500/30 text-amber-700 dark:bg-amber-500/15 dark:border-amber-500/30 dark:text-amber-300">
                          Nenhum evento agendado
                        </span>
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Error Message / Google Auth Required */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={cn(
              "dashboard-card border-2",
              needsGoogleAuth 
                ? "border-blue-500/30 bg-blue-500/10"
                : "border-red-500/30 bg-red-500/10"
            )}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className={cn(
                    "h-5 w-5 mt-0.5 flex-shrink-0",
                    needsGoogleAuth 
                      ? "text-blue-400"
                      : "text-red-400"
                  )} />
                  <div className="flex-1">
                    <p className={cn(
                      "text-sm font-medium mb-1",
                      needsGoogleAuth
                        ? "text-blue-300"
                        : "text-red-300"
                    )}>
                      {needsGoogleAuth ? 'Conecte sua conta do Google' : 'Erro ao carregar eventos'}
                    </p>
                    <p className={cn(
                      "text-sm mb-3",
                      needsGoogleAuth
                        ? "text-blue-300/80"
                        : "text-red-300/80"
                    )}>{error}</p>
                    {needsGoogleAuth && (
                      <Button 
                        onClick={handleConnectGoogle}
                        className="dashboard-btn-primary"
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
          </motion.div>
        )}

        {/* Loading State */}
        {loading && events.length === 0 && (
          <Card className="dashboard-card">
            <CardContent className="dashboard-loading">
              <Loader2 className="dashboard-loading-spinner h-8 w-8 animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Carregando eventos do Google Calendar...</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <Card className="dashboard-card">
            <CardContent className="dashboard-empty-state">
              <Calendar className="dashboard-empty-icon h-12 w-12 mb-4" />
              <h3 className="dashboard-empty-title">Nenhum evento encontrado</h3>
              <p className="dashboard-empty-description mb-4">
                Você ainda não tem eventos no Google Calendar para este período.
              </p>
              <Button 
                size="sm"
                onClick={() => setCreateEventOpen(true)}
                className="dashboard-btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Evento
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Events Today - Priority Section */}
        {eventsToday.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="dashboard-section-title flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Eventos Hoje
              </h2>
              <span className="text-sm text-muted-foreground">{eventsToday.length} evento(s)</span>
            </div>
            <div className="space-y-4">
              {eventsToday.map((event, index) => {
                const endTime = formatEventEndTime(event)
                const duration = getEventDuration(event)
                const isToday = true

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "dashboard-transactions-card dashboard-transaction-item cursor-pointer",
                      isToday && "border-l-4 border-l-amber-500"
                    )}>
                      <CardHeader className="p-6">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div className="flex-1 min-w-0 w-full">
                            <div className="flex items-start gap-4 mb-4">
                              <div className={cn(
                                "dashboard-transaction-icon flex-shrink-0",
                                isToday ? "bg-amber-500/20 border-amber-500/30" : "bg-blue-500/20 border-blue-500/30"
                              )}>
                                <Calendar className={cn(
                                  "h-6 w-6",
                                  isToday ? "text-amber-400" : "text-blue-400"
                                )} strokeWidth={2.5} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg mb-2 truncate">{event.summary}</CardTitle>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
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
                                  <div className="flex gap-2">
                                    <span className="dashboard-badge bg-amber-500/15 border-amber-500/30 text-amber-300 font-medium">
                                      Hoje
                                    </span>
                                  </div>
                                </div>

                                {(event.location || (event.attendees && event.attendees.length > 0)) && (
                                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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

                                {event.description && 
                                 !event.description.includes('Para acessar informações detalhadas sobre eventos criados automaticamente') &&
                                 !event.description.includes('Este evento foi criado com base em um e-mail') &&
                                 !event.description.includes('g.co/calendar') &&
                                 !event.description.includes('mail.google.com') && (
                                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{event.description}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {event.htmlLink && (
                            <Button variant="outline" size="sm" asChild className="dashboard-btn-secondary flex-shrink-0">
                              <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Abrir
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Future Events (excluding today) */}
        {futureEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="dashboard-section-title">Próximos Eventos</h2>
              <span className="text-sm text-muted-foreground">{futureEvents.length} evento(s)</span>
            </div>
            <div className="space-y-4">
              {futureEvents.map((event, index) => {
                const daysUntil = getDaysUntilEvent(event)
                const endTime = formatEventEndTime(event)
                const duration = getEventDuration(event)

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="dashboard-transactions-card dashboard-transaction-item cursor-pointer">
                      <CardHeader className="p-6">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div className="flex-1 min-w-0 w-full">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="dashboard-transaction-icon bg-blue-500/20 border-blue-500/30 flex-shrink-0">
                                <Calendar className="h-6 w-6 text-blue-400" strokeWidth={2.5} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg mb-2 truncate">{event.summary}</CardTitle>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
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
                                    <div className="flex gap-2">
                                      <span className="dashboard-badge bg-blue-500/15 border-blue-500/30 text-blue-300">
                                        {daysUntil === 1 ? 'Amanhã' : `Em ${daysUntil} dias`}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {(event.location || (event.attendees && event.attendees.length > 0)) && (
                                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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

                                {event.description && 
                                 !event.description.includes('Para acessar informações detalhadas sobre eventos criados automaticamente') &&
                                 !event.description.includes('Este evento foi criado com base em um e-mail') &&
                                 !event.description.includes('g.co/calendar') &&
                                 !event.description.includes('mail.google.com') && (
                                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{event.description}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {event.htmlLink && (
                            <Button variant="outline" size="sm" asChild className="dashboard-btn-secondary flex-shrink-0">
                              <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Abrir
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Past Events - Collapsible */}
        {pastEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="dashboard-section-title">Eventos Concluídos</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{pastEvents.length} evento(s)</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPastEventsExpanded(!pastEventsExpanded)}
                  className="dashboard-btn-secondary"
                >
                  {pastEventsExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Mostrar
                    </>
                  )}
                </Button>
              </div>
            </div>
            {pastEventsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {pastEvents.slice(0, 10).map((event, index) => {
                  const endTime = formatEventEndTime(event)
                  const duration = getEventDuration(event)

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="dashboard-transactions-card dashboard-transaction-item opacity-70 hover:opacity-100 transition-opacity border-l-4 border-l-gray-500/30">
                        <CardHeader className="p-6">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            <div className="flex-1 min-w-0 w-full">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="dashboard-transaction-icon bg-gray-500/20 border-gray-500/30 flex-shrink-0">
                                  <Calendar className="h-6 w-6 text-gray-400" strokeWidth={2.5} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-lg mb-2 truncate">{event.summary}</CardTitle>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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

                                  {(event.location || (event.attendees && event.attendees.length > 0)) && (
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
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
                              </div>
                            </div>

                            {event.htmlLink && (
                              <Button variant="ghost" size="sm" asChild className="dashboard-btn-secondary flex-shrink-0">
                                <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Ver
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Create Event Dialog */}
        <CreateEventDialog
          open={createEventOpen}
          onOpenChange={setCreateEventOpen}
          onEventCreated={fetchEvents}
        />
      </div>
    </div>
  )
}
