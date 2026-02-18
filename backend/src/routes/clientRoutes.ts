import { Router } from 'express';
import multer from 'multer';
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
} from '../controllers/clientController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Configurar Multer para armazenar arquivo em memória
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Aceitar apenas certos tipos de arquivo
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  }
});

// Rotas públicas
router.post('/', upload.single('file'), createClient);

// Rotas protegidas (requerem autenticação)
router.get('/', authMiddleware, getAllClients);
router.get('/:id', authMiddleware, getClientById);
router.put('/:id', authMiddleware, updateClient);
router.delete('/:id', authMiddleware, deleteClient);

export default router;
