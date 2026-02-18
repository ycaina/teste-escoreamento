
// import type { Metadata } from "next";
// import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
// import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import theme from '@/lib/theme';

// export const metadata: Metadata = {
//   title: "Escoramento.com - Sistema de Cadastro",
//   description: "Sistema de cadastro de clientes com upload de arquivos",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="pt-BR">
//       <body>
//         <AppRouterCacheProvider>
//           <ThemeProvider theme={theme}>
//             <CssBaseline />
//             {children}
//           </ThemeProvider>
//         </AppRouterCacheProvider>
//       </body>
//     </html>
//   );
// }
import type { Metadata } from 'next';
import Providers from './Providers';

export const metadata: Metadata = {
  title: "Escoramento.com - Sistema de Cadastro",
  description: "Sistema de cadastro de clientes com upload de arquivos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
