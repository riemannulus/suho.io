import { useState, useEffect } from 'react';
import { ToolList } from './ToolList';
import { getToolById } from '@/lib/tools';
import type { Tool } from '@/lib/tool-types';
import { Button } from '@/components/ui/button';

export function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [currentTool, setCurrentTool] = useState<Tool | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (currentPath === '/') {
      setCurrentTool(null);
    } else {
      const toolId = currentPath.substring(1); // Remove leading slash
      const tool = getToolById(toolId);
      setCurrentTool(tool || null);
    }
  }, [currentPath]);

  const navigateToTool = (tool: Tool) => {
    const newPath = `/${tool.id}`;
    window.history.pushState(null, '', newPath);
    setCurrentPath(newPath);
  };

  const navigateToHome = () => {
    window.history.pushState(null, '', '/');
    setCurrentPath('/');
  };

  if (currentPath === '/') {
    return <ToolList onToolSelect={navigateToTool} />;
  }

  if (currentTool) {
    const ToolComponent = currentTool.component;
    return (
      <div>
        {/* Back button */}
        <div className="fixed top-4 left-4 z-50">
          <Button 
            onClick={navigateToHome}
            className="win95-button"
          >
            ← Back to Tools
          </Button>
        </div>
        <ToolComponent />
      </div>
    );
  }

  // 404 page
  return (
    <div className="min-h-screen bg-gray-300 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="win95-window">
          <div className="win95-title-bar">
            <span className="win95-title">Error - Tool Not Found</span>
          </div>
          <div className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
            <p className="text-gray-600 mb-6">The tool you're looking for doesn't exist.</p>
            <Button 
              onClick={navigateToHome}
              className="win95-button"
            >
              ← Back to Tools
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 