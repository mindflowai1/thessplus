import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar, Clock, MapPin, FileText, Loader2, Bell, CheckCircle2 } from 'lucide-react'
import { createReminder } from '@/services/googleCalendar'
import { supabase } from '@/services/supabase'
import { cn } from '@/lib/utils'

interface CreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEventCreated?: () => void
}

export function CreateEventDialog({ open, onOpenChange, onEventCreated }: CreateEventDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [location, setLocation] = useState('')
  const [isAllDay, setIsAllDay] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Por favor, informe um título para o evento.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      // Create event in Google Calendar
      const googleEventId = await createReminder({
        title,
        description,
        date,
        time: isAllDay ? undefined : startTime,
      })

      if (!googleEventId) {
        throw new Error('Erro ao criar evento no Google Calendar')
      }

      // Save to local database
      const { error: dbError } = await supabase
        .from('reminders')
        .insert({
          user_id: user.id,
          title,
          description: description || null,
          date,
          time: isAllDay ? null : startTime,
          google_event_id: googleEventId,
        })

      if (dbError) {
        console.error('Error saving reminder to database:', dbError)
        // Continue even if database save fails, as the event is already in Google Calendar
      }

      setSuccess(true)
      
      // Reset form after a delay
      setTimeout(() => {
        resetForm()
        onOpenChange(false)
        if (onEventCreated) {
          onEventCreated()
        }
      }, 1500)
    } catch (err: any) {
      console.error('Error creating event:', err)
      setError(err.message || 'Erro ao criar evento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setDate(tomorrow.toISOString().split('T')[0])
    setStartTime('09:00')
    setEndTime('10:00')
    setLocation('')
    setIsAllDay(false)
    setError(null)
    setSuccess(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      if (!newOpen) {
        resetForm()
      }
      onOpenChange(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Criar Novo Evento</DialogTitle>
          <DialogDescription>
            Adicione um novo evento à sua agenda do Google Calendar
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Evento Criado!</h3>
            <p className="text-sm text-muted-foreground text-center">
              Seu evento foi adicionado com sucesso ao Google Calendar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Título *
              </Label>
              <Input
                id="title"
                placeholder="Ex: Reunião com cliente"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                className="text-base"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Descrição
              </Label>
              <Textarea
                id="description"
                placeholder="Adicione detalhes sobre o evento..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data e Horário *
              </Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3">
                  <Label htmlFor="date" className="text-sm text-muted-foreground">
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={loading}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              {/* All Day Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  id="allDay"
                  type="checkbox"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  disabled={loading}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <Label htmlFor="allDay" className="text-sm font-normal cursor-pointer">
                  Evento de dia inteiro
                </Label>
              </div>

              {!isAllDay && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="startTime" className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Início
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      disabled={loading}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime" className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Término
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      disabled={loading}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Local
              </Label>
              <Input
                id="location"
                placeholder="Ex: Sala de reuniões, Zoom, etc."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Reminder Info */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-900">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                    Lembretes Automáticos
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Um lembrete por email será enviado 24h antes e uma notificação 30min antes do evento.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 border border-red-200 dark:border-red-900">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !title.trim()}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Criar Evento
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

