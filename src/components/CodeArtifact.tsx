import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, X, Code2, Eye, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface CodeArtifact {
  id: string;
  language: string;
  content: string;
  title?: string;
}

interface CodeArtifactProps {
  artifact: CodeArtifact | null;
  onClose: () => void;
  className?: string;
}

export const CodeArtifact: React.FC<CodeArtifactProps> = ({
  artifact,
  onClose,
  className,
}) => {
  const [view, setView] = useState<'code' | 'preview'>('code');

  if (!artifact) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(artifact.content);
      toast.success('Code copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const isPreviewable = artifact.language === 'html' || 
                       artifact.language === 'javascript' || 
                       artifact.language === 'css';

  const getLanguageIcon = () => {
    switch (artifact.language) {
      case 'html':
        return <FileText className="h-4 w-4" />;
      case 'javascript':
      case 'js':
        return <Code2 className="h-4 w-4" />;
      default:
        return <Code2 className="h-4 w-4" />;
    }
  };

  const renderPreview = () => {
    if (artifact.language === 'html') {
      return (
        <iframe
          srcDoc={artifact.content}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-forms allow-modals"
          title="HTML Preview"
        />
      );
    }
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Preview not available for {artifact.language}
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-background border-l border-border fixed top-0 right-0 w-[700px] z-50",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          {getLanguageIcon()}
          <div>
            <h3 className="font-medium text-sm">
              {artifact.title || `${artifact.language} code`}
            </h3>
            <p className="text-xs text-muted-foreground">
              {artifact.language.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isPreviewable && (
            <>
              <Button
                variant={view === 'code' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('code')}
              >
                <Code2 className="h-4 w-4" />
              </Button>
              {/* <Button
                variant={view === 'preview' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('preview')}
              >
                <Eye className="h-4 w-4" />
              </Button> */}
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-h-[700px] overflow-y-auto">
        {view === 'code' ? (
          <ScrollArea className="h-full">
            <pre className="p-4 text-sm font-mono">
              <code className={cn(
                "block whitespace-pre-wrap break-words",
                "text-foreground"
              )}>
                {artifact.content}
              </code>
            </pre>
          </ScrollArea>
        ) : (
          <div className="h-full">
            {renderPreview()}
          </div>
        )}
      </div>
    </div>
  );
};