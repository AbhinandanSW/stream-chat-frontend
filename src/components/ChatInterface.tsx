import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface StreamResponse {
  type: 'delta' | 'completion';
  content: string;
  thread_id: string;
  session_id: string;
  has_artifact: boolean;
  error_message: string | null;
}

interface ChatInterfaceProps {
  chatId?: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatId,
  messages,
  onSendMessage,
  className,
}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  const simulateStreamingResponse = async (userMessage: string) => {
    setIsStreaming(true);
    setStreamingMessage('');
    
    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      // Simulate API response with streaming
      const responseText = `I understand you sent: "${userMessage}". This is a simulated streaming response that demonstrates how the chat interface handles real-time message updates. The response is being typed out character by character to show the streaming effect similar to Claude's interface.`;
      
      const words = responseText.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        if (signal.aborted) {
          break;
        }
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
        
        const currentText = words.slice(0, i + 1).join(' ');
        setStreamingMessage(currentText);
      }
      
      if (!signal.aborted) {
        // Finalize the message
        const finalMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
        };
        
        // In a real app, you'd update the messages through the parent component
        console.log('Final message:', finalMessage);
      }
      
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Streaming error:', error);
      }
    } finally {
      setIsStreaming(false);
      setStreamingMessage('');
      abortControllerRef.current = null;
    }
  };

  const handleSendMessage = async (message: string) => {
    // Add user message immediately
    onSendMessage(message);
    
    // Start streaming response
    await simulateStreamingResponse(message);
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const allMessages = [...messages];
  if (isStreaming && streamingMessage) {
    allMessages.push({
      id: 'streaming',
      role: 'assistant',
      content: streamingMessage,
      timestamp: new Date(),
    });
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <ScrollArea ref={scrollRef} className="flex-1 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {allMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                  <span className="text-2xl font-bold text-primary-foreground">C</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
                  <p className="text-muted-foreground">
                    Start a conversation by typing a message below.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {allMessages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  isStreaming={message.id === 'streaming'}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      
      <ChatInput
        onSendMessage={handleSendMessage}
        onStopGeneration={handleStopGeneration}
        isStreaming={isStreaming}
        placeholder="Send a message..."
      />
    </div>
  );
};