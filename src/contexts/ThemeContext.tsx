import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      // Tentar ler do localStorage
      const stored = localStorage.getItem('theme') as Theme
      if (stored === 'dark' || stored === 'light') {
        return stored
      }
    } catch (error) {
      console.warn('Erro ao ler tema do localStorage:', error)
    }
    // Fallback: verificar preferência do sistema
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    }
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    
    // Remover classes anteriores para garantir limpeza (compatibilidade com Edge)
    root.classList.remove('dark', 'light')
    
    // Adicionar classe do tema atual
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Forçar atualização do atributo data-theme (compatibilidade adicional)
    root.setAttribute('data-theme', theme)
    
    // Salvar no localStorage com tratamento de erro
    try {
      localStorage.setItem('theme', theme)
    } catch (error) {
      console.warn('Erro ao salvar tema no localStorage:', error)
    }
    
    // Forçar re-render de componentes que dependem do tema
    // Disparar evento customizado para notificar mudança de tema
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themechange', { detail: theme }))
      
      // Forçar repaint no Edge (workaround para problemas de renderização)
      root.style.display = 'none'
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      root.offsetHeight // Trigger reflow
      root.style.display = ''
    }
  }, [theme])
  
  // Listener para mudanças na preferência do sistema (opcional)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Só atualizar se não houver preferência salva no localStorage
      try {
        const stored = localStorage.getItem('theme')
        if (!stored) {
          setTheme(e.matches ? 'dark' : 'light')
        }
      } catch (error) {
        console.warn('Erro ao verificar tema:', error)
      }
    }
    
    // Adicionar listener (compatibilidade com navegadores modernos)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else if (mediaQuery.addListener) {
      // Fallback para navegadores antigos
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark'
      console.log('Tema alterado:', prev, '->', newTheme)
      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

