// src/app/(auth)/register/page.tsx
"use client";

import Link from "next/link";
import { Award, UserPlus } from "lucide-react"; // Ícone alterado para UserPlus
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <UserPlus className="mx-auto h-10 w-10 text-primary" /> {/* Ícone alterado */}
        <CardTitle className="text-2xl font-bold">Criação de Conta</CardTitle>
        <CardDescription>
          A funcionalidade de criação de conta está <strong className="text-primary">em implantação</strong>.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">
          No momento, você pode explorar todas as trilhas e funcionalidades como convidado.
          Seu progresso será salvo localmente em seu navegador.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <Button asChild className="w-full">
          <Link href="/">
            <UserPlus className="mr-2 h-4 w-4" /> {/* Ícone alterado */}
            Continuar como Convidado
          </Link>
        </Button>
         <p className="text-xs text-muted-foreground mt-2">
          Já tem uma conta? <Link href="/login" className="font-medium text-primary hover:underline">Login (Em implantação)</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
