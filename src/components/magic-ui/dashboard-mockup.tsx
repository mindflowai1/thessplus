import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react'

export function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, rotateY: -15 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: '1000px' }}
    >
      {/* Main Dashboard Card */}
      <motion.div
        className="relative w-full max-w-2xl"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dashboard Container */}
        <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8 overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 pointer-events-none" />
          
          {/* Header */}
          <div className="relative z-10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Dashboard</h3>
                <p className="text-sm text-gray-600 mt-1">Visão geral financeira</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
            {/* Stat Card 1 */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200/50"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-semibold text-blue-900">Receitas</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">R$ 8.450</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600 font-semibold">+12.5%</span>
              </div>
            </motion.div>

            {/* Stat Card 2 */}
            <motion.div
              className="bg-gradient-to-br from-violet-50 to-violet-100/50 rounded-2xl p-4 border border-violet-200/50"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-semibold text-violet-900">Eventos</span>
              </div>
              <p className="text-2xl font-bold text-violet-900">24</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-violet-600 font-semibold">Este mês</span>
              </div>
            </motion.div>
          </div>

          {/* Chart Placeholder */}
          <div className="relative z-10 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-700">Gastos por Categoria</span>
              <span className="text-xs text-gray-500">Últimos 30 dias</span>
            </div>
            
            {/* Simplified Chart Bars */}
            <div className="flex items-end justify-between gap-2 h-32">
              {[65, 85, 45, 95, 70, 55, 80].map((height, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-violet-500 rounded-t-lg"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * i, ease: "easeOut" }}
                />
              ))}
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10 opacity-50" />
        </div>

        {/* Floating Elements Around Dashboard */}
        <motion.div
          className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-xl flex items-center justify-center"
          animate={{
            rotate: [0, 5, 0, -5, 0],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="text-3xl">💰</span>
        </motion.div>

        <motion.div
          className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-xl flex items-center justify-center"
          animate={{
            rotate: [0, -5, 0, 5, 0],
            y: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <span className="text-2xl">📊</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
