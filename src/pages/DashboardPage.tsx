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

interface Transaction {
  id: string
  descricao: string
  tipo: 'Entrada' | 'Saída'
  categoria: string
  valor: number
  data: string
}

interface DailyBalance {
  data: string
  saldo: number
}

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
  const [dailyBalances, setDailyBalances] = useState<DailyBalance[]>([])
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

      const transactions = (data || []).map((tx) => ({
        ...tx,
        valor: Number(tx.valor),
      })) as Transaction[]

      setTransactions(transactions)

      // Calcular saldos diários
      const balances = calculateDailyBalances(transactions)
      setDailyBalances(balances)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDailyBalances = (txs: Transaction[]): DailyBalance[] => {
    const balancesMap = new Map<string, number>()
    let currentBalance = 0

    const sorted = [...txs].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    )

    sorted.forEach((tx) => {
      const date = tx.data.split('T')[0]
      if (tx.tipo === 'Entrada') {
        currentBalance += tx.valor
      } else {
        currentBalance -= tx.valor
      }
      balancesMap.set(date, currentBalance)
    })

    return Array.from(balancesMap.entries())
      .map(([data, saldo]) => ({ data, saldo }))
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas finanças de forma inteligente
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totals.income)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter((t) => t.tipo === 'Entrada').length} transação(ões)
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totals.outcome)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter((t) => t.tipo === 'Saída').length} transação(ões)
            </p>
          </CardContent>
        </Card>

        <Card className={cn(
          "border-2",
          totals.balance >= 0 
            ? "border-green-200 dark:border-green-900" 
            : "border-red-200 dark:border-red-900"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center",
              totals.balance >= 0
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-red-100 dark:bg-red-900/30"
            )}>
              <Wallet className={cn(
                "h-4 w-4",
                totals.balance >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              totals.balance >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}>
              {formatCurrency(totals.balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Período selecionado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Filtros</CardTitle>
                <CardDescription>
                  Filtrar transações por período, categoria ou busca
                </CardDescription>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Inicial</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Final</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select value={selectedCategory === '__all__' ? undefined : selectedCategory} onValueChange={(value) => setSelectedCategory(value || '__all__')}>
                  <SelectTrigger>
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
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar transações..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Transações</CardTitle>
              <CardDescription>
                {loading ? (
                  'Carregando...'
                ) : (
                  <>
                    {filteredTransactions.length} transação(ões) encontrada(s)
                    {selectedIds.size > 0 && (
                      <span className="ml-2 text-primary font-medium">
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
                >
                  {selectedIds.size === filteredTransactions.length ? 'Desselecionar' : 'Selecionar Tudo'}
                </Button>
              )}
              {selectedIds.size > 0 && (
                <Button variant="destructive" size="sm" onClick={deleteSelected}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir ({selectedIds.size})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Carregando transações...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {hasActiveFilters
                  ? 'Tente ajustar os filtros ou adicione uma nova transação.'
                  : 'Comece adicionando sua primeira transação.'}
              </p>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Transação
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer',
                    selectedIds.has(transaction.id)
                      ? 'bg-primary/10 border-primary shadow-sm'
                      : 'bg-card hover:bg-muted/50 border-border'
                  )}
                  onClick={() => toggleSelect(transaction.id)}
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(transaction.id)}
                      onChange={() => toggleSelect(transaction.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <div className={cn(
                      'flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0',
                      transaction.tipo === 'Entrada'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                    )}>
                      {transaction.tipo === 'Entrada' ? (
                        <ArrowUpCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{transaction.descricao}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <span>{transaction.categoria}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(transaction.data)}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={cn(
                        'font-bold text-lg flex-shrink-0',
                        transaction.tipo === 'Entrada'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      )}
                    >
                      {transaction.tipo === 'Entrada' ? '+' : '-'}
                      {formatCurrency(transaction.valor)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
