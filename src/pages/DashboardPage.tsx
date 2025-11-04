import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/services/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Trash2, Search, Calendar, TrendingUp, TrendingDown } from 'lucide-react'

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
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

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

      if (selectedCategory) {
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

  const deleteSelected = async () => {
    if (!user || selectedIds.size === 0) return

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
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Gerencie suas finanças de forma inteligente</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Data Inicial</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Data Final</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Categoria</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(totals.income)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(totals.outcome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totals.balance >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {formatCurrency(totals.balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transações</CardTitle>
            <CardDescription>
              {filteredTransactions.length} transação(ões) encontrada(s)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {selectedIds.size > 0 && (
              <Button variant="destructive" size="sm" onClick={deleteSelected}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir ({selectedIds.size})
              </Button>
            )}
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma transação encontrada
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedIds.has(transaction.id)
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => toggleSelect(transaction.id)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(transaction.id)}
                      onChange={() => toggleSelect(transaction.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{transaction.descricao}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.categoria} • {formatDate(transaction.data)}
                      </div>
                    </div>
                    <div
                      className={`font-bold ${
                        transaction.tipo === 'Entrada' ? 'text-green-500' : 'text-red-500'
                      }`}
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

