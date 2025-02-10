'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { config, queryClient } from '@/config/wagmi';
import { Providers } from "./providers";
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { sepolia } from 'wagmi/chains';

// Get origin for metadata
const getOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3002';
};

// Initialize modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  defaultChain: sepolia,
  metadata: {
    name: 'DentalChain',
    description: 'Secure Dental Records on the Blockchain',
    url: getOrigin(),
    icons: ['/logo.png'] // Assuming logo is in public folder
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-font-family': 'Inter, sans-serif',
  }
})

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Providers>{children}</Providers>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 