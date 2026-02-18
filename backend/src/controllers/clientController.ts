import { Request, Response } from 'express';
import Client from '../models/Client';
import { uploadToS3 } from '../utils/s3Upload';

// Criar novo cliente com upload de arquivo
export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone } = req.body;
    const file = req.file;

    // Validar arquivo
    if (!file) {
      res.status(400).json({
        success: false,
        message: 'Arquivo é obrigatório'
      });
      return;
    }

    // Verificar se email já existe
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      res.status(400).json({
        success: false,
        message: 'E-mail já cadastrado'
      });
      return;
    }

    // Upload para S3
    const { fileUrl } = await uploadToS3(file);

    // Criar cliente no banco
    const client = await Client.create({
      fullName,
      email,
      phone,
      fileUrl
    });

    res.status(201).json({
      success: true,
      message: 'Cliente cadastrado com sucesso',
      data: client
    });
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao cadastrar cliente'
    });
  }
};

// Listar todos os clientes com paginação
export const getAllClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    const skip = (page - 1) * limit;

    // Filtro de busca
    const filter = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const clients = await Client.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Client.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao listar clientes'
    });
  }
};

// Buscar cliente por ID
export const getClientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error: any) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao buscar cliente'
    });
  }
};

// Atualizar cliente
export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, email, phone } = req.body;

    // Verificar se cliente existe
    const client = await Client.findById(id);
    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
      return;
    }

    // Verificar se novo email já existe em outro cliente
    if (email && email !== client.email) {
      const existingClient = await Client.findOne({ email });
      if (existingClient) {
        res.status(400).json({
          success: false,
          message: 'E-mail já cadastrado'
        });
        return;
      }
    }

    // Atualizar dados
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { fullName, email, phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cliente atualizado com sucesso',
      data: updatedClient
    });
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao atualizar cliente'
    });
  }
};

// Deletar cliente
export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const client = await Client.findByIdAndDelete(id);

    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Cliente deletado com sucesso'
    });
  } catch (error: any) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao deletar cliente'
    });
  }
};
