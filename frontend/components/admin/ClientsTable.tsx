'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Box,
  TablePagination,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  CloudDownload
} from '@mui/icons-material';
import { Client } from '@/lib/api/clientService';

interface ClientsTableProps {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onSearch: (search: string) => void;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onViewFile: (url: string) => void;
}

export default function ClientsTable({
  clients,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onSearch,
  onEdit,
  onDelete,
  onViewFile
}: ClientsTableProps) {
  // Estado local para o input de busca para garantir que o digito seja instantâneo
  const [inputValue, setInputValue] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce: Atualiza o estado global de busca apenas após o usuário parar de digitar
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, 800); // Aumentado para 800ms para dar mais tempo ao usuário
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Memoriza a formatação para evitar processamento desnecessário
  const formatDate = useMemo(() => (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nome, email ou telefone..."
          value={inputValue}
          onChange={handleSearchChange}
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <TableContainer sx={{ minHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>E-mail</TableCell>
              <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>Telefone</TableCell>
              <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>Cadastrado em</TableCell>
              <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }} align="center">
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow
                  key={client._id}
                  hover
                  sx={{ transition: 'background-color 0.2s' }}
                >
                  <TableCell>{client.fullName}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    {client.phone ? (
                      client.phone
                    ) : (
                      <Chip label="Não informado" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>{formatDate(client.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Ver arquivo">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => onViewFile(client.fileUrl)}
                        >
                          <CloudDownload />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(client)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(client._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) => onLimitChange(parseInt(e.target.value))}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Linhas por página:"
      />
    </Paper>
  );
}
