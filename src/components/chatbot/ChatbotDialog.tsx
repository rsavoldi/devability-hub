
"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { queryPdfLibrary, type QueryPdfLibraryInput, type QueryPdfLibraryOutput } from "@/ai/flows/query-pdf-library";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  sources?: string[];
}

export function ChatbotDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const input: QueryPdfLibraryInput = { query: userMessage.text };
      // This is a server action, so it's an async call
      const result: QueryPdfLibraryOutput = await queryPdfLibrary(input);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: result.answer,
        sources: result.sources,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Desculpe, encontrei um erro. Por favor, tente novamente.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir Chatbot">
           <span className="text-xl" role="img" aria-label="Chatbot">💬</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:sm:max-w-[550px] flex flex-col h-[70vh] max-h-[600px]">
        <DialogHeader>
          <DialogTitle>Converse com a DevAI 💬</DialogTitle>
          <DialogDescription>
            Faça perguntas sobre os materiais de estudo ou conceitos de desenvolvimento.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow p-1 pr-4 -mx-1 my-4 border-t border-b">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><span role="img" aria-label="Bot">🤖</span></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-lg p-3 text-sm ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground opacity-80">
                      <p className="font-semibold">Fontes:</p>
                      <ul className="list-disc pl-4">
                        {message.sources.map((source, index) => (
                          <li key={index}>{source}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                 {message.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><span role="img" aria-label="Usuário">👤</span></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                 <Avatar className="h-8 w-8">
                    <AvatarFallback><span role="img" aria-label="Bot">🤖</span></AvatarFallback>
                  </Avatar>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Pensando...</span>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex w-full items-center gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
