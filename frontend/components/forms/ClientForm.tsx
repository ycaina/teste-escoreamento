'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  CloudUpload,
  CheckCircle
} from '@mui/icons-material';
import { clientSchema, ClientFormData } from '@/lib/validations/clientSchema';
import { clientService } from '@/lib/api/clientService';

export default function ClientForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: ''
    }
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      await clientService.create({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        file: data.file
      });

      setSuccess(true);
      reset();
      setFileName('');
      
      // Limpar mensagem de sucesso após 5 segundos
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('file', file, { shouldValidate: true });
      setFileName(file.name);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
        Cadastro de Cliente
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
          Cliente cadastrado com sucesso!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Nome Completo"
              placeholder="Digite seu nome completo"
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                )
              }}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                )
              }}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Telefone (Opcional)"
              placeholder="(00) 00000-0000"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                )
              }}
            />
          )}
        />

        <Box sx={{ mb: 3 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUpload />}
            fullWidth
            disabled={loading}
            sx={{ mb: 1 }}
          >
            {fileName || 'Selecionar Arquivo'}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
            />
          </Button>
          {errors.file && (
            <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
              {errors.file.message}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Formatos aceitos: JPG, PNG, PDF, DOC (máx. 10MB)
          </Typography>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Cadastrar'
          )}
        </Button>
      </Box>
    </Paper>
  );
}
