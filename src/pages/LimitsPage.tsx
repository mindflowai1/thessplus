import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/services/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, toSnakeCase } from '@/lib/utils'
import { Save, AlertCircle, TrendingUp, Target, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import './DashboardEngineering.css'

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

  const totalLimits = Object.values(limits).reduce((sum, val) => sum + val, 0)
  const categoriesWithLimits = Object.entries(limits).filter(([_, value]) => value > 0).length

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
            <TrendingUp className={cn(
              "h-7 w-7",
              "text-amber-500 dark:text-amber-400"
            )} strokeWidth={2.5} />
            <h1 className={cn(
              "text-3xl lg:text-4xl font-bold tracking-tight",
              "text-foreground"
            )}>
              Limites
            </h1>
          </div>
          <p className={cn(
            "text-base lg:text-lg text-muted-foreground ml-10",
            "font-medium"
          )}>
            Defina limites mensais para cada categoria de gastos
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="dashboard-summary-card dashboard-summary-card-balance">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-foreground">Total de Limites</CardTitle>
                <div className="dashboard-summary-icon bg-green-500/20 border border-green-500/30">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="dashboard-summary-value text-green-600 dark:text-green-400">
                  {formatCurrency(totalLimits)}
                </div>
                <p className="dashboard-summary-label mt-2">
                  <span className="dashboard-badge bg-green-500/15 border-green-500/30 text-green-700 dark:bg-green-500/15 dark:border-green-500/30 dark:text-green-300">
                    Limite mensal total
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
            <Card className="dashboard-summary-card dashboard-summary-card-income">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-foreground">Categorias Ativas</CardTitle>
                <div className="dashboard-summary-icon bg-blue-500/20 border border-blue-500/30">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="dashboard-summary-value text-blue-600 dark:text-blue-400">
                  {categoriesWithLimits}
                </div>
                <p className="dashboard-summary-label mt-2">
                  <span className="dashboard-badge bg-blue-500/15 border-blue-500/30 text-blue-700 dark:bg-blue-500/15 dark:border-blue-500/30 dark:text-blue-300">
                    de {CATEGORIES.length} categorias
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
            <Card className="dashboard-summary-card dashboard-summary-card-outcome">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-foreground">Média por Categoria</CardTitle>
                <div className="dashboard-summary-icon bg-red-500/20 border border-red-500/30">
                  <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="dashboard-summary-value text-red-600 dark:text-red-400">
                  {categoriesWithLimits > 0 ? formatCurrency(totalLimits / categoriesWithLimits) : formatCurrency(0)}
                </div>
                <p className="dashboard-summary-label mt-2">
                  <span className="dashboard-badge bg-red-500/15 border-red-500/30 text-red-700 dark:bg-red-500/15 dark:border-red-500/30 dark:text-red-300">
                    Valor médio
                  </span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <Card className={cn(
              "dashboard-card border-2",
              message.type === 'success'
                ? "border-green-500/30 bg-green-500/10"
                : "border-red-500/30 bg-red-500/10"
            )}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className={cn(
                    "h-5 w-5",
                    message.type === 'success' ? "text-green-400" : "text-red-400"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    message.type === 'success' ? "text-green-300" : "text-red-300"
                  )}>{message.text}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Limits Form */}
        <Card className="dashboard-card">
          <CardHeader className="pb-4">
            <CardTitle className="dashboard-section-title mb-2">Definir Limites</CardTitle>
            <CardDescription className="text-muted-foreground text-sm md:text-base">
              Configure os valores máximos que deseja gastar em cada categoria por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="dashboard-loading py-12">
                <div className="dashboard-loading-spinner animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-full overflow-hidden">
                  {CATEGORIES.map((category, index) => {
                    const snakeKey = toSnakeCase(category) as keyof Limits
                    const value = limits[snakeKey]

                    return (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="space-y-2.5 min-h-[100px]"
                      >
                        <label className="text-sm font-bold text-foreground block mb-1.5 leading-tight">{category}</label>
                        <div className="relative w-full">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground z-10 pointer-events-none">
                            R$
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={value || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLimitChange(category, e.target.value)}
                            className="dashboard-filter-input pl-12 pr-3 w-full max-w-full"
                            placeholder="0,00"
                            style={{ 
                              maxWidth: '100%',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        {value > 0 && (
                          <p className="text-xs text-muted-foreground mt-1.5 leading-tight">
                            Limite: {formatCurrency(value)}
                          </p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
                <div className="flex justify-end pt-4 border-t border-border">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="dashboard-btn-primary"
                  >
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
    </div>
  )
}
