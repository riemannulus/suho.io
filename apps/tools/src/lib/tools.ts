import type { Tool, ToolMetadata } from './tool-types';

// Tools registry
const tools: Tool[] = [];

// Register a tool
export function registerTool(tool: Tool) {
  tools.push(tool);
}

// Get all tools
export function getAllTools(): Tool[] {
  return [...tools];
}

// Get tool by id
export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id);
}

// Get unique tags
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  tools.forEach(tool => {
    tool.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

// Filter tools by tags
export function filterToolsByTags(tags: string[]): Tool[] {
  if (tags.length === 0) return getAllTools();
  
  return tools.filter(tool => 
    tags.some(tag => tool.tags.includes(tag))
  );
} 