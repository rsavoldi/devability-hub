
"use client"; 

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
// useRouter não é mais necessário aqui para redirecionamento
// import { useRouter } from 'next/navigation'; 
// useEffect não é mais necessário aqui para redirecionamento
// import { useEffect } from 'react';
import { Loader2 } from "lucide-react";

function MainContentLayout({ children }: { children: React.ReactNode }) {
  // Usamos useAuth() para obter o estado de carregamento do AuthProvider.
  // currentUser e userProfile podem ser nulos se o usuário não estiver logado.
  const { loading } = useAuth(); 
  // const router = useRouter(); // Removido, pois não faremos mais push para /login daqui

  // REMOVIDO: O useEffect que forçava o redirecionamento para /login
  // useEffect(() => {
  //   if (!loading && !currentUser) {
  //     router.push('/login'); 
  //   }
  // }, [currentUser, loading, router]);

  // O AuthProvider já mostra um loader global.
  // Este loader aqui dentro é para o caso de querermos um comportamento
  // específico para o MainContentLayout enquanto useAuth() ainda está carregando.
  // Neste caso, o loader global do AuthProvider é suficiente.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Carregando aplicação...</p>
      </div>
    );
  }
  
  // REMOVIDO: O bloco que impedia a renderização se não houvesse currentUser
  // if (loading || !currentUser) { ... }

  // Agora, o conteúdo principal é renderizado mesmo que currentUser seja null
  // após o carregamento inicial do AuthProvider.
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
  // AuthProvider ainda é essencial para que o AppHeader e outros componentes
  // possam saber se há um usuário logado e acessar o perfil.
  return (
    <AuthProvider>
      <MainContentLayout>{children}</MainContentLayout>
    </AuthProvider>
  );
}
