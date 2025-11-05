# 🔐 Configuração Google OAuth - Resolvendo o Aviso de Segurança

## ⚠️ Por que esse aviso aparece?

O Google mostra esse aviso porque:
1. **O app não foi verificado pelo Google** - Apps novos precisam passar por verificação
2. **Está solicitando escopos sensíveis** - O escopo `https://www.googleapis.com/auth/calendar` é considerado sensível
3. **Modo de desenvolvimento** - O projeto OAuth está em modo de teste

## ✅ Soluções (Escolha uma)

### Opção 1: Adicionar Usuários de Teste (Recomendado para Desenvolvimento)

Esta é a solução mais rápida para desenvolvimento e testes:

1. **Acesse o Google Cloud Console:**
   - https://console.cloud.google.com
   - Vá para o seu projeto

2. **Configure OAuth Consent Screen:**
   - Vá em **APIs & Services** > **OAuth consent screen**
   - Role até a seção **Test users**
   - Clique em **+ ADD USERS**
   - Adicione os emails dos usuários que vão testar:
     - `matheusmdeabreu@gmail.com` (seu email)
     - Outros emails de teste (até 100 usuários)

3. **Salve as alterações**

4. **Teste novamente:**
   - Os usuários adicionados poderão acessar sem o aviso
   - Outros usuários ainda verão o aviso

### Opção 2: Continuar com o Aviso (Para Desenvolvimento)

Se você está apenas desenvolvendo e testando:

1. **Clique em "Ocultar avançado"** (se disponível)
2. **Clique em "Acessar Idhxfiyjopesopqiwxyk.supabase.co (não seguro)"**
3. **Confirme que você confia no desenvolvedor**
4. **Continue com o login**

Isso permitirá que você use o app, mas o aviso aparecerá sempre.

### Opção 3: Verificar o App no Google (Para Produção)

Se você vai usar em produção, precisa verificar o app:

1. **Acesse o Google Cloud Console**
2. **Vá em OAuth consent screen**
3. **Preencha todas as informações necessárias:**
   - App name
   - User support email
   - Developer contact information
   - App logo (opcional)
   - Scopes necessários
   - Privacy policy URL
   - Terms of service URL

4. **Submeta para verificação:**
   - O processo pode levar alguns dias
   - O Google vai revisar seu app
   - Depois da aprovação, o aviso desaparece

**Nota:** Este processo é necessário apenas se você vai publicar o app para uso público.

## 🔧 Configuração Atual Recomendada (Desenvolvimento)

Para desenvolvimento e testes, faça assim:

### 1. Configurar OAuth Consent Screen

1. Acesse: https://console.cloud.google.com
2. Selecione seu projeto
3. Vá em **APIs & Services** > **OAuth consent screen**
4. Configure:
   - **User Type**: External (para desenvolvimento)
   - **App name**: Thess+ (ou o nome que preferir)
   - **User support email**: Seu email
   - **Developer contact information**: Seu email

### 2. Adicionar Usuários de Teste

1. Na mesma página, role até **Test users**
2. Clique em **+ ADD USERS**
3. Adicione os emails que vão testar:
   ```
   matheusmdeabreu@gmail.com
   ```
4. Adicione outros emails de teste se necessário

### 3. Configurar Escopos

1. Na seção **Scopes**, adicione:
   - `https://www.googleapis.com/auth/calendar`
2. Salve

### 4. Configurar Credenciais

1. Vá em **APIs & Services** > **Credentials**
2. Clique no seu **OAuth 2.0 Client ID**
3. Adicione **Authorized redirect URIs**:
   ```
   https://ldhxfiyjopesopqiwxyk.supabase.co/auth/v1/callback
   http://localhost:5173
   ```

## ✅ Resultado Esperado

Após adicionar usuários de teste:
- ✅ Os usuários adicionados não verão mais o aviso
- ✅ Poderão fazer login normalmente
- ✅ O acesso ao Google Calendar funcionará
- ⚠️ Outros usuários ainda verão o aviso

## 📝 Para Produção

Quando for publicar o app:

1. **Complete o OAuth consent screen** com todas as informações
2. **Adicione Privacy Policy e Terms of Service**
3. **Submeta para verificação do Google**
4. **Aguarde a aprovação** (pode levar alguns dias)

## 🆘 Problemas Comuns

### "Acesso negado mesmo após adicionar usuário de teste"
- Verifique se o email está correto
- Certifique-se de que salvou as alterações
- Aguarde alguns minutos para a atualização propagar

### "Ainda aparece o aviso"
- Verifique se você está logado com um email de teste
- Limpe o cache do navegador
- Tente em modo anônimo/privado

### "Não consigo adicionar usuários de teste"
- Verifique se o OAuth consent screen está configurado como "External"
- Certifique-se de que está no modo de desenvolvimento

---

**Para desenvolvimento, a Opção 1 (Adicionar Usuários de Teste) é a mais rápida e prática!** 🚀


