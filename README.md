# Escoramento.com - Sistema de Cadastro de Clientes

Sistema full stack para cadastro de clientes com upload de arquivos para AWS S3, desenvolvido como teste técnico.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com **Express**
- **TypeScript**
- **MongoDB** com **Mongoose**
- **AWS S3** para armazenamento de arquivos
- **JWT** para autenticação
- **Multer** para upload de arquivos
- **Bcrypt** para hash de senhas

### Frontend
- **Next.js 14** com **App Router**
- **TypeScript**
- **Material UI v5**
- **React Hook Form** para gerenciamento de formulários
- **Zod** para validação de dados
- **Axios** para requisições HTTP

## 📋 Funcionalidades

### Interface do Usuário (Cliente)
- ✅ Formulário de cadastro com validação
- ✅ Upload de arquivo (imagens, PDF, DOC)
- ✅ Preview do arquivo antes do envio
- ✅ Feedback visual de sucesso/erro
- ✅ Validação em tempo real

### Interface do Operador (Admin)
- ✅ Sistema de autenticação (login/logout)
- ✅ Dashboard com listagem de clientes
- ✅ Busca por nome, email ou telefone
- ✅ Paginação de resultados
- ✅ Edição de dados do cliente
- ✅ Exclusão de clientes
- ✅ Visualização/download do arquivo enviado

## 🏗️ Estrutura do Projeto

```
escoramento-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações (DB, AWS)
│   │   ├── models/          # Modelos Mongoose
│   │   ├── controllers/     # Controladores
│   │   ├── routes/          # Rotas da API
│   │   ├── middleware/      # Middlewares (auth, errors)
│   │   ├── utils/           # Utilitários (upload S3, seed)
│   │   └── server.ts        # Arquivo principal
│   ├── .env.example         # Exemplo de variáveis de ambiente
│   ├── tsconfig.json        # Configuração TypeScript
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── page.tsx         # Página de cadastro (usuário)
    │   ├── layout.tsx       # Layout principal
    │   └── admin/
    │       ├── login/       # Página de login
    │       └── dashboard/   # Dashboard administrativo
    ├── components/
    │   ├── forms/           # Componentes de formulário
    │   └── admin/           # Componentes do admin
    ├── lib/
    │   ├── api/             # Serviços de API
    │   ├── validations/     # Schemas de validação
    │   └── theme.ts         # Tema Material UI
    ├── .env.local           # Variáveis de ambiente
    └── package.json
```

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js 18+ instalado
- MongoDB rodando localmente ou na nuvem (MongoDB Atlas)
- Conta AWS com S3 configurado
- pnpm (recomendado) ou npm

### 1. Clonar o Repositório

```bash
git clone <https://github.com/ycaina/teste-escoreamento>
cd escoramento-system
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas credenciais
nano .env
```

**Variáveis de ambiente necessárias (.env):**

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/escoramento

# JWT
JWT_SECRET=seu_jwt_secret_aqui
JWT_EXPIRES_IN=7d

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_S3_BUCKET_NAME=nome-do-bucket

# CORS
FRONTEND_URL=http://localhost:3000
```

**Criar usuário admin:**

```bash
npm run seed
```

Credenciais padrão:
- Email: `admin@escoramento.com`
- Senha: `admin123`

**Iniciar servidor:**

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo de ambiente
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Iniciar aplicação
npm run dev
```

## 🌐 Acessar a Aplicação

- **Interface do Usuário:** http://localhost:3000
- **Painel Admin:** http://localhost:3000/admin/login
- **API Backend:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/verify` - Verificar token

### Clientes
- `POST /api/clients` - Criar cliente (público)
- `GET /api/clients` - Listar clientes (protegido)
- `GET /api/clients/:id` - Buscar cliente por ID (protegido)
- `PUT /api/clients/:id` - Atualizar cliente (protegido)
- `DELETE /api/clients/:id` - Deletar cliente (protegido)

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Hash de senhas com bcrypt
- ✅ Validação de dados no backend e frontend
- ✅ CORS configurado
- ✅ Proteção de rotas sensíveis
- ✅ Limitação de tamanho de arquivo (10MB)
- ✅ Validação de tipos de arquivo permitidos

## 🎨 Diferenciais Implementados

- ✅ **TypeScript** em todo o projeto
- ✅ **Material UI v5** com tema customizado
- ✅ **React Hook Form** para performance
- ✅ **Zod** para validação robusta
- ✅ **Paginação** e **busca** no admin
- ✅ **Feedback visual** completo
- ✅ **Tratamento de erros** consistente
- ✅ **Preview de arquivo** antes do upload
- ✅ **Validação em tempo real**
- ✅ **Design responsivo**
- ✅ **Código organizado e documentado**

## 🚀 Deploy

### Backend (Heroku/Railway/Render)

```bash
# Build
npm run build

# Variáveis de ambiente necessárias no serviço
# PORT, MONGODB_URI, JWT_SECRET, AWS_*
```

### Frontend (Vercel/Netlify)

```bash
# Build
npm run build

# Variável de ambiente
# NEXT_PUBLIC_API_URL=https://sua-api.com/api
```

## 📝 Modelo de Dados

### Client
```typescript
{
  fullName: string;      // Nome completo (3-100 caracteres)
  email: string;         // Email único e válido
  phone?: string;        // Telefone opcional
  fileUrl: string;       // URL do arquivo no S3
  createdAt: Date;       // Data de criação
  updatedAt: Date;       // Data de atualização
}
```

### User
```typescript
{
  email: string;         // Email único
  password: string;      // Senha hash (min 6 caracteres)
  name: string;          // Nome do usuário
  role: 'admin' | 'operator';  // Papel do usuário
  createdAt: Date;
  updatedAt: Date;
}
```

## 🧪 Testes

Para testar o sistema:

1. Acesse http://localhost:3000
2. Preencha o formulário de cadastro
3. Faça upload de um arquivo
4. Acesse http://localhost:3000/admin/login
5. Faça login com as credenciais padrão
6. Visualize, edite e gerencie os clientes

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Entre em contato via email

## 📄 Licença

Este projeto foi desenvolvido como teste técnico para Escoramento.com.

---

**Desenvolvido por Yuri Cainã como teste técnico para Escoramento.com.**
