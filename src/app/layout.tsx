"use client";

import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Removido pois não está no package.json
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from "@/components/ui/toaster";
import VLibras from '@/components/VLibras';

// Solução temporária para GeistMono se não estiver instalado ou causar problemas:
const geistMono = { variable: "" }; // Fallback

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>DevAbility Hub</title>
        <meta name="description" content="Sua jornada personalizada para dominar habilidades de desenvolvimento e inclusão." />
        <link rel="icon" href="/favicon.ico" sizes="48x48" type="image/x-icon" />
      </head>
      <body className={`${GeistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        
       <VLibras /> 
      </body>
    </html>
  );
}
