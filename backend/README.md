# Backend - Escoramento.com API

API RESTful para sistema de cadastro de clientes com upload de arquivos para AWS S3.

## 🔧 Stack Tecnológica

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset tipado do JavaScript
- **Mongoose** - ODM para MongoDB
- **AWS SDK v3** - Integração com S3
- **Multer** - Middleware para upload de arquivos
- **JWT (jsonwebtoken)** - Autenticação
- **Bcrypt** - Hash de senhas
- **dotenv** - Gerenciamento de variáveis de ambiente
- **cors** - Controle de acesso CORS

## 📁 Estrutura de Diretórios

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Configuração MongoDB
│   │   └── aws.ts           # Configuração AWS S3
│   ├── models/
│   │   ├── Client.ts        # Model de Cliente
│   │   └── User.ts          # Model de Usuário
│   ├── controllers/
│   │   ├── clientController.ts  # Lógica de clientes
│   │   └── authController.ts    # Lógica de autenticação
│   ├── routes/
│   │   ├── clientRoutes.ts  # Rotas de clientes
│   │   └── authRoutes.ts    # Rotas de autenticação
│   ├── middleware/
│   │   ├── auth.ts          # Middleware de autenticação
│   │   └── errorHandler.ts  # Tratamento de erros
│   ├── utils/
│   │   ├── s3Upload.ts      # Utilitário de upload S3
│   │   └── seed.ts          # Script de seed
│   └── server.ts            # Arquivo principal
├── .env.example             # Exemplo de variáveis
├── .gitignore
├── tsconfig.json
└── package.json
```

## ⚙️ Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar variáveis de ambiente
nano .env
```

## 🌍 Variáveis de Ambiente

```env
# Server
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

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Executar produção
npm start

# Criar usuário admin
npm run seed
```

## 📡 Endpoints da API

### Health Check
```
GET /health
```

### Autenticação

#### Registrar Usuário
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123",
  "name": "Nome do Usuário",
  "role": "operator" // ou "admin"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@escoramento.com",
  "password": "admin123"
}
```

#### Verificar Token
```
GET /api/auth/verify
Authorization: Bearer {token}
```

### Clientes

#### Criar Cliente (Público)
```
POST /api/clients
Content-Type: multipart/form-data

fullName: string (obrigatório)
email: string (obrigatório)
phone: string (opcional)
file: File (obrigatório, max 10MB)
```

#### Listar Clientes (Protegido)
```
GET /api/clients?page=1&limit=10&search=termo
Authorization: Bearer {token}
```

#### Buscar Cliente por ID (Protegido)
```
GET /api/clients/:id
Authorization: Bearer {token}
```

#### Atualizar Cliente (Protegido)
```
PUT /api/clients/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "Novo Nome",
  "email": "novo@email.com",
  "phone": "(11) 99999-9999"
}
```

#### Deletar Cliente (Protegido)
```
DELETE /api/clients/:id
Authorization: Bearer {token}
```

## 🗄️ Modelos de Dados

### Client
```typescript
{
  fullName: string;      // 3-100 caracteres
  email: string;         // Único, válido
  phone?: string;        // Opcional
  fileUrl: string;       // URL do S3
  createdAt: Date;       // Automático
  updatedAt: Date;       // Automático
}
```

### User
```typescript
{
  email: string;         // Único, válido
  password: string;      // Hash bcrypt
  name: string;
  role: 'admin' | 'operator';
  createdAt: Date;
  updatedAt: Date;
}
```

## ☁️ Fluxo de Upload S3

1. **Multer** recebe o arquivo na memória
2. Valida tipo e tamanho do arquivo
3. Gera nome único com UUID
4. Envia buffer para **AWS S3**
5. S3 retorna URL pública
6. URL é salva no **MongoDB**

## 🔒 Segurança

- ✅ Senhas com hash bcrypt (salt 10)
- ✅ Tokens JWT com expiração
- ✅ Validação de dados no Mongoose
- ✅ CORS configurado
- ✅ Middleware de autenticação
- ✅ Tratamento global de erros
- ✅ Validação de tipos de arquivo
- ✅ Limite de tamanho de arquivo

## 🧪 Testando a API

### Com cURL

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@escoramento.com","password":"admin123"}'

# Criar cliente
curl -X POST http://localhost:5000/api/clients \
  -F "fullName=João Silva" \
  -F "email=joao@email.com" \
  -F "phone=(11) 99999-9999" \
  -F "file=@/path/to/file.pdf"

# Listar clientes (com token)
curl http://localhost:5000/api/clients \
  -H "Authorization: Bearer {seu_token}"
```

### Com Postman/Insomnia

Importe a coleção de endpoints ou crie manualmente seguindo a documentação acima.

## 🚀 Deploy

### Preparação

```bash
# Build
npm run build

# Testar build
node dist/server.js
```

### Variáveis de Ambiente (Produção)

Certifique-se de configurar todas as variáveis no serviço de hospedagem:
- PORT
- MONGODB_URI (MongoDB Atlas)
- JWT_SECRET (gere um seguro)
- AWS_REGION
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_S3_BUCKET_NAME
- FRONTEND_URL

### Serviços Recomendados

- **Heroku** - Fácil deploy
- **Railway** - Moderno e simples
- **Render** - Free tier generoso
- **AWS EC2** - Controle total
- **DigitalOcean** - VPS confiável

## 📝 Notas Importantes

1. **MongoDB**: Use MongoDB Atlas para produção
2. **AWS S3**: Configure bucket com permissões públicas para leitura
3. **JWT_SECRET**: Use string aleatória e segura
4. **CORS**: Configure FRONTEND_URL corretamente
5. **Seed**: Execute apenas uma vez para criar admin

## 🐛 Troubleshooting

### Erro de conexão MongoDB
```
Verifique se MongoDB está rodando e MONGODB_URI está correto
```

### Erro de upload S3
```
Verifique credenciais AWS e permissões do bucket
```

### Token inválido
```
Verifique JWT_SECRET e se token não expirou
```

---

**API desenvolvida com Node.js, Express e TypeScript**
