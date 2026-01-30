# 🎴 SPRINT 6: TAROT DO DIA

**Status**: 🟡 INICIADA
**Objetivo**: Implementar a ferramenta de Tarot com experiência visual imersiva e interpretação via IA.

---

## 📋 TAREFAS

### Parte 1: Interface Visual
- [ ] Criar página `/tools/tarot`
- [ ] Componente `TarotDeck`: Baralho interativo com animação CSS.
- [ ] Componente `TarotCard`: Frente (arte) e Verso da carta.

### Parte 2: Lógica de Negócio
- [ ] Criar lista de cartas (Arcanos Maiores - 22 cartas para o MVP).
- [ ] Lógica de sorteio aleatório.
- [ ] Animação de "Virar Carta".

### Parte 3: API & IA
- [ ] Criar API Route `/api/ai/tarot`.
- [ ] Integrar débito de pontos (Custo: 5 pontos - produto premium).
- [ ] Prompt para interpretação profunda da carta.

---

## 🃏 LISTA DE ARCANOS (MVP)

Para começar, vamos focar nos **22 Arcanos Maiores** (O Louco, O Mago, A Sacerdotisa, etc.), pois são os mais significativos para leituras diárias e temos assets visuais mais fáceis de representar (ou gerar com IA/placeholders).

---

## 🔄 FLUXO DO USUÁRIO

1.  Acessa `/tools/tarot`.
2.  Vê um baralho fechado.
3.  Clica para "Embaralhar" (Animação).
4.  Clica para "Tirar Carta" (Custo: 5 Pontos).
5.  Carta é revelada com efeito visual.
6.  IA gera a interpretação abaixo da carta.

---

## 🎨 DESIGN

Usaremos o estilo **Glassmorphism** pesado aqui, com fundo místico roxo/dourado e efeitos de brilho nas cartas.
