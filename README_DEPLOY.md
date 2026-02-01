# 🚀 GUIA DE DEPLOY E EXECUÇÃO

Seu projeto está pronto em termos de código! Aqui está como colocar tudo para rodar.

## 1. Frontend (Web App)
O frontend já está configurado e com dependências instaladas.

Para rodar localmente:
```powershell
cd "c:\dev\Projeto teste\apps\web"
npm run dev
```
Acesse: `http://localhost:3001`

## 2. Backend (Cloud Functions)
O código das funções (`onboarding`, `userCreated`) está em `apps/functions`.
Tivemos problemas de ambiente para deploy automático. Siga estes passos para corrigir:

### Passo A: Instalar Ferramentas
Certifique-se de ter o Firebase Tools atualizado:
```powershell
npm install -g firebase-tools
```

### Passo B: Verificar Estrutura
O arquivo `firebase.json` na raiz já está configurado para apontar para `apps/functions`.

### Passo C: Tentar Deploy Manual
No terminal, na raiz do projeto (`c:\dev\Projeto teste`):

```powershell
# 1. Login (se precisar)
firebase login

# 2. Deploy
firebase deploy --only functions
```

**Se o erro "missing required..." persistir:**
1. Apague a pasta `node_modules` dentro de `apps/functions`.
2. Apague o arquivo `package-lock.json` dentro de `apps/functions`.
3. Rode `npm install` dentro de `apps/functions`.
4. Tente o deploy novamente.

## 3. Emuladores Locais (Alternativa)
Se não quiser usar a nuvem agora, você pode rodar localmente.
**Requisito**: Java JDK 11 ou superior instalado.

```powershell
firebase emulators:start
```
Isso iniciará:
- Firestore: porta 8080
- Functions: porta 5001
- Auth: porta 9099

---

## 4. Testando o Onboarding
O fluxo de onboarding depende da função `completeOnboarding`.
- Se você **conseguir o deploy**, o fluxo funcionará automaticamente em Produção/Dev.
- Se usar **emuladores**, você precisará descomentar as linhas de conexão com emulador no arquivo `apps/web/lib/firebase.ts`.

---

**Status Final do Código:**
- ✅ Frontend: 100% Pronto
- ✅ Backend Code: 100% Pronto
- ⚠️ Ambiente de Deploy: Requer ajuste manual
