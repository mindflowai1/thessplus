# Hero Engineering - Design System

## 🏗️ Visão Geral

Este documento descreve o novo sistema de design **Engineering Theme** implementado na NavBar e Hero Section da Landing Page do Thess+, com tema de engenharia profissional e construção.

---

## 🎨 Cores Principais

```css
--engineering-primary: #011c3a;      /* Azul escuro profissional */
--engineering-secondary: #f59e0b;    /* Âmbar/Laranja */
--engineering-accent: #2563eb;       /* Azul vibrante */
--engineering-light: #e0f2fe;        /* Azul claro */
```

### Gradientes

```css
--engineering-gradient: linear-gradient(135deg, #011c3a 0%, #0a3d62 50%, #2563eb 100%);
```

---

## 📁 Estrutura de Arquivos

```
src/pages/
├── LandingPage.tsx          # Componente principal
├── LandingPage.css          # CSS das outras seções
└── HeroEngineering.css      # CSS DEDICADO para NavBar & Hero (NOVO)
```

---

## 🚀 Componentes Implementados

### 1. **NavBar - Engineering Style**

#### Características:
- **Glass Morphism** com blur avançado
- Background: `rgba(1, 28, 58, 0.95)` com `backdrop-filter: blur(20px)`
- Border inferior animado em âmbar
- Logo com efeito de brilho (drop-shadow)
- Links com animação de underline gradient
- CTA button com shimmer effect

#### Classes CSS:
```css
.engineering-navbar
.engineering-navbar-container
.engineering-logo-wrapper
.engineering-logo-text
.engineering-nav-menu
.engineering-nav-link
.engineering-cta-button
```

#### Animações:
- **Logo Hover**: Scale + Drop shadow
- **Nav Link Hover**: Gradient underline animado
- **CTA Button**: Shimmer effect + Pulse ring

---

### 2. **Hero Section - Construction Theme**

#### Elementos Visuais:

**A. Background Layers:**
- `engineering-hero-bg`: Grid pattern tipo blueprint
- `engineering-blueprint-grid`: Grid secundário mais detalhado
- `engineering-gradient-overlay`: Gradiente animado

**B. Building Silhouettes:**
- 6 prédios com animação de "construção" (rise up)
- Windows pattern com luzes piscantes
- Efeito de profundidade com diferentes alturas

**C. Construction Crane:**
- Guindaste animado rotacionando
- Efeito de glow nos elementos

**D. Floating Particles:**
- 5 partículas flutuantes com animação float
- Glow effect em âmbar

#### Classes CSS:
```css
.engineering-hero-section
.engineering-hero-content
.engineering-hero-badge
.engineering-hero-title
.engineering-hero-title-main
.engineering-hero-title-highlight
.engineering-hero-subtitle
.engineering-hero-ctas
.engineering-hero-cta-primary
.engineering-hero-cta-secondary
```

---

### 3. **Stats Cards - Engineering Style**

#### Características:
- Background com glass morphism
- Border gradient animado
- Ícone com efeito 3D (rotateY no hover)
- Valor com gradient text
- Shimmer effect no hover

#### Classes CSS:
```css
.engineering-stats-container
.engineering-stat-card
.engineering-stat-icon
.engineering-stat-value
.engineering-stat-label
```

---

## 🎬 Animações Implementadas

### Keyframes Principais:

```css
@keyframes engineering-build-up
@keyframes engineering-slide-in
@keyframes engineering-blueprint-scan
@keyframes engineering-building-rise
@keyframes engineering-pulse-ring
@keyframes engineering-gradient-shift
@keyframes engineering-float
@keyframes engineering-rotate-slow
@keyframes engineering-shimmer
```

### Detalhes das Animações:

1. **engineering-build-up**: Elementos aparecem de baixo para cima
2. **engineering-building-rise**: Prédios "crescem" usando clip-path
3. **engineering-blueprint-scan**: Linha de scan horizontal
4. **engineering-pulse-ring**: Anel de pulso expansivo
5. **engineering-shimmer**: Efeito de brilho deslizante

---

## 🔧 Como Replicar em Outras Seções

### Passo 1: Importar o CSS

```tsx
import './HeroEngineering.css'
```

### Passo 2: Usar as Classes Base

Para criar uma nova seção com o tema de engenharia:

```tsx
<section className="engineering-section-base">
  {/* Background pattern */}
  <div className="engineering-blueprint-grid" />
  <div className="engineering-gradient-overlay" />
  
  {/* Seu conteúdo aqui */}
  <div className="engineering-content-wrapper">
    <h2 className="engineering-section-title">Título</h2>
    <p className="engineering-section-description">Descrição</p>
  </div>
</section>
```

### Passo 3: Adicionar CSS Custom

Crie classes derivadas seguindo o padrão:

```css
.engineering-[nome-da-secao] {
  position: relative;
  background: linear-gradient(135deg, #011c3a 0%, #0a3d62 50%, #2563eb 100%);
  padding: 5rem 2rem;
  overflow: hidden;
}

.engineering-[nome-da-secao]-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(245, 158, 11, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.engineering-[nome-da-secao]-card:hover {
  border-color: rgba(245, 158, 11, 0.5);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(245, 158, 11, 0.3);
}
```

---

## 📐 Padrões de Design

### 1. Cards e Containers

```css
/* Base para cards */
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 2px solid rgba(245, 158, 11, 0.2);
border-radius: 1rem;

/* Hover state */
border-color: rgba(245, 158, 11, 0.5);
box-shadow: 0 20px 40px rgba(245, 158, 11, 0.3);
```

### 2. Botões CTA

```css
/* Primary Button */
background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
box-shadow: 0 20px 40px rgba(245, 158, 11, 0.4);
animation: engineering-pulse-ring 2s ease-out infinite;

/* Secondary Button */
background: transparent;
border: 2px solid rgba(245, 158, 11, 0.5);
backdrop-filter: blur(10px);
```

### 3. Títulos com Gradient

```css
.engineering-title {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 4. Ícones

```css
.engineering-icon-wrapper {
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  border-radius: 0.75rem;
  padding: 0.75rem;
  box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
}

.engineering-icon-wrapper:hover {
  transform: rotateY(360deg) scale(1.1);
}
```

---

## 🎯 Efeitos Especiais

### 1. Shimmer Effect

```css
.element::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transform: translateX(-100%) skewX(-15deg);
}

.element:hover::after {
  animation: engineering-shimmer 1s ease;
}
```

### 2. Pulse Ring

```css
@keyframes engineering-pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
  }
  70% {
    box-shadow: 0 0 0 30px rgba(245, 158, 11, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
  }
}
```

### 3. Building Rise Animation

```css
@keyframes engineering-building-rise {
  0% {
    clip-path: inset(100% 0 0 0);
    opacity: 0;
  }
  100% {
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
}
```

---

## 📱 Responsividade

### Breakpoints:

```css
/* Desktop Large: 1200px+ */
/* Desktop: 768px - 1199px */
/* Tablet: 481px - 767px */
/* Mobile: 0px - 480px */
```

### Media Queries Implementadas:

```css
@media (max-width: 1200px) {
  .engineering-hero-title { font-size: 3.5rem; }
  .engineering-buildings { height: 50%; }
}

@media (max-width: 768px) {
  .engineering-hero-title { font-size: 2.5rem; }
  .engineering-buildings { height: 40%; }
  .engineering-crane { display: none; }
}

@media (max-width: 480px) {
  .engineering-hero-title { font-size: 2rem; }
  .engineering-buildings { height: 30%; }
}
```

---

## 🎨 Paleta de Cores Expandida

### Primárias:
- `#011c3a` - Engineering Primary (Azul escuro)
- `#f59e0b` - Engineering Secondary (Âmbar)
- `#2563eb` - Engineering Accent (Azul)

### Variações de Azul:
- `#0a3d62` - Azul médio
- `#1e3a5f` - Azul claro
- `#e0f2fe` - Azul muito claro

### Variações de Âmbar:
- `#ea580c` - Âmbar escuro
- `#fbbf24` - Âmbar claro
- `#fef3c7` - Âmbar muito claro

---

## ⚡ Performance

### Otimizações Implementadas:

1. **Animações GPU-accelerated**: Uso de `transform` e `opacity`
2. **Backdrop-filter com fallback**: Suporte para navegadores antigos
3. **Lazy loading**: Animações só iniciam quando visíveis
4. **Reduced motion**: Suporte para `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🔄 Transições Suaves

### Curvas de Bezier Personalizadas:

```css
/* Default smooth */
transition: all 0.3s ease;

/* Spring-like */
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

/* Bounce */
transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 🛠️ Personalização

### Variáveis CSS Globais:

Para personalizar o tema, altere as variáveis no `:root`:

```css
:root {
  --engineering-primary: #011c3a;
  --engineering-secondary: #f59e0b;
  --engineering-accent: #2563eb;
  --engineering-light: #e0f2fe;
  --engineering-gradient: linear-gradient(135deg, #011c3a 0%, #0a3d62 50%, #2563eb 100%);
}
```

---

## 📊 Hierarquia Visual

### Níveis de Importância:

1. **Hero Title**: 4rem (móvel) → 6rem (desktop)
2. **Section Title**: 2.5rem → 4rem
3. **Card Title**: 1.5rem → 2rem
4. **Body Text**: 1rem → 1.25rem
5. **Caption**: 0.875rem → 1rem

---

## ✅ Checklist de Implementação

Para adicionar o tema Engineering em uma nova seção:

- [ ] Importar `HeroEngineering.css`
- [ ] Adicionar classe base `.engineering-[nome-secao]`
- [ ] Incluir background pattern (blueprint grid)
- [ ] Adicionar gradient overlay
- [ ] Implementar cards com glass morphism
- [ ] Adicionar animações de entrada
- [ ] Configurar hover states
- [ ] Testar responsividade
- [ ] Adicionar reduced motion support
- [ ] Otimizar performance

---

## 🚨 Pontos de Atenção

1. **Z-index**: NavBar usa `z-index: 1000`, garanta que outros elementos não conflitem
2. **Overflow**: Hero Section usa `overflow: hidden` para conter animações
3. **Backdrop-filter**: Pode ter problemas em Firefox antigo
4. **Animações**: Podem consumir recursos em dispositivos fracos

---

## 📝 Exemplo Completo de Seção

```tsx
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import './HeroEngineering.css'

export function EngineeringSection() {
  return (
    <section className="engineering-custom-section">
      {/* Background */}
      <div className="engineering-blueprint-grid" />
      <div className="engineering-gradient-overlay" />
      
      {/* Content */}
      <div className="engineering-content-wrapper">
        {/* Badge */}
        <div className="engineering-hero-badge">
          <Sparkles />
          <span>NOVA SEÇÃO</span>
        </div>
        
        {/* Title */}
        <h2 className="engineering-hero-title">
          <span className="engineering-hero-title-main">Título Principal</span>
          <span className="engineering-hero-title-highlight">Destaque</span>
        </h2>
        
        {/* Cards Grid */}
        <div className="engineering-stats-container">
          {items.map((item, index) => (
            <motion.div
              key={index}
              className="engineering-stat-card"
              whileHover={{ y: -8 }}
            >
              <div className="engineering-stat-icon">
                <item.icon />
              </div>
              <div className="engineering-stat-value">{item.value}</div>
              <div className="engineering-stat-label">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## 🎓 Recursos de Aprendizado

### Tecnologias Utilizadas:
- **React** + **TypeScript**
- **Framer Motion** (animações)
- **CSS3** (Grid, Flexbox, Animations)
- **Tailwind CSS** (utility classes)

### Conceitos Aplicados:
- Glass Morphism
- Gradient Text
- Clip-path animations
- Backdrop filters
- CSS Custom Properties
- Responsive Design
- Accessibility (reduced motion)

---

## 📧 Suporte

Para dúvidas ou sugestões sobre o design system:
- Email: contato@thessplus.com.br
- LinkedIn: [Thees Engenharia](https://www.linkedin.com/in/fernandathees/)

---

**Desenvolvido com 💙 por Mindflow Digital**

*Design System v1.0 - Engineering Theme*


