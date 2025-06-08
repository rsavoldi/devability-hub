
"use client";

import React, { ReactNode } from 'react';
import Header from './Header';
import { Sidebar } from './Sidebar';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

const ToggleSidebarButton = () => {
  const { state, toggleSidebar } = useSidebar();
  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden fixed top-3 left-3 z-50 bg-background/80 backdrop-blur">
      {state === 'expanded' ? <PanelLeftClose className="h-6 w-6" /> : <PanelLeftOpen className="h-6 w-6" />}
    </Button>
  );
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <SidebarInset className="flex-1">
                    {/* The SidebarTrigger below is for desktop, if you want it */}
                    {/* <div className="p-4 hidden md:block">
                        <SidebarTrigger />
                    </div> */}
                    <main className="container mx-auto px-4 py-8 flex-1">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </div>
        {/* This trigger is for mobile, it is manually placed for mobile only */}
        {/* <div className="md:hidden fixed top-4 left-4 z-50">
           <SidebarTrigger />
        </div> */}

    </SidebarProvider>
  );
};

export default MainLayout;
