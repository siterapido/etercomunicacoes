# Eter Comunicacoes - Design System

Documentacao da identidade visual e UI/UX da plataforma Eter Comunicacoes.
Baseada na landing page institucional e aplicada em todo o sistema.

---

## 1. Paleta de Cores

### Cores Primarias (Brand)
| Token         | Hex       | Uso                                         |
|---------------|-----------|---------------------------------------------|
| `brass`       | `#004B69` | Cor primaria, botoes, links, destaques      |
| `navy`        | `#002C3D` | Variante escura da primaria, hover          |
| `champagne`   | `#3A6B80` | Texto secundario, subtitulos                |
| `teal`        | `#004B69` | Alias de brass para semantica               |

### Cores da Landing Page (Institucional)
| Token         | Hex       | Uso                                         |
|---------------|-----------|---------------------------------------------|
| `midnight`    | `#1C2D3A` | Fundo escuro hero, secoes escuras           |
| `cream`       | `#F5EAD4` | Fundo claro premium, texto sobre escuro     |
| `accent`      | `#FF7700` | CTAs principais, destaques fortes           |
| `accent-dark` | `#CD5E19` | Hover de CTAs                               |
| `steel`       | `#467192` | Arcos decorativos, hover em secoes escuras  |
| `deep`        | `#141F29` | Footer, backgrounds ultra escuros           |

### Neutros
| Token         | Hex       | Uso                                         |
|---------------|-----------|---------------------------------------------|
| `void`        | `#FFFFFF` | Background cards, modal                     |
| `charcoal`    | `#F7F9FB` | Inputs, areas de fundo                      |
| `graphite`    | `#EEF2F5` | Bordas, divisores                           |
| `stone`       | `#8A9BAE` | Texto terciario, placeholders               |
| `marble`      | `#0D1B24` | Texto principal                             |
| `alabaster`   | `#D6DEE5` | Bordas leves, scrollbar                     |
| `sand`        | `#F0F4F7` | Background global do dashboard              |

### Semanticas (Feedback)
| Token         | Hex       | Uso                                         |
|---------------|-----------|---------------------------------------------|
| `emerald`     | `#0F7B5F` | Sucesso, aprovado                           |
| `amber`       | `#C67D0A` | Alerta, pendente                            |
| `crimson`     | `#D03A2B` | Erro, reprovado, perigo                     |
| `sapphire`    | `#004B69` | Informacao                                  |

### Derivadas (Light)
| Token         | Hex       | Uso                                         |
|---------------|-----------|---------------------------------------------|
| `teal-light`  | `#E6F0F5` | Hover leve, fundo de itens                  |
| `teal-50`     | `#F0F7FA` | Fundo muito leve para cards de conteudo     |

---

## 2. Tipografia

### Familias
| Token       | Fonte            | Uso                            |
|-------------|------------------|--------------------------------|
| `display`   | Playfair Display | Titulos, headings, nomes       |
| `body`      | Inter            | Corpo de texto, UI, botoes     |
| `mono`      | JetBrains Mono   | Codigo, dados tecnicos         |

### Pesos
- **Display**: 400 (normal), 500, 600 (semibold), 700 (bold)
- **Body**: 300 (light), 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Mono**: 400

### Hierarquia de Titulos
| Elemento     | Font        | Size                          | Weight   | Tracking | Uso                     |
|--------------|-------------|-------------------------------|----------|----------|-------------------------|
| Label        | body (Inter)| 11px                          | semibold | 0.2em    | Subtitulo acima do titulo |
| H1 (Display) | display     | clamp(22px, 3vw, 28px)        | semibold | -        | Titulo de secao          |
| H2           | display     | 2xl (24px) a 3xl              | normal   | -        | Subtitulos importantes   |
| H3           | display     | lg (18px)                     | semibold | -        | Titulo de card           |
| Body         | body        | sm-base (14-16px)             | normal   | -        | Texto geral              |
| Caption      | body        | xs (12px)                     | medium   | wide     | Metadados, timestamps    |
| Micro        | body        | 10-11px                       | semibold | 0.2-0.3em| Labels uppercase         |

### Padroes de Texto Landing Page
- Labels de secao: `text-[11px] tracking-[0.3em] uppercase`
- Corpo sobre fundo escuro: `text-[#F5EAD4]/35` a `text-[#F5EAD4]/70`
- Links navbar: `text-[11px] tracking-[0.2em] uppercase`
- Estatisticas: `text-4xl md:text-5xl font-extralight`

---

## 3. Componentes UI

### Button
- **Variantes**: primary, outline, ghost, danger, success, accent
- **Tamanhos**: sm (h-8), md (h-10), lg (h-12), xl (h-14)
- **Border-radius**: `rounded-lg` (8px) / `rounded-full` para CTAs
- **Efeito hover**: `-translate-y-px` (micro elevacao)
- **Tracking**: `tracking-wide`
- **Loading state**: Spinner rotativo (Loader2)

### Card
- **Background**: `bg-void` (branco)
- **Borda**: `border border-graphite`
- **Border-radius**: `rounded-xl` (12px)
- **Padding**: `p-6` (24px)
- **Hover (hoverable)**: Barra superior animada `bg-brass`, sombra, micro elevacao

### Input
- **Background**: `bg-charcoal`
- **Borda**: `border border-graphite`
- **Border-radius**: `rounded-lg`
- **Focus**: `border-brass ring-1 ring-brass/30`
- **Label**: `text-xs font-medium uppercase tracking-widest text-stone`
- **Erro**: `border-crimson text-crimson`

### Badge
- **Formato**: Pill com dot colorido
- **Background**: Cor/12 opacidade (ex: `bg-crimson/12`)
- **Texto**: Cor cheia (ex: `text-crimson`)
- **Dot**: Circulo `w-1.5 h-1.5 rounded-full` com cor cheia

### Modal
- **Backdrop**: `bg-navy/40 backdrop-blur-sm`
- **Container**: `bg-void border border-graphite rounded-xl shadow-2xl`
- **Header**: Borda inferior, titulo com font-display
- **Animacao**: Scale 0.95 > 1 com Framer Motion

### Avatar
- **Formato**: Circulo com iniciais ou imagem
- **Background fallback**: `bg-brass text-white`
- **Tamanhos**: sm (28px), md (36px), lg (48px)

### SectionHeader
- **Label**: `text-[11px] font-semibold tracking-[0.2em] uppercase text-brass`
- **Title**: `font-display clamp(22px,3vw,28px) font-semibold text-marble`

---

## 4. Layout e Espacamento

### Containers
- **Max width geral**: `max-w-7xl` (1280px)
- **Padding paginas**: `px-6 py-12 md:px-16 lg:px-24`
- **Gap entre cards**: `gap-4` a `gap-6`

### Navbar (Dashboard)
- **Posicao**: Fixed top
- **Background**: `bg-void` > `bg-void/95 backdrop-blur` on scroll
- **Logo**: `font-display text-xl font-bold tracking-[0.3em]` com ponto teal
- **Links**: `text-stone text-[13px] font-medium` com underline animado

### Navbar (Landing)
- **Posicao**: Fixed top
- **Background**: Transparente > `bg-[midnight]/95 backdrop-blur-xl` on scroll
- **Links**: `text-[11px] tracking-[0.2em] uppercase text-cream/40`
- **CTA**: Pill outline com borda cream, hover accent

---

## 5. Animacoes e Transicoes

### Variantes Framer Motion
```ts
fadeInUp:   { opacity: 0, y: 30 } > { opacity: 1, y: 0 } // 0.5s ease
fadeIn:     { opacity: 0 } > { opacity: 1 }                // 0.3s
scaleIn:    { opacity: 0, scale: 0.95 } > { opacity: 1, scale: 1 } // 0.2s
slideRight: { opacity: 0, x: 20 } > { opacity: 1, x: 0 }  // 0.4s
```

### Stagger Container
- Children delay: `0.06s` a `0.1s`

### CSS Animations
- `fade-in-up`: Keyframe para landing page (0.8s ease)

### Reveal on Scroll (Landing)
- Threshold: 0.15
- Root margin: `0px 0px -40px 0px`
- Transition: `opacity 0.8s cubic-bezier(0.25,0.1,0.25,1)`

### Micro Interacoes
- **Botao hover**: `-translate-y-px` (1px elevacao)
- **Card hover**: `-translate-y-0.5` (2px), sombra
- **Link underline**: `w-0 > w-full` transicao
- **Image zoom**: `scale-[1.03]` em 800ms
- **Scroll indicator**: Linha gradiente de accent

---

## 6. Easing e Duracao

| Tipo           | Duracao  | Easing                          |
|----------------|----------|---------------------------------|
| Rapida (hover) | 200ms    | ease-out                        |
| Padrao         | 300ms    | ease / [0.25,0.1,0.25,1]       |
| Animacao       | 400-500ms| [0.25,0.1,0.25,1]              |
| Landing reveal | 800ms    | cubic-bezier(0.25,0.1,0.25,1)  |

---

## 7. Responsividade

### Breakpoints (Tailwind)
| Prefixo | Largura  | Uso                             |
|---------|----------|---------------------------------|
| (base)  | < 768px  | Mobile first                    |
| `md`    | >= 768px | Tablet / Layout 2 colunas       |
| `lg`    | >= 1024px| Desktop / Layout 3 colunas      |
| `xl`    | >= 1280px| Desktop largo / Sidebar layouts |

### Grids
- **Metricas**: 1 col > 2 col (sm) > 4 col (lg)
- **Projetos**: 1 col > 2 col (md)
- **Cards**: 1 col > 2 col (sm) > 3 col (lg) > 4 col (xl)
- **Servicos**: 2 col > 3 col (md)

---

## 8. Iconografia

- **Biblioteca**: Lucide React
- **Stroke width**: 1 (landing) / 1.5-2 (dashboard)
- **Tamanhos padrao**: `w-4 h-4` (UI) / `w-5 h-5` (destaque)
- **Cor padrao**: `text-stone` (neutro) / `text-brass` (ativo)

---

## 9. Scrollbar Customizada

- **Largura**: 6px
- **Track**: `bg-sand`
- **Thumb**: `bg-alabaster`, hover `bg-stone`
- **Border radius**: 3px

---

## 10. Selection

- **Background**: `rgba(0, 75, 105, 0.15)` (brass com 15% opacidade)
- **Cor do texto**: `marble`
