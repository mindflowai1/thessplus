import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/services/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar as CalendarIcon,
  List,
  Loader2,
  RefreshCw,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { CreateEventDialog } from '@/components/CreateEventDialog'

interface Reminder {
  id: string
  user_id: string
  title: string
  description: string | null
  date: string // DATE
  time: string | null // TIME
  google_event_id: string | null
}

// Cores para eventos
const EVENT_COLORS = [
  { bg: 'bg-blue-500', text: 'text-white', hover: 'hover:bg-blue-600', light: 'bg-blue-100', dark: 'bg-blue-900/30' },
  { bg: 'bg-green-500', text: 'text-white', hover: 'hover:bg-green-600', light: 'bg-green-100', dark: 'bg-green-900/30' },
  { bg: 'bg-orange-500', text: 'text-white', hover: 'hover:bg-orange-600', light: 'bg-orange-100', dark: 'bg-orange-900/30' },
  { bg: 'bg-purple-500', text: 'text-white', hover: 'hover:bg-purple-600', light: 'bg-purple-100', dark: 'bg-purple-900/30' },
  { bg: 'bg-pink-500', text: 'text-white', hover: 'hover:bg-pink-600', light: 'bg-pink-100', dark: 'bg-pink-900/30' },
  { bg: 'bg-red-500', text: 'text-white', hover: 'hover:bg-red-600', light: 'bg-red-100', dark: 'bg-red-900/30' },
  { bg: 'bg-indigo-500', text: 'text-white', hover: 'hover:bg-indigo-600', light: 'bg-indigo-100', dark: 'bg-indigo-900/30' },
  { bg: 'bg-teal-500', text: 'text-white', hover: 'hover:bg-teal-600', light: 'bg-teal-100', dark: 'bg-teal-900/30' },
]

// Função para obter cor baseada no ID do evento
const getEventColor = (id: string) => {
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % EVENT_COLORS.length
  return EVENT_COLORS[index]
}

export function CalendarPage() {
  const { user } = useAuth()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week')
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day
    return new Date(today.setDate(diff))
  })
  const [startHour, setStartHour] = useState(() => new Date().getHours())

  const fetchReminders = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })

      if (error) throw error

      setReminders(data || [])
    } catch (error) {
      console.error('Error fetching reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchReminders()
    }
  }, [user])

  const getWeekDays = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)
      days.push(date)
    }
    return days
  }

  const previousWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentWeekStart(newDate)
  }

  const nextWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentWeekStart(newDate)
  }

  const goToToday = () => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day
    setCurrentWeekStart(new Date(today.setDate(diff)))
  }

  const getRemindersForDayAndHour = (date: Date, hour: number) => {
    return reminders.filter(r => {
      const reminderDate = new Date(r.date)
      if (reminderDate.toDateString() !== date.toDateString()) return false
      
      // Extrai a hora do campo date (caso seja timestamptz) ou do campo time
      let reminderHour: number
      
      // Tenta extrair hora do campo date (se tiver informação de hora)
      const dateObj = new Date(r.date)
      if (dateObj.getHours() > 0 || dateObj.getMinutes() > 0) {
        // O campo date tem informação de hora
        reminderHour = dateObj.getHours()
      } else if (r.time) {
        // Usa o campo time
        const timeParts = r.time.split(':')
        reminderHour = parseInt(timeParts[0], 10)
      } else {
        // Default to 9am if no time specified
        reminderHour = 9
      }
      
      return reminderHour === hour
    })
  }

  const scrollToEarlierHours = () => {
    setStartHour(prev => Math.max(0, prev - 4))
  }

  const scrollToLaterHours = () => {
    setStartHour(prev => Math.min(16, prev + 4))
  }

  const resetToCurrentHour = () => {
    setStartHour(new Date().getHours())
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const formatTime = (timeString: string | null, dateString: string) => {
    // Tenta extrair hora do campo date primeiro (caso seja timestamptz)
    const dateObj = new Date(dateString)
    if (dateObj.getHours() > 0 || dateObj.getMinutes() > 0) {
      return dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
    
    // Usa o campo time se disponível
    if (timeString) {
      return timeString.substring(0, 5) // HH:MM
    }
    
    return '09:00' // Default time
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const weekDays = getWeekDays()
  const weekRange = `${weekDays[0].getDate()} - ${weekDays[6].getDate()} de ${weekDays[0].toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div 
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus compromissos e lembretes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Semana
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={fetchReminders} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Atualizar
          </Button>

          {viewMode === 'week' && (
            <Button variant="outline" size="sm" onClick={resetToCurrentHour}>
              <Clock className="h-4 w-4 mr-2" />
              Agora
            </Button>
          )}

          <Button 
            size="sm" 
            onClick={() => setCreateEventOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </motion.div>

      {/* Week View */}
      {viewMode === 'week' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="text-xl">{weekRange}</CardTitle>
                <div className="flex items-center gap-2">
                  {/* Navegação de semana */}
                  <Button variant="outline" size="sm" onClick={previousWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Hoje
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  {/* Navegação de horários */}
                  <div className="border-l pl-2 ml-2 flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={scrollToEarlierHours}
                      disabled={startHour === 0}
                    >
                      ↑ Anterior
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={scrollToLaterHours}
                      disabled={startHour >= 16}
                    >
                      ↓ Próximo
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Calendar Grid with Time Slots */}
              <div className="overflow-auto">
                <div className="min-w-[900px]">
                  {/* Header Row: Time + Days */}
                  <div className="grid grid-cols-8 border-b sticky top-0 bg-background z-10">
                    {/* Time column header */}
                    <div className="p-3 border-r text-xs font-medium text-muted-foreground">
                      Horário
                    </div>
                    {/* Days headers */}
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => {
                      const date = weekDays[index]
                      const today = isToday(date)
                      return (
                        <div
                          key={day}
                          className={cn(
                            'p-3 text-center border-r last:border-r-0',
                            today && 'bg-primary/10'
                          )}
                        >
                          <div className="text-xs text-muted-foreground mb-1">{day}</div>
                          <div className={cn(
                            'text-xl font-bold',
                            today && 'text-primary'
                          )}>
                            {date.getDate()}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Time Rows (8 horas começando de startHour) */}
                  {Array.from({ length: 8 }, (_, index) => {
                    const hour = Math.min(23, startHour + index)
                    return (
                    <div key={hour} className="grid grid-cols-8 border-b min-h-[80px]">
                      {/* Time label */}
                      <div className="p-3 border-r text-sm text-muted-foreground font-medium text-right">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                      
                      {/* Day cells */}
                      {weekDays.map((day, dayIndex) => {
                        const today = isToday(day)
                        const dayReminders = getRemindersForDayAndHour(day, hour)
                        
                        return (
                          <div
                            key={dayIndex}
                            className={cn(
                              'p-1.5 border-r last:border-r-0 relative',
                              today && 'bg-primary/5'
                            )}
                          >
                            {dayReminders.map((reminder) => {
                              const color = getEventColor(reminder.id)
                              return (
                                <motion.div
                                  key={reminder.id}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                  className={cn(
                                    'rounded-lg p-2 mb-1.5 cursor-pointer transition-all shadow-sm',
                                    color.bg,
                                    color.text,
                                    color.hover
                                  )}
                                >
                                  <div className="font-semibold text-xs mb-0.5">
                                    {formatTime(reminder.time, reminder.date)}
                                  </div>
                                  <div className="font-medium text-sm line-clamp-2">
                                    {reminder.title}
                                  </div>
                                  {reminder.description && (
                                    <div className="text-xs opacity-90 line-clamp-1 mt-1">
                                      {reminder.description}
                                    </div>
                                  )}
                                </motion.div>
                              )
                            })}
                          </div>
                        )
                      })}
                    </div>
                  )})}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* List View */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Todos os Lembretes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">Carregando lembretes...</p>
                </div>
              ) : reminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum lembrete encontrado</h3>
                  <p className="text-sm text-muted-foreground">
                    Você ainda não tem lembretes cadastrados.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reminders.map((reminder) => {
                    const reminderDate = new Date(reminder.date)
                    const isPast = reminderDate < new Date()
                    
                    return (
                      <div
                        key={reminder.id}
                        className={cn(
                          'p-4 rounded-lg border transition-all',
                          isPast ? 'opacity-60 bg-muted/30' : 'bg-card hover:shadow-md'
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-3 w-3 rounded-full bg-blue-500" />
                              <h3 className="font-semibold">{reminder.title}</h3>
                            </div>
                            {reminder.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {reminder.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                {formatDate(reminder.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(reminder.time, reminder.date)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Create Event Dialog */}
      <CreateEventDialog 
        open={createEventOpen}
        onOpenChange={setCreateEventOpen}
        onEventCreated={fetchReminders}
      />
    </div>
  )
}
