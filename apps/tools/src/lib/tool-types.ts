export interface Tool {
  id: string;
  name: string;
  description: string;
  tags: string[];
  component: React.ComponentType;
}

export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  tags: string[];
} 