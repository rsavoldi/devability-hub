
"use client"; // Required for hooks like useRouter and useAuth

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from "lucide-react";

function MainContentLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !currentUser) {
  //     router.push('/login'); // Redireciona para a página de login se não estiver logado
  //   }
  // }, [currentUser, loading, router]);

  // if (loading || !currentUser) { // Mostra o loader enquanto verifica ou se não estiver logado
  //   return (
  //     <div className="flex justify-center items-center h-screen w-screen">
  //       <Loader2 className="h-12 w-12 animate-spin text-primary" />
  //       <p className="ml-4 text-lg">Verificando autenticação...</p>
  //     </div>
  //   );
  // }
  
  // O conteúdo principal agora é renderizado mesmo sem currentUser,
  // mas o AuthProvider ainda é necessário para o AppHeader e outras funcionalidades.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Carregando aplicação...</p>
      </div>
    );
  }

  return (
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
  );
}


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <MainContentLayout>{children}</MainContentLayout>
    </AuthProvider>
  );
}

