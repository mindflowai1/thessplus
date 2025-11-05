# 🔐 Configurar Google OAuth no Supabase

## 📋 Credenciais do Google

⚠️ **IMPORTANTE**: Substitua pelos seus valores reais do Google Cloud Console

- **Client ID**: `SEU_CLIENT_ID_AQUI.apps.googleusercontent.com`
- **Client Secret**: `SEU_CLIENT_SECRET_AQUI`

## 🚀 Passo a Passo

### 1. Acesse o Supabase Dashboard

1. Acesse: https://ldhxfiyjopesopqiwxyk.supabase.co
2. Faça login com sua conta

### 2. Configure o Google Provider

1. No menu lateral, clique em **Authentication**
2. Clique em **Providers** (ou vá em **Providers** na submenu)
3. Procure por **Google** na lista de providers
4. Clique no toggle ou no botão para **habilitar** o Google

### 3. Adicione as Credenciais

Preencha os campos:

- **Client ID (for OAuth)**:
  ```
  SEU_CLIENT_ID_AQUI.apps.googleusercontent.com
  ```

- **Client Secret (for OAuth)**:
  ```
  SEU_CLIENT_SECRET_AQUI
  ```

### 4. Configure o Escopo do Google Calendar (IMPORTANTE)

1. Procure pelo campo **Additional scopes** ou **Scopes**
2. Adicione o escopo do Google Calendar:
   ```
   https://www.googleapis.com/auth/calendar
   ```

**Nota**: Se não houver campo específico para escopos, o Supabase pode usar os escopos padrão. Nesse caso, você pode precisar configurar no Google Cloud Console.

### 5. Configure a URL de Redirecionamento no Google Cloud Console

Certifique-se de que no Google Cloud Console você tem configurado:

1. Acesse: https://console.cloud.google.com
2. Vá em **APIs & Services** > **Credentials**
3. Clique no seu **OAuth 2.0 Client ID**
4. Em **Authorized redirect URIs**, adicione:
   ```
   https://ldhxfiyjopesopqiwxyk.supabase.co/auth/v1/callback
   ```
5. Salve

### 6. Salve as Configurações no Supabase

1. Clique em **Save** ou **Save settings**
2. Aguarde a confirmação

### 7. Teste a Autenticação

1. Acesse seu app: `http://localhost:5173`
2. Vá para a página de autenticação
3. Clique em "Continuar com Google"
4. Você deve ser redirecionado para o Google
5. Após autorizar, deve voltar para o app autenticado

## ✅ Checklist de Configuração

- [ ] Google OAuth habilitado no Supabase
- [ ] Client ID adicionado no Supabase
- [ ] Client Secret adicionado no Supabase
- [ ] Escopo do Calendar adicionado (se possível)
- [ ] URI de redirecionamento configurada no Google Cloud Console
- [ ] Usuários de teste adicionados no Google Cloud Console (para evitar avisos)

## 🆘 Problemas Comuns

### Erro: "redirect_uri_mismatch"
- Verifique se a URI de redirecionamento no Google Cloud Console está correta:
  - `https://ldhxfiyjopesopqiwxyk.supabase.co/auth/v1/callback`

### Erro: "invalid_client"
- Verifique se o Client ID e Client Secret estão corretos
- Verifique se não há espaços extras ao copiar

### Erro: "access_denied"
- Verifique se o escopo do Calendar está configurado
- Verifique se você autorizou todos os escopos necessários

### Aviso de "App não verificado"
- Veja o arquivo `GOOGLE_OAUTH_SETUP.md` para resolver isso
- Adicione seu email como usuário de teste no Google Cloud Console

## 📝 Próximos Passos

Após configurar:
1. Teste a autenticação com Google
2. Verifique se o token do Google está sendo salvo
3. Teste a criação de lembretes no Google Calendar
4. Verifique se os eventos aparecem no seu Google Calendar

---

**Após configurar, teste a autenticação!** 🚀


