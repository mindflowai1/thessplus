import { motion } from 'framer-motion'
import { DollarSign, Calendar, Target, TrendingUp, CheckCircle2, Bell } from 'lucide-react'

interface FloatingCard {
  icon: React.ElementType
  title: string
  subtitle: string
  color: string
  delay: number
  position: { top?: string; bottom?: string; left?: string; right?: string }
}

const cards: FloatingCard[] = [
  {
    icon: DollarSign,
    title: 'Conta registrada',
    subtitle: 'R$ 450,00',
    color: 'from-blue-500 to-blue-600',
    delay: 0,
    position: { top: '10%', right: '15%' }
  },
  {
    icon: Calendar,
    title: 'Compromisso adicionado',
    subtitle: 'Reunião às 14h',
    color: 'from-amber-500 to-orange-500',
    delay: 0.2,
    position: { top: '45%', right: '5%' }
  },
  {
    icon: Target,
    title: 'Meta batida',
    subtitle: '85% do objetivo',
    color: 'from-green-500 to-emerald-600',
    delay: 0.4,
    position: { bottom: '25%', right: '20%' }
  },
  {
    icon: TrendingUp,
    title: 'Economia mensal',
    subtitle: '+R$ 1.200',
    color: 'from-violet-500 to-purple-600',
    delay: 0.1,
    position: { top: '25%', right: '35%' }
  },
  {
    icon: Bell,
    title: 'Lembrete ativo',
    subtitle: 'Pagamento amanhã',
    color: 'from-rose-500 to-pink-600',
    delay: 0.3,
    position: { bottom: '15%', right: '8%' }
  }
]

export function FloatingCards() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={index}
            className="absolute"
            style={card.position}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
            }}
            transition={{ 
              duration: 0.6, 
              delay: card.delay,
              ease: "easeOut"
            }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: card.delay * 2
              }}
              className="relative"
            >
              {/* Card */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-4 min-w-[200px]">
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                
                <div className="flex items-center gap-3 relative z-10">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {card.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {card.subtitle}
                    </p>
                  </div>
                  
                  {/* Success indicator */}
                  <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={2.5} />
                </div>
              </div>

              {/* Animated ring */}
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.color} opacity-20`}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.1, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: card.delay
                }}
                style={{ filter: 'blur(8px)' }}
              />
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
