import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/services/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, toSnakeCase } from '@/lib/utils'
import { Save, AlertCircle } from 'lucide-react'

const CATEGORIES = [
  'Alimentação',
  'Lazer',
  'Impostos',
  'Saúde',
  'Transporte',
  'Moradia',
  'Educação',
  'Outros',
]

interface Limits {
  alimentacao: number
  lazer: number
  impostos: number
  saude: number
  transporte: number
  moradia: number
  educacao: number
  outros: number
}

export function LimitsPage() {
  const { user } = useAuth()
  const [limits, setLimits] = useState<Limits>({
    alimentacao: 0,
    lazer: 0,
    impostos: 0,
    saude: 0,
    transporte: 0,
    moradia: 0,
    educacao: 0,
    outros: 0,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (user) {
      fetchLimits()
    }
  }, [user])

  const fetchLimits = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('limites_gastos')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setLimits({
          alimentacao: Number(data.alimentacao) || 0,
          lazer: Number(data.lazer) || 0,
          impostos: Number(data.impostos) || 0,
          saude: Number(data.saude) || 0,
          transporte: Number(data.transporte) || 0,
          moradia: Number(data.moradia) || 0,
          educacao: Number(data.educacao) || 0,
          outros: Number(data.outros) || 0,
        })
      }
    } catch (error) {
      console.error('Error fetching limits:', error)
      setMessage({ type: 'error', text: 'Erro ao carregar limites' })
    } finally {
      setLoading(false)
    }
  }

  const handleLimitChange = (category: string, value: string) => {
    const numericValue = parseFloat(value) || 0
    const snakeKey = toSnakeCase(category) as keyof Limits
    setLimits((prev) => ({
      ...prev,
      [snakeKey]: numericValue,
    }))
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('limites_gastos')
        .upsert({
          user_id: user.id,
          ...limits,
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'Limites salvos com sucesso!' })
    } catch (error) {
      console.error('Error saving limits:', error)
      setMessage({ type: 'error', text: 'Erro ao salvar limites' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Limites de Gastos</h1>
        <p className="text-muted-foreground">
          Defina limites mensais para cada categoria de gastos
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 dark:text-gray-200" />
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Definir Limites</CardTitle>
          <CardDescription>
            Configure os valores máximos que deseja gastar em cada categoria por mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {CATEGORIES.map((category) => {
                  const snakeKey = toSnakeCase(category) as keyof Limits
                  const value = limits[snakeKey]

                  return (
                    <div key={category} className="space-y-2">
                      <label className="text-sm font-medium">{category}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-sm text-muted-foreground">
                          R$
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={value || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLimitChange(category, e.target.value)}
                          className="pl-12"
                          placeholder="0,00"
                        />
                      </div>
                      {value > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Limite: {formatCurrency(value)}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Limites
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

