# 🚀 Guia de Deploy - Escoramento.com

Este guia fornece instruções detalhadas para fazer deploy do sistema completo em produção.

## 📋 Pré-requisitos

- Conta no MongoDB Atlas (ou servidor MongoDB)
- Conta AWS com bucket S3 configurado
- Conta em serviço de hospedagem (Vercel, Heroku, Railway, etc.)
- Git instalado
- Node.js 18+ instalado localmente

## 🗄️ 1. Configurar MongoDB Atlas

### Criar Cluster
1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita
3. Crie um novo cluster (M0 Free Tier)
4. Configure usuário e senha do banco
5. Adicione IP `0.0.0.0/0` nas Network Access (para acesso de qualquer lugar)

### Obter Connection String
```
mongodb+srv://<usuario>:<senha>@cluster0.xxxxx.mongodb.net/escoramento?retryWrites=true&w=majority
```

## ☁️ 2. Configurar AWS S3

### Criar Bucket
1. Acesse [AWS Console](https://console.aws.amazon.com/)
2. Vá para S3
3. Crie novo bucket (ex: `escoramento-uploads`)
4. Região: escolha a mais próxima (ex: `us-east-1`)
5. Desmarque "Block all public access"
6. Confirme que o bucket será público

### Configurar Permissões
Adicione a seguinte política no bucket (Permissions > Bucket Policy):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::escoramento-uploads/*"
    }
  ]
}
```

### Criar Credenciais IAM
1. Vá para IAM > Users
2. Crie novo usuário
3. Adicione permissão `AmazonS3FullAccess`
4. Gere Access Key e Secret Key
5. **Guarde as credenciais com segurança**

## 🔧 3. Deploy do Backend

### Opção A: Railway (Recomendado)

1. **Criar conta no Railway**
   - Acesse [railway.app](https://railway.app)
   - Faça login com GitHub

2. **Criar novo projeto**
   - New Project > Deploy from GitHub repo
   - Selecione o repositório
   - Selecione a pasta `backend`

3. **Configurar variáveis de ambiente**
   ```env
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=gere_um_secret_seguro_aqui
   JWT_EXPIRES_IN=7d
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=sua_access_key
   AWS_SECRET_ACCESS_KEY=sua_secret_key
   AWS_S3_BUCKET_NAME=escoramento-uploads
   FRONTEND_URL=https://seu-frontend.vercel.app
   ```

4. **Deploy**
   - Railway fará deploy automaticamente
   - Anote a URL gerada (ex: `https://backend-production-xxxx.up.railway.app`)

5. **Criar usuário admin**
   ```bash
   # Conecte via Railway CLI ou execute localmente apontando para DB de produção
   pnpm run seed
   ```

### Opção B: Heroku

```bash
# Login
heroku login

# Criar app
heroku create escoramento-api

# Configurar variáveis
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=seu_secret
heroku config:set AWS_REGION=us-east-1
heroku config:set AWS_ACCESS_KEY_ID=sua_key
heroku config:set AWS_SECRET_ACCESS_KEY=sua_secret
heroku config:set AWS_S3_BUCKET_NAME=escoramento-uploads
heroku config:set FRONTEND_URL=https://seu-frontend.vercel.app

# Deploy
git subtree push --prefix backend heroku main
```

### Opção C: Render

1. Acesse [render.com](https://render.com)
2. New > Web Service
3. Conecte repositório GitHub
4. Configure:
   - Root Directory: `backend`
   - Build Command: `pnpm install && pnpm run build`
   - Start Command: `pnpm start`
5. Adicione variáveis de ambiente
6. Deploy

## 🌐 4. Deploy do Frontend

### Opção A: Vercel (Recomendado)

1. **Criar conta na Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub

2. **Importar projeto**
   - New Project
   - Import Git Repository
   - Selecione o repositório

3. **Configurar**
   - Root Directory: `frontend`
   - Framework Preset: Next.js
   - Build Command: `pnpm run build`
   - Output Directory: `.next`

4. **Variáveis de ambiente**
   ```env
   NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app/api
   ```

5. **Deploy**
   - Vercel fará deploy automaticamente
   - Anote a URL (ex: `https://escoramento.vercel.app`)

6. **Atualizar FRONTEND_URL no backend**
   - Volte ao Railway/Heroku
   - Atualize `FRONTEND_URL` com a URL da Vercel

### Opção B: Netlify

```bash
# Instalar CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd frontend
netlify deploy --prod

# Configurar variável de ambiente no dashboard
# NEXT_PUBLIC_API_URL=https://sua-api.com/api
```

## 🔐 5. Gerar JWT Secret Seguro

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64

# Online
# https://www.grc.com/passwords.htm
```

## ✅ 6. Verificar Deploy

### Backend
```bash
# Health check
curl https://sua-api.com/health

# Deve retornar:
# {"success":true,"message":"API está funcionando","timestamp":"..."}
```

### Frontend
1. Acesse a URL do frontend
2. Teste cadastro de cliente
3. Acesse `/admin/login`
4. Faça login com admin@escoramento.com / admin123
5. Verifique dashboard

## 🔄 7. Configurar Deploy Contínuo

### GitHub Actions (Opcional)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install && npm run build
      # Adicione steps de deploy específicos do seu serviço

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm install && npm run build
      # Vercel/Netlify fazem deploy automático via GitHub
```

## 🐛 8. Troubleshooting

### Erro CORS
```
Verifique se FRONTEND_URL no backend está correto
e se NEXT_PUBLIC_API_URL no frontend aponta para API correta
```

### Erro MongoDB
```
Verifique connection string e se IP está liberado no Atlas
```

### Erro S3
```
Verifique credenciais AWS e permissões do bucket
```

### Erro 500 no backend
```
Verifique logs do serviço de hospedagem
Certifique-se que todas as variáveis de ambiente estão configuradas
```

## 📊 9. Monitoramento

### Logs
- **Railway**: Dashboard > Deployments > Logs
- **Heroku**: `heroku logs --tail`
- **Render**: Dashboard > Logs
- **Vercel**: Dashboard > Deployments > Function Logs

### Métricas
- Configure alertas para erros 500
- Monitore uso de memória e CPU
- Acompanhe tempo de resposta

## 🔒 10. Segurança Pós-Deploy

- [ ] Altere senha do usuário admin
- [ ] Configure rate limiting
- [ ] Habilite HTTPS (geralmente automático)
- [ ] Configure backup do MongoDB
- [ ] Monitore logs de acesso
- [ ] Mantenha dependências atualizadas

## 📝 11. Checklist Final

- [ ] MongoDB Atlas configurado e acessível
- [ ] AWS S3 bucket criado e público
- [ ] Backend deployado e funcionando
- [ ] Frontend deployado e funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] Usuário admin criado
- [ ] Teste de cadastro funcionando
- [ ] Teste de login funcionando
- [ ] Teste de upload funcionando
- [ ] Teste de edição funcionando
- [ ] Teste de exclusão funcionando

## 🎉 Pronto!

Seu sistema está no ar! 🚀

**URLs de exemplo:**
- Frontend: https://escoramento.vercel.app
- Backend: https://escoramento-api.railway.app
- Admin: https://escoramento.vercel.app/admin/login

---

**Dúvidas?** Consulte a documentação dos serviços ou abra uma issue no repositório.
