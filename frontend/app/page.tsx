import { Box, Container, Typography } from '@mui/material';
import ClientForm from '@/components/forms/ClientForm';

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 8
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Escoramento.com
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            Sistema de Cadastro de Clientes
          </Typography>
        </Box>

        <ClientForm />

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.8)'
            }}
          >
            © 2024 Escoramento.com - Todos os direitos reservados
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
