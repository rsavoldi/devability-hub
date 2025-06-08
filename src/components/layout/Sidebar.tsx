
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar as ShadSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Rocket, BookHeart, MessageSquareHeart, GraduationCap, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FaqChatbotDialog } from '@/components/chatbot/FaqChatbotDialog';
import { ThematicDictionaryDialog } from '@/components/dictionary/ThematicDictionaryDialog';
import Image from 'next/image';

interface SidebarContentItemsProps {
    onLinkClick?: () => void;
}

export const SidebarContentItems: React.FC<SidebarContentItemsProps> = ({ onLinkClick }) => {
    const { text } = useLanguage();
    const pathname = usePathname();
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);

    const menuItems = [
      { href: "/learning-paths", label: text('learningPaths'), icon: GraduationCap, activePaths: ["/learning-paths"]},
      // { label: text('dictionary'), icon: BookHeart, action: () => setIsDictionaryOpen(true) }, // Handled by header
      // { label: text('chatbot'), icon: MessageSquareHeart, action: () => setIsChatbotOpen(true) }, // Handled by header
    ];
  
    const handleItemClick = (action?: () => void) => {
      if (action) action();
      if (onLinkClick) onLinkClick();
    };

    return (
      <>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              {item.href ? (
                 <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                        isActive={item.activePaths?.some(p => pathname.startsWith(p))}
                        onClick={() => handleItemClick()}
                        tooltip={item.label}
                        className="w-full justify-start"
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                </Link>
              ) : (
                <SidebarMenuButton
                  onClick={() => handleItemClick(item.action)}
                  tooltip={item.label}
                  className="w-full justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {/* Dialogs need to be outside the button if they are controlled by sidebar state, 
            but here they are controlled by local state and header buttons also trigger them.
            It's better to keep dialog triggers in the header and this sidebar simplified or 
            ensure dialog states are managed globally if sidebar also needs to open them.
            For now, these are effectively placeholders if triggered from sidebar menu.
        */}
        <FaqChatbotDialog open={isChatbotOpen} onOpenChange={setIsChatbotOpen} />
        <ThematicDictionaryDialog open={isDictionaryOpen} onOpenChange={setIsDictionaryOpen} />
      </>
    );
  };


export const Sidebar: React.FC = () => {
  const { text } = useLanguage();
  const { state: sidebarState, toggleSidebar } = useSidebar();


  return (
    <ShadSidebar side="left" variant="sidebar" collapsible="icon" className="hidden md:flex flex-col">
        <SidebarHeader className="flex items-center justify-between p-2 h-16 border-b">
           <Link href="/" className="flex items-center gap-2 overflow-hidden">
                <Rocket className="h-7 w-7 text-primary flex-shrink-0" />
                {sidebarState === 'expanded' && (
                    <span className="font-headline text-xl font-semibold whitespace-nowrap">
                        {text('appName')}
                    </span>
                )}
            </Link>
            {sidebarState === 'expanded' && (
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
                    <PanelLeftClose className="h-5 w-5" />
                </Button>
            )}
        </SidebarHeader>
        <SidebarContent className="flex-1 overflow-y-auto p-2">
            <SidebarContentItems />
        </SidebarContent>
        {/* Optional Footer */}
        {/* <SidebarFooter className="p-2 border-t">
            <p className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                © {new Date().getFullYear()} {text('appName')}
            </p>
        </SidebarFooter> */}
    </ShadSidebar>
  );
};
