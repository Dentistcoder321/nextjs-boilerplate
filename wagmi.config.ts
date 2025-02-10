import { defineConfig } from '@wagmi/cli'
import { mainnet, sepolia } from 'wagmi/chains'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [],
  plugins: [],
}) 