import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  isStreaming = false,
  className,
}) => {
  const isUser = role === 'user';

  return (
    <div className={cn(
      "group relative flex gap-4 px-4 py-6 transition-colors",
      isUser ? "bg-transparent" : "bg-muted/30",
      className
    )}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(
          "border",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="text-sm font-medium">
          {isUser ? 'You' : 'Claude'}
        </div>
        
        <div className={cn(
          "prose prose-sm max-w-none break-words",
          "prose-p:leading-relaxed prose-pre:p-0",
          "text-foreground",
          isStreaming && "message-stream"
        )}>
          {content.split('\n').map((line, index) => (
            <p key={index} className={cn(
              "mb-2 last:mb-0",
              line.trim() === '' && "mb-4"
            )}>
              {line || '\u00A0'} {/* Non-breaking space for empty lines */}
            </p>
          ))}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
          )}
        </div>
      </div>
    </div>
  );
};