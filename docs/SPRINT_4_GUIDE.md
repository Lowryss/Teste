# 🌟 SPRINT 4: FERRAMENTA DE HORÓSCOPO & IA

**Status**: 🟡 EM PLANEJAMENTO  
**Duração Estimada**: 2-3 horas  
**Prioridade**: ALTA

---

## 🎯 OBJETIVOS

Implementar a primeira e mais importante ferramenta do portal: o **Horóscopo Diário Personalizado**. Esta ferramenta usará os dados do perfil do usuário (Sprint 3) para gerar previsões ultra-personalizadas via Gemini AI.

---

## 📋 TAREFAS

### Parte 1: Dashboard e Navegação (30%)
- [ ] Criar página `/dashboard` real (atualmente é um placeholder)
- [ ] Card de "Resumo do Dia"
- [ ] Grid de Ferramentas (Horóscopo, Tarot, etc.)
- [ ] Widget de Pontos Cósmicos em destaque

### Parte 2: Interface do Horóscopo (40%)
- [ ] Página `/tools/horoscope`
- [ ] Design imersivo (fundo cósmico, animações)
- [ ] Seleção de Data (Hoje, Amanhã, Semana)
- [ ] Botão "Revelar Destino" (Consome pontos)
- [ ] Exibição do Resultado (Markdown formatado)

### Parte 3: Integração com IA (30%)
- [ ] Criar Next.js API Route (`app/api/horoscope/route.ts`)
  *   *Decisão Tática*: Usar API Route do Next.js ao invés de Cloud Function neste momento para facilitar testes locais.
- [ ] Integration Service para Gemini AI
- [ ] Prompt Engineering para horóscopo místico
- [ ] Consumo de dados do perfil do usuário

---

## 🗂️ ESTRUTURA DE ARQUIVOS

```
apps/web/app/
├── dashboard/
│   ├── page.tsx               # Dashboard Principal
│   └── dashboard.css          # Estilos do Dashboard
├── tools/
│   ├── horoscope/
│   │   ├── page.tsx           # UI do Horóscopo
│   │   └── horoscope.css      # Estilos Específicos
│   └── layout.tsx             # Layout para ferramentas
└── api/
    └── ai/
        └── horoscope/
            └── route.ts       # Backend Local (Gemini)
```

---

## 🤖 PROMPT DA IA

O prompt para o horóscopo deverá considerar:
1.  **Signo** (derivado da data de nascimento - *precisaremos adicionar data de nascimento ao perfil se não tiver*)
    *   *Nota*: Na Sprint 3 pegamos "Faixa Etária". Para horóscopo preciso, ideal seria Data de Nascimento. Vamos trabalhar com o Signo Solar (perguntar ao usuário na ferramenta ou inferir) ou adicionar um seletor de Signo na ferramenta.
2.  **Contexto Atual** (do perfil)
3.  **Objetivo** (Amor, Carreira, etc.)

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

- [ ] Dashboard lista as ferramentas disponíveis
- [ ] Página do Horóscopo carrega corretamente
- [ ] Usuário pode solicitar a leitura
- [ ] IA retorna texto coerente e místico
- [ ] Interface reflete o estado "Loading" de forma mágica
- [ ] Responsivo para celular

---

## 🚀 ESTRATÉGIA DE DESENVOLVIMENTO

1.  **Melhorar Dashboard**: Transformar a página atual em um hub de ferramentas.
2.  **UI Horóscopo**: Criar a experiência visual.
3.  **Lógica IA**: Conectar com Gemini.

*Criado em: 23/01/2026*
