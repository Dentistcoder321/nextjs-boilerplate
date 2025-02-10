/// <reference types="node" />
'use client';

import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: string;
      NEXT_PUBLIC_ALCHEMY_RPC_URL: string;
    }
  }
  interface Window {
    process: any;
  }
}

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const alchemyRpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;

if (!projectId) throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined');
if (!alchemyRpcUrl) throw new Error('NEXT_PUBLIC_ALCHEMY_RPC_URL is not defined');

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
})

const metadata = {
  name: 'DentalChain',
  description: 'Secure Dental Records on the Blockchain',
  url: 'https://dentalchain.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [sepolia, mainnet] as const;

export const config = createConfig({
  chains,
  transports: {
    [sepolia.id]: http(alchemyRpcUrl),
    [mainnet.id]: http(),
  },
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  defaultChain: sepolia,
  metadata,
})

export {
  useAccount,
  useConnect,
  useDisconnect,
  useContractRead,
  useContractWrite,
} from 'wagmi'

export type { Config, Connector } from 'wagmi'