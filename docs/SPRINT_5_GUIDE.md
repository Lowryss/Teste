# 💎 SPRINT 5: MONETIZAÇÃO & LOJA CÓSMICA

**Status**: 🟡 INICIADA
**Objetivo**: Implementar venda de Pontos Cósmicos para sustentar o modelo de negócio baseada em ferramentas AI.

---

## 📋 TAREFAS

### Parte 1: Infraestrutura de Pagamento
- [x] Configurar chaves Stripe (Secret/Public) no `.env.local`
- [ ] Instalar SDK `stripe` no `apps/web`
- [ ] Criar serviço `lib/stripe.ts`

### Parte 2: Loja (Frontend)
- [ ] Criar página `/shop`
- [ ] Cards de pacotes de pontos (Design Premium)
- [ ] Botão "Comprar" integrado com API

### Parte 3: Checkout (Backend)
- [ ] Criar API Route `/api/checkout` para gerar sessão do Stripe
- [ ] Criar API Route `/api/webhooks/stripe` para processar sucesso
- [ ] Testar webhook localmente com Stripe CLI

---

## 💰 PACOTES DE PONTOS (Pricing)

| Pacote | Pontos | Preço (BRL) | ID (Simulado) |
| :--- | :--- | :--- | :--- |
| **Poeira Estelar** | 50 | R$ 19,90 | `price_star_dust` |
| **Cometa Real** | 150 | R$ 49,90 | `price_comet_royal` |
| **Big Bang** | 500 | R$ 99,90 | `price_big_bang` |

*Nota: Usaremos "One-time payment" do Stripe.*

---

## 🔄 FLUXO DE COMPRA

1.  Usuário escolhe pacote na `/shop`.
2.  Frontend chama `/api/checkout` com o `priceId`.
3.  Backend cria Checkout Session no Stripe.
4.  Frontend redireciona para URL do Stripe.
5.  Usuário paga.
6.  Stripe redireciona para `/shop/success`.
7.  Stripe envia Webhook para `/api/webhooks/stripe`.
8.  Webhook valida e credita pontos no Firestore.

---

## 🚀 ESTRATÉGIA TÉCNICA

Usaremos **Webhooks** para garantir a entrega dos pontos. É mais seguro do que confiar no redirecionamento do navegador.
