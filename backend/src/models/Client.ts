import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
  fullName: string;
  email: string;
  phone?: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Nome completo é obrigatório'],
      trim: true,
      minlength: [3, 'Nome deve ter no mínimo 3 caracteres'],
      maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
    },
    email: {
      type: String,
      required: [true, 'E-mail é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'E-mail inválido']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\d\s\-\(\)\+]+$/, 'Telefone inválido']
    },
    fileUrl: {
      type: String,
      required: [true, 'URL do arquivo é obrigatória']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índice para melhorar performance de busca
ClientSchema.index({ createdAt: -1 });

export default mongoose.model<IClient>('Client', ClientSchema);
