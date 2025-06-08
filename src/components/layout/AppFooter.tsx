
"use client";

import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-6 px-4 text-center text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} DevAbility Hub. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-primary hover:underline">
            Termos de Uso (placeholder)
          </Link>
          <Link href="/privacy" className="hover:text-primary hover:underline">
            Política de Privacidade (placeholder)
          </Link>
        </div>
      </div>
    </footer>
  );
}
