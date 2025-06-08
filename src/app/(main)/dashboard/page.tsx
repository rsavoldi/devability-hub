
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <LayoutDashboard className="w-10 h-10 mr-3 text-primary" />
          Dashboard
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Seu resumo de progresso e atividades recentes. (Em construção)
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progresso Geral</CardTitle>
            <CardDescription>Visão geral do seu aprendizado.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Conteúdo do progresso aqui...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conquistas Recentes</CardTitle>
            <CardDescription>Suas últimas medalhas.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Lista de conquistas aqui...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>O que você aprendeu ultimamente.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Log de atividades aqui...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
