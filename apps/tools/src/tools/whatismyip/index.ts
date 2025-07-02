import type { ToolMetadata } from '@/lib/tool-types';
import { WhatIsMyIP } from './WhatIsMyIP';

export const metadata: ToolMetadata = {
  id: 'whatismyip',
  name: 'What Is My IP',
  description: 'Find out your public IP address and location information',
  tags: ['NETWORK', 'IP']
};

export { WhatIsMyIP as component }; 