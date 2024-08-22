import { createGlobalStyle } from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { theme } from './contexts/theme';
import Nav from './components/Nav';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';
import { trpc } from './utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import ActivityWrapper from './components/ActivityWrapper';

export default function App({ queryClient }: { queryClient: QueryClient }) {
  const { getToken, userId } = useAuth();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3001',
          // You can pass any HTTP headers you wish here
          async headers() {
            const token = await getToken();
            return {
              authorization: token ?? undefined,
              userId: userId ?? '',
            };
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col h-screen">
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Nav />
            <Toaster position="bottom-center" />
            <main className="flex-grow-1 overflow-auto overscroll-y-contain sm:px-10">
              <ActivityWrapper>
                <Outlet />
              </ActivityWrapper>
            </main>
          </ThemeProvider>
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    font-family: ${({ theme }) => theme.fonts.default}, sans-serif, ;
  }
`;
