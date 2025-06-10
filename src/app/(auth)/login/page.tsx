// src/app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import { Award, LogIn } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <Award className="mx-auto h-10 w-10 text-primary" />
        <CardTitle className="text-2xl font-bold">Acesso à Conta</CardTitle>
        <CardDescription>
          A funcionalidade de login e criação de conta está <strong className="text-primary">em implantação</strong>.
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
            <LogIn className="mr-2 h-4 w-4" />
            Acessar como Convidado
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
