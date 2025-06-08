
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, MessageCircle, Languages, Flame, Menu, X, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import { FaqChatbotDialog } from '@/components/chatbot/FaqChatbotDialog';
import { ThematicDictionaryDialog } from '@/components/dictionary/ThematicDictionaryDialog';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContentItems } from './Sidebar'; // Import items for mobile menu

export const Header: React.FC = () => {
  const { language, setLanguage, text } = useLanguage();
  const { streakData } = useProgress();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Rocket className="h-7 w-7 text-primary" />
          <span className="font-headline text-xl font-semibold">{text('appName')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link href="/learning-paths" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {text('learningPaths')}
            </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <div className="flex items-center gap-1 text-sm font-medium text-foreground">
            <Flame className="h-5 w-5 text-orange-500" />
            <span>{streakData.current} {text('days')}</span>
          </div>

          <TooltipWrapper tooltipText={text('dictionary')}>
            <Button variant="ghost" size="icon" onClick={() => setIsDictionaryOpen(true)}>
              <BookOpen className="h-5 w-5" />
              <span className="sr-only">{text('dictionary')}</span>
            </Button>
          </TooltipWrapper>

          <TooltipWrapper tooltipText={text('chatbot')}>
            <Button variant="ghost" size="icon" onClick={() => setIsChatbotOpen(true)}>
              <MessageCircle className="h-5 w-5" />
              <span className="sr-only">{text('chatbot')}</span>
            </Button>
          </TooltipWrapper>

          <DropdownMenu>
            <TooltipWrapper tooltipText={text('language')}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Languages className="h-5 w-5" />
                  <span className="sr-only">{text('language')}</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipWrapper>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('pt')} disabled={language === 'pt'}>
                Português
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')} disabled={language === 'en'}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] p-0">
                 <div className="p-4 border-b">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <Rocket className="h-6 w-6 text-primary" />
                        <span className="font-headline text-lg font-semibold">{text('appName')}</span>
                    </Link>
                 </div>
                 <nav className="flex flex-col gap-2 p-4">
                    <SidebarContentItems onLinkClick={() => setIsMobileMenuOpen(false)} />
                 </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <FaqChatbotDialog open={isChatbotOpen} onOpenChange={setIsChatbotOpen} />
      <ThematicDictionaryDialog open={isDictionaryOpen} onOpenChange={setIsDictionaryOpen} />
    </header>
  );
};


// Helper component for Tooltips (optional, but good for consistency)
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const TooltipWrapper: React.FC<{ children: React.ReactNode, tooltipText: string }> = ({ children, tooltipText }) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent><p>{tooltipText}</p></TooltipContent>
  </Tooltip>
);

export default Header;

