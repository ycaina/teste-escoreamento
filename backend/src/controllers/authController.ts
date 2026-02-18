import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Gerar token JWT
const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET || 'default_secret';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
 return jwt.sign(
  { userId },
  jwtSecret,
  { expiresIn: jwtExpiresIn as any }
);

};

// Registro de novo usuário (admin)
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'E-mail já cadastrado'
      });
      return;
    }

    // Criar usuário
    const user = await User.create({
      email,
      password,
      name,
      role: role || 'operator'
    });

    // Gerar token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao registrar usuário'
    });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'E-mail e senha são obrigatórios'
      });
      return;
    }

    // Buscar usuário com senha
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
      return;
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
      return;
    }

    // Gerar token
    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao fazer login'
    });
  }
};

// Verificar token
export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'default_secret';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };

    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado'
    });
  }
};
