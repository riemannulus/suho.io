import { registerTool } from './tools';

// Import all tools
import * as whatismyip from '../tools/whatismyip';
import * as generateEthKey from '../tools/generate-eth-key';

// Register all tools
registerTool({
  id: whatismyip.metadata.id,
  name: whatismyip.metadata.name,
  description: whatismyip.metadata.description,
  tags: whatismyip.metadata.tags,
  component: whatismyip.component
});

registerTool({
  id: generateEthKey.metadata.id,
  name: generateEthKey.metadata.name,
  description: generateEthKey.metadata.description,
  tags: generateEthKey.metadata.tags,
  component: generateEthKey.component
});

// This file ensures all tools are registered when imported 