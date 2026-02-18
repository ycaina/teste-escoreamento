import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/aws';
import { v4 as uuidv4 } from 'uuid';

interface UploadResult {
  fileUrl: string;
  key: string;
}

export const uploadToS3 = async (
  file: Express.Multer.File
): Promise<UploadResult> => {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    
    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME não configurado');
    }

    // Gerar nome único para o arquivo
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `uploads/${fileName}`;

    // Configurar comando de upload (SEM ACL)
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    });

    // Executar upload
    await s3Client.send(command);

    // Construir URL do arquivo
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return {
      fileUrl,
      key
    };
  } catch (error) {
    console.error('Erro ao fazer upload para S3:', error);
    throw new Error('Falha no upload do arquivo');
  }
};
