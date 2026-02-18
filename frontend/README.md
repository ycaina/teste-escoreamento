# Frontend - Escoramento.com

Interface web para sistema de cadastro de clientes e painel administrativo.

## 🌐 Stack Tecnológica

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Material UI v5** - Biblioteca de componentes
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP
- **Emotion** - Estilização CSS-in-JS

## 📁 Estrutura de Diretórios

```
frontend/
├── app/
│   ├── page.tsx              # Página de cadastro (usuário)
│   ├── layout.tsx            # Layout raiz com MUI
│   └── admin/
│       ├── login/
│       │   └── page.tsx      # Página de login
│       └── dashboard/
│           └── page.tsx      # Dashboard admin
├── components/
│   ├── forms/
│   │   └── ClientForm.tsx    # Formulário de cadastro
│   └── admin/
│       ├── ClientsTable.tsx  # Tabela de clientes
│       └── EditClientModal.tsx  # Modal de edição
├── lib/
│   ├── api/
│   │   ├── axios.ts          # Configuração Axios
│   │   ├── clientService.ts  # Serviço de clientes
│   │   └── authService.ts    # Serviço de autenticação
│   ├── validations/
│   │   └── clientSchema.ts   # Schema Zod
│   └── theme.ts              # Tema Material UI
├── .env.local                # Variáveis de ambiente
└── package.json
```

## ⚙️ Instalação

```bash
# Instalar dependências
pnpm install

# Criar arquivo de ambiente
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Iniciar desenvolvimento
pnpm run dev
```

## 🌍 Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Executar produção
pnpm start

# Lint
pnpm run lint
```

## 🎨 Páginas e Rotas

### Interface do Usuário

#### `/` - Página de Cadastro
- Formulário de cadastro de cliente
- Upload de arquivo com preview
- Validação em tempo real
- Feedback visual de sucesso/erro

### Interface Administrativa

#### `/admin/login` - Login
- Autenticação de operadores
- Validação de credenciais
- Redirecionamento automático

#### `/admin/dashboard` - Dashboard
- Listagem de clientes cadastrados
- Busca por nome, email ou telefone
- Paginação de resultados
- Edição de dados do cliente
- Exclusão de clientes
- Visualização/download de arquivos
- Logout

## 🔐 Autenticação

### Fluxo de Login
1. Usuário envia credenciais
2. API valida e retorna token JWT
3. Token é salvo no localStorage
4. Token é enviado em todas as requisições protegidas

## 📝 Validação de Dados

### Schema de Cliente (Zod)
```typescript
{
  fullName: string (3-100 caracteres)
  email: string (email válido)
  phone?: string (formato telefone)
  file: File (max 10MB, tipos permitidos)
}
```

### Tipos de Arquivo Permitidos
- Imagens: JPG, PNG
- Documentos: PDF, DOC, DOCX

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Deploy
vercel

# Configurar variável de ambiente
# NEXT_PUBLIC_API_URL=https://sua-api.com/api
```

---

**Interface desenvolvida com Next.js, TypeScript e Material UI v5**
