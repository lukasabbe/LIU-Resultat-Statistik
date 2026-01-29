import React from 'react'
import ReactDOM from 'react-dom/client'

import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

// 2. LIBRARIES
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

// 3. INTERNAL IMPORTS
import App from './App.tsx'
import './i18n';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* All Providers must wrap the App */}
    <HelmetProvider>
      <MantineProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MantineProvider>
    </HelmetProvider>
  </React.StrictMode>,
)