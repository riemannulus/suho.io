import type { ToolMetadata } from '@/lib/tool-types';
import { GenerateEthKey } from './GenerateEthKey';

export const metadata: ToolMetadata = {
  id: 'generate-eth-key',
  name: 'Generate Ethereum Keys',
  description: 'Generate random Ethereum private key, public key, and address',
  tags: ['WEB3', 'ETH', 'GENERATOR']
};

export { GenerateEthKey as component }; 