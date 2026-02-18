'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  AppBar,
  Toolbar,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import { Logout, Dashboard as DashboardIcon } from '@mui/icons-material';
import { authService } from '@/lib/api/authService';
import { clientService, Client } from '@/lib/api/clientService';
import ClientsTable from '@/components/admin/ClientsTable';
import EditClientModal from '@/components/admin/EditClientModal';

export default function DashboardPage() {
  const router = useRouter();
  const [searching, setSearching] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const isInitialMount = useRef(true);

  const fetchClients = useCallback(async () => {
    try {
      setSearching(true);
      const response = await clientService.getAll(page, limit, search);
      setClients(response.data);
      setTotal(response.pagination.total);
    } catch (error: any) {
      showSnackbar('Erro ao carregar clientes', 'error');
    } finally {
      setSearching(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    fetchClients();
  }, [fetchClients, router]);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/admin/login');
  };

  const handleEdit = (client: Client) => {
    setEditClient(client);
  };

  const handleSaveEdit = async (id: string, data: Partial<Client>) => {
    try {
      await clientService.update(id, data);
      showSnackbar('Cliente atualizado com sucesso', 'success');
      fetchClients();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Erro ao atualizar cliente', 'error');
    }
  };

  const handleDeleteClick = (id: string) => {
    setClientToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;

    try {
      await clientService.delete(clientToDelete);
      showSnackbar('Cliente excluído com sucesso', 'success');
      setDeleteDialogOpen(false);
      setClientToDelete(null);
      fetchClients();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Erro ao excluir cliente', 'error');
    }
  };

  const handleViewFile = (url: string) => {
    window.open(url, '_blank');
  };

  const handleSearchChange = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed">
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Painel Administrativo - Escoramento.com
          </Typography>
          <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      
      {/* Toolbar spacer to prevent content from going under the fixed AppBar */}
      <Toolbar />

      {searching && (
        <LinearProgress 
          sx={{ 
            position: 'fixed', 
            top: 64, 
            left: 0, 
            right: 0, 
            zIndex: 2000,
            height: 4
          }} 
        />
      )}

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Clientes Cadastrados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total de {total} cliente{total !== 1 ? 's' : ''} cadastrado{total !== 1 ? 's' : ''}
          </Typography>
        </Paper>

        <Box sx={{ opacity: searching ? 0.6 : 1, transition: 'opacity 0.3s ease-in-out' }}>
          <ClientsTable
            clients={clients}
            total={total}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            onSearch={handleSearchChange}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onViewFile={handleViewFile}
          />
        </Box>
      </Container>

      <EditClientModal
        open={!!editClient}
        client={editClient}
        onClose={() => setEditClient(null)}
        onSave={handleSaveEdit}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
