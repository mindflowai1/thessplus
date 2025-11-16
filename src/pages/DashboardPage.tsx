import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/services/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Plus,
  Trash2,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Loader2,
  Filter,
  X,
  FileText,
  LayoutDashboard,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import './DashboardEngineering.css'

interface Transaction {
  id: string
  descricao: string
  tipo: 'Entrada' | 'Saída'
  categoria: string
  valor: number
  data: string
}

// interface DailyBalance {
//   data: string
//   saldo: number
// }

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

export function DashboardPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  // const [dailyBalances, setDailyBalances] = useState<DailyBalance[]>([]) // Not used
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedCategory, setSelectedCategory] = useState<string>('__all__')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(true)

  const fetchTransactions = async () => {
    if (!user) return

    setLoading(true)
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('data', `${startDate}T00:00:00`)
        .lte('data', `${endDate}T23:59:59`)
        .order('data', { ascending: false })

      if (selectedCategory && selectedCategory !== '__all__') {
        query = query.eq('categoria', selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error

      const transactions = (data || []).map((tx: any) => ({
        ...tx,
        valor: Number(tx.valor),
      })) as Transaction[]

      setTransactions(transactions)

      // Calcular saldos diários (not used currently)
      // const balances = calculateDailyBalances(transactions)
      // setDailyBalances(balances) // Not used
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  // const calculateDailyBalances = (txs: Transaction[]): DailyBalance[] => {
  //   const balancesMap = new Map<string, number>()
  //   let currentBalance = 0

  //   const sorted = [...txs].sort(
  //     (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  //   )

  //   sorted.forEach((tx) => {
  //     const date = tx.data.split('T')[0]
  //     if (tx.tipo === 'Entrada') {
  //       currentBalance += tx.valor
  //     } else {
  //       currentBalance -= tx.valor
  //     }
  //     balancesMap.set(date, currentBalance)
  //   })

  //   return Array.from(balancesMap.entries())
  //     .map(([data, saldo]) => ({ data, saldo }))
  //     .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
  // }

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user, startDate, endDate, selectedCategory])

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.tipo === 'Entrada')
      .reduce((sum, t) => sum + t.valor, 0)
    const outcome = transactions
      .filter((t) => t.tipo === 'Saída')
      .reduce((sum, t) => sum + t.valor, 0)
    return {
      income,
      outcome,
      balance: income - outcome,
    }
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    let filtered = transactions

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.descricao.toLowerCase().includes(query) ||
          t.categoria.toLowerCase().includes(query) ||
          formatDate(t.data).toLowerCase().includes(query)
      )
    }

    return filtered
  }, [transactions, searchQuery])

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const selectAll = () => {
    if (selectedIds.size === filteredTransactions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredTransactions.map((t) => t.id)))
    }
  }

  const deleteSelected = async () => {
    if (!user || selectedIds.size === 0) return

    if (!confirm(`Tem certeza que deseja excluir ${selectedIds.size} transação(ões)?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .in('id', Array.from(selectedIds))

      if (error) throw error

      setSelectedIds(new Set())
      await fetchTransactions()
    } catch (error) {
      console.error('Error deleting transactions:', error)
      alert('Erro ao excluir transações. Tente novamente.')
    }
  }

  const clearFilters = () => {
    setStartDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
    setEndDate(new Date().toISOString().split('T')[0])
    setSelectedCategory('__all__')
    setSearchQuery('')
  }

  const hasActiveFilters = (selectedCategory && selectedCategory !== '__all__') || searchQuery || 
    startDate !== new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0] ||
    endDate !== new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto dashboard-animate-fade-in">
        {/* Page Title */}
        <motion.div 
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <LayoutDashboard className={cn(
              "h-6 w-6 md:h-7 md:w-7",
              "text-amber-500 dark:text-amber-400"
            )} strokeWidth={2.5} />
            <h1 className={cn(
              "text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight",
              "text-foreground dashboard-page-title"
            )}>
              Dashboard
            </h1>
          </div>
          <p className={cn(
            "text-sm md:text-base lg:text-lg text-muted-foreground md:ml-10",
            "font-medium dashboard-page-subtitle"
          )}>
            Gerencie suas finanças com inteligência e precisão
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 md:mb-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="dashboard-btn-secondary w-full sm:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar Filtros' : 'Filtros'}
          </Button>
          <Button size="sm" className="dashboard-btn-primary w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mb-4 md:mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="dashboard-summary-card dashboard-summary-card-income">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-foreground">Total de Entradas</CardTitle>
                <div className="dashboard-summary-icon bg-blue-500/20 border border-blue-500/30">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="dashboard-summary-value text-blue-600 dark:text-blue-400">
                  {formatCurrency(totals.income)}
                </div>
                <p className="dashboard-summary-label mt-2">
                  <span className="dashboard-badge bg-blue-500/15 border-blue-500/30 text-blue-700 dark:bg-blue-500/15 dark:border-blue-500/30 dark:text-blue-300">
                    {transactions.filter((t) => t.tipo === 'Entrada').length} transação(ões)
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
            <Card className="dashboard-summary-card dashboard-summary-card-outcome">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-foreground">Total de Saídas</CardTitle>
                <div className="dashboard-summary-icon bg-red-500/20 border border-red-500/30">
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="dashboard-summary-value text-red-600 dark:text-red-400">
                  {formatCurrency(totals.outcome)}
                </div>
                <p className="dashboard-summary-label mt-2">
                  <span className="dashboard-badge bg-red-500/15 border-red-500/30 text-red-700 dark:bg-red-500/15 dark:border-red-500/30 dark:text-red-300">
                    {transactions.filter((t) => t.tipo === 'Saída').length} transação(ões)
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
            <Card className={cn(
              "dashboard-summary-card",
              totals.balance >= 0 
                ? "dashboard-summary-card-balance" 
                : "dashboard-summary-card-balance-negative"
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-foreground">Saldo Atual</CardTitle>
                <div className={cn(
                  "dashboard-summary-icon border",
                  totals.balance >= 0
                    ? "bg-green-500/20 border-green-500/30"
                    : "bg-red-500/20 border-red-500/30"
                )}>
                  <Wallet className={cn(
                    "h-6 w-6",
                    totals.balance >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )} strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "dashboard-summary-value",
                  totals.balance >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}>
                  {formatCurrency(totals.balance)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Card className="dashboard-filters-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Filter className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                    Filtros Avançados
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Filtrar transações por período, categoria ou busca
                  </CardDescription>
                </div>
                    {hasActiveFilters && (
                      <Button 
                        size="sm" 
                        onClick={clearFilters}
                        className="dashboard-filter-clear-btn"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Limpar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full max-w-full overflow-hidden">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Data Inicial</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const input = document.getElementById('start-date-input') as HTMLInputElement
                            if (input) {
                              if (typeof input.showPicker === 'function') {
                                input.showPicker()
                              } else {
                                input.focus()
                                input.click()
                              }
                            }
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-md hover:bg-amber-500/10 dark:hover:bg-amber-500/20 transition-colors cursor-pointer"
                          aria-label="Abrir calendário"
                        >
                          <Calendar className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                        </button>
                        <Input
                          id="start-date-input"
                          type="date"
                          value={startDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                          className="dashboard-filter-input pl-10 date-input-light w-full max-w-full"
                          style={{ 
                            color: '#000000',
                            WebkitTextFillColor: '#000000',
                            fontWeight: '600',
                            maxWidth: '100%',
                            boxSizing: 'border-box'
                          } as React.CSSProperties}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Data Final</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const input = document.getElementById('end-date-input') as HTMLInputElement
                            if (input) {
                              if (typeof input.showPicker === 'function') {
                                input.showPicker()
                              } else {
                                input.focus()
                                input.click()
                              }
                            }
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-md hover:bg-amber-500/10 dark:hover:bg-amber-500/20 transition-colors cursor-pointer"
                          aria-label="Abrir calendário"
                        >
                          <Calendar className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                        </button>
                        <Input
                          id="end-date-input"
                          type="date"
                          value={endDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                          className="dashboard-filter-input pl-10 date-input-light w-full max-w-full"
                          style={{ 
                            color: '#000000',
                            WebkitTextFillColor: '#000000',
                            fontWeight: '600',
                            maxWidth: '100%',
                            boxSizing: 'border-box'
                          } as React.CSSProperties}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Categoria</label>
                      <Select value={selectedCategory} onValueChange={(value: string) => setSelectedCategory(value)}>
                        <SelectTrigger className="dashboard-filter-input">
                          <SelectValue placeholder="Todas as categorias" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">
                            Todas as categorias
                          </SelectItem>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Buscar</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 dark:text-amber-400" />
                        <Input
                          placeholder="Buscar transações..."
                          value={searchQuery}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                          className="dashboard-filter-input pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="dashboard-transactions-card">
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col gap-3 md:gap-4">
                <div>
                  <CardTitle className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 md:h-5 md:w-5 text-amber-500 dark:text-amber-400" />
                    Transações Recentes
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1 text-sm">
                    {loading ? (
                      'Carregando transações...'
                    ) : (
                      <>
                        {filteredTransactions.length} transação(ões) encontrada(s)
                        {selectedIds.size > 0 && (
                          <span className="ml-2 dashboard-gradient-text font-bold">
                            • {selectedIds.size} selecionada(s)
                          </span>
                        )}
                      </>
                    )}
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {filteredTransactions.length > 0 && (
                    <Button
                      size="sm"
                      onClick={selectAll}
                      className="dashboard-btn-secondary w-full sm:w-auto"
                    >
                      {selectedIds.size === filteredTransactions.length ? 'Desselecionar' : 'Selecionar Tudo'}
                    </Button>
                  )}
                  {selectedIds.size > 0 && (
                    <Button 
                      size="sm" 
                      onClick={deleteSelected}
                      className="dashboard-btn-primary bg-red-500/20 hover:bg-red-500/30 border-red-500/30 w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir ({selectedIds.size})
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {loading ? (
                <div className="dashboard-loading">
                  <Loader2 className="h-8 w-8 md:h-10 md:w-10 animate-spin dashboard-loading-spinner mb-4" />
                  <p className="text-sm text-muted-foreground">Carregando suas transações...</p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="dashboard-empty-state">
                  <FileText className="dashboard-empty-icon h-10 w-10 md:h-12 md:w-12" />
                  <h3 className="dashboard-empty-title text-foreground text-base md:text-lg">Nenhuma transação encontrada</h3>
                  <p className="dashboard-empty-description text-muted-foreground text-sm">
                    {hasActiveFilters
                      ? 'Tente ajustar os filtros ou adicione uma nova transação.'
                      : 'Comece adicionando sua primeira transação.'}
                  </p>
                  <Button className="dashboard-btn-primary mt-4 w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Transação
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {filteredTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className={cn(
                        'dashboard-transaction-item',
                        transaction.tipo === 'Entrada' 
                          ? 'dashboard-transaction-income' 
                          : 'dashboard-transaction-outcome',
                        selectedIds.has(transaction.id) && 'dashboard-transaction-item-selected'
                      )}
                      onClick={() => toggleSelect(transaction.id)}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(transaction.id)}
                            onChange={() => toggleSelect(transaction.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="dashboard-checkbox flex-shrink-0"
                          />
                          <div className={cn(
                            'dashboard-transaction-icon border flex-shrink-0',
                            transaction.tipo === 'Entrada'
                              ? 'bg-blue-500/20 border-blue-500/30'
                              : 'bg-red-500/20 border-red-500/30'
                          )}>
                            {transaction.tipo === 'Entrada' ? (
                              <ArrowUpCircle className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                            ) : (
                              <ArrowDownCircle className="h-4 w-4 md:h-5 md:w-5 text-red-600 dark:text-red-400" strokeWidth={2.5} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold truncate text-foreground text-sm md:text-base">{transaction.descricao}</div>
                            <div className="text-xs md:text-sm text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
                              <span className="dashboard-badge text-xs">{transaction.categoria}</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5 text-amber-500 dark:text-amber-400" />
                                <span>{formatDate(transaction.data)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={cn(
                            'dashboard-transaction-amount flex-shrink-0 font-bold w-full sm:w-auto text-right',
                            transaction.tipo === 'Entrada'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-red-600 dark:text-red-400'
                          )}
                        >
                          {transaction.tipo === 'Entrada' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.valor))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
