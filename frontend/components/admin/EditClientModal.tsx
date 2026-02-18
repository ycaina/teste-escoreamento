'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  InputAdornment
} from '@mui/material';
import { Person, Email, Phone } from '@mui/icons-material';
import { Client } from '@/lib/api/clientService';

interface EditClientModalProps {
  open: boolean;
  client: Client | null;
  onClose: () => void;
  onSave: (id: string, data: Partial<Client>) => Promise<void>;
}

interface EditFormData {
  fullName: string;
  email: string;
  phone: string;
}

export default function EditClientModal({
  open,
  client,
  onClose,
  onSave
}: EditClientModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EditFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: ''
    }
  });

  useEffect(() => {
    if (client) {
      reset({
        fullName: client.fullName,
        email: client.email,
        phone: client.phone || ''
      });
    }
  }, [client, reset]);

  const onSubmit = async (data: EditFormData) => {
    if (!client) return;

    await onSave(client._id, {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || undefined
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Cliente</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Controller
            name="fullName"
            control={control}
            rules={{
              required: 'Nome é obrigatório',
              minLength: {
                value: 3,
                message: 'Nome deve ter no mínimo 3 caracteres'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nome Completo"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                disabled={isSubmitting}
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
            rules={{
              required: 'E-mail é obrigatório',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'E-mail inválido'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="email"
                label="E-mail"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
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
                error={!!errors.phone}
                helperText={errors.phone?.message}
                disabled={isSubmitting}
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
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isSubmitting}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
