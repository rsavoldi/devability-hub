
"use client"; 

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { AuthProvider } from "@/contexts/AuthContext";
import { LessonUiProvider } from "@/contexts/LessonUiContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <LessonUiProvider>
        <div className="flex min-h-screen w-full flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:z-[9999] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:border-primary focus:rounded-md focus:shadow-lg outline-none ring-ring focus:ring-2"
          >
            Pular para o Conteúdo Principal
          </a>
          <AppHeader />
          <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <AppFooter />
        </div>
      </LessonUiProvider>
    </AuthProvider>
  );
}
