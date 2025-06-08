
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { faqChatbot, FAQChatbotInput, FAQChatbotOutput } from '@/ai/flows/faq-chatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bot, User, Loader2 } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface FaqChatbotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FaqChatbotDialog: React.FC<FaqChatbotDialogProps> = ({ open, onOpenChange }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { text, language } = useLanguage();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: ChatMessage = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const input: FAQChatbotInput = { question: inputValue };
      const result: FAQChatbotOutput = await faqChatbot(input);
      const botMessage: ChatMessage = { sender: 'bot', text: result.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        sender: 'bot',
        text: language === 'pt' ? 'Desculpe, ocorreu um erro ao processar sua pergunta.' : 'Sorry, an error occurred while processing your question.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle className="font-headline">{text('chatbot')}</DialogTitle>
          <DialogDescription>{text('askMeAnything')}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow p-4 border rounded-md" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'bot' && <Bot className="w-6 h-6 text-primary flex-shrink-0 mt-1" />}
                <div className={`p-3 rounded-lg max-w-[75%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
                {msg.sender === 'user' && <User className="w-6 h-6 text-accent flex-shrink-0 mt-1" />}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2">
                <Bot className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="p-3 rounded-lg bg-muted">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <div className="flex w-full gap-2">
            <Input
              type="text"
              placeholder={text('sendMessage') + "..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button onClick={handleSendMessage} disabled={isLoading || inputValue.trim() === ''}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : text('sendMessage')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
