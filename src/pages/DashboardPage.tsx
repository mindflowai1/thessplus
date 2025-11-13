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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import './DashboardPage.css'

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
    <div className="space-y-6 dashboard-animate-fade-in">
      {/* Header */}
      <motion.div 
        className="dashboard-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Gerencie suas finanças de forma inteligente
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="dashboard-btn-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </Button>
          <Button size="sm" className="dashboard-btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="dashboard-summary-card dashboard-summary-card-income">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Total de Entradas</CardTitle>
              <div className="dashboard-summary-icon bg-blue-100 dark:bg-blue-900/30">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-summary-value text-blue-600 dark:text-blue-400">
                {formatCurrency(totals.income)}
              </div>
              <p className="dashboard-summary-label">
                {transactions.filter((t) => t.tipo === 'Entrada').length} transação(ões)
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="dashboard-summary-card dashboard-summary-card-outcome">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Total de Saídas</CardTitle>
              <div className="dashboard-summary-icon bg-red-100 dark:bg-red-900/30">
                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-summary-value text-red-600 dark:text-red-400">
                {formatCurrency(totals.outcome)}
              </div>
              <p className="dashboard-summary-label">
                {transactions.filter((t) => t.tipo === 'Saída').length} transação(ões)
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className={cn(
            "dashboard-summary-card",
            totals.balance >= 0 
              ? "dashboard-summary-card-balance" 
              : "dashboard-summary-card-balance-negative"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Saldo Atual</CardTitle>
              <div className={cn(
                "dashboard-summary-icon",
                totals.balance >= 0
                  ? "bg-green-100 dark:bg-green-900/30"
                  : "bg-red-100 dark:bg-red-900/30"
              )}>
                <Wallet className={cn(
                  "h-5 w-5",
                  totals.balance >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )} />
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
              <p className="dashboard-summary-label">
                Período selecionado
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: showFilters ? 1 : 0,
          height: showFilters ? 'auto' : 0,
          marginBottom: showFilters ? undefined : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        {showFilters && (
          <Card className="dashboard-filters-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Filtros</CardTitle>
                  <CardDescription>
                    Filtrar transações por período, categoria ou busca
                  </CardDescription>
                </div>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
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
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Data Inicial</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-200 z-10 pointer-events-none" />
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                      className="dashboard-filter-input w-full pl-10"
                      style={{ 
                        colorScheme: 'light dark'
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Data Final</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-200 z-10 pointer-events-none" />
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                      className="dashboard-filter-input w-full pl-10"
                      style={{ 
                        colorScheme: 'light dark'
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Categoria</label>
                  <Select value={selectedCategory === '__all__' ? undefined : selectedCategory} onValueChange={(value: string) => setSelectedCategory(value || '__all__')}>
                    <SelectTrigger className="dashboard-filter-input">
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-300" />
                    <Input
                      placeholder="Buscar transações..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      className="dashboard-filter-input pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="dashboard-transactions-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">Transações</CardTitle>
                <CardDescription>
                  {loading ? (
                    'Carregando...'
                  ) : (
                    <>
                      {filteredTransactions.length} transação(ões) encontrada(s)
                      {selectedIds.size > 0 && (
                        <span className="ml-2 dashboard-gradient-text font-semibold">
                          • {selectedIds.size} selecionada(s)
                        </span>
                      )}
                    </>
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {filteredTransactions.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAll}
                    className="dashboard-btn-secondary"
                  >
                    {selectedIds.size === filteredTransactions.length ? 'Desselecionar' : 'Selecionar Tudo'}
                  </Button>
                )}
                {selectedIds.size > 0 && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={deleteSelected}
                    className="dashboard-btn-primary"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir ({selectedIds.size})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="dashboard-loading">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4 dashboard-loading-spinner" />
                <p className="text-sm text-muted-foreground">Carregando transações...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="dashboard-empty-state">
                <FileText className="dashboard-empty-icon" />
                <h3 className="dashboard-empty-title">Nenhuma transação encontrada</h3>
                <p className="dashboard-empty-description">
                  {hasActiveFilters
                    ? 'Tente ajustar os filtros ou adicione uma nova transação.'
                    : 'Comece adicionando sua primeira transação.'}
                </p>
                <Button size="sm" className="dashboard-btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Transação
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      'dashboard-transaction-item',
                      transaction.tipo === 'Entrada' 
                        ? 'dashboard-transaction-income' 
                        : 'dashboard-transaction-outcome',
                      selectedIds.has(transaction.id) && 'dashboard-transaction-item-selected'
                    )}
                    onClick={() => toggleSelect(transaction.id)}
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(transaction.id)}
                        onChange={() => toggleSelect(transaction.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="dashboard-checkbox"
                      />
                      <div className={cn(
                        'dashboard-transaction-icon',
                        transaction.tipo === 'Entrada'
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                      )}>
                        {transaction.tipo === 'Entrada' ? (
                          <ArrowUpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate text-foreground">{transaction.descricao}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <span className="dashboard-badge">{transaction.categoria}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(transaction.data)}</span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'dashboard-transaction-amount flex-shrink-0',
                          transaction.tipo === 'Entrada'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-red-600 dark:text-red-400'
                        )}
                      >
                        {transaction.tipo === 'Entrada' ? '+' : '-'}
                        {formatCurrency(transaction.valor)}
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
  )
}
