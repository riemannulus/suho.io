import { useState } from 'react';
import { getAllTools, getAllTags, filterToolsByTags } from '@/lib/tools';
import type { Tool } from '@/lib/tool-types';

interface ToolListProps {
  onToolSelect: (tool: Tool) => void;
}

export function ToolList({ onToolSelect }: ToolListProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const allTools = getAllTools();
  const allTags = getAllTags();
  const filteredTools = filterToolsByTags(selectedTags);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-300 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="win95-window mb-6">
          <div className="win95-title-bar">
            <span className="win95-title">Tools Collection - Web Development Utilities</span>
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2 text-center">Tools Collection</h1>
            <p className="text-gray-600 text-center">A collection of useful web development and crypto tools</p>
          </div>
        </div>

        {/* Tag Filter */}
        <div className="win95-window mb-6">
          <div className="win95-title-bar">
            <span className="win95-title">Filter by Tags</span>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`win95-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => setSelectedTags([])}
                  className="win95-button-small"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map(tool => (
            <div
              key={tool.id}
              onClick={() => onToolSelect(tool)}
              className="win95-tool-card p-4"
            >
              <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
              <div className="flex flex-wrap gap-1">
                {tool.tags.map(tag => (
                  <span key={tag} className="win95-tag text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="win95-field-sunken p-8 bg-white inline-block">
              <p className="text-gray-500">No tools match the selected filters.</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Total tools: {allTools.length} | Showing: {filteredTools.length}</p>
        </div>
      </div>
    </div>
  );
} 