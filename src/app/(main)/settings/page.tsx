
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon } from "lucide-react"; // Renamed to avoid conflict

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
            <SettingsIcon className="w-10 h-10 mr-3 text-primary" />
            Configurações
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Gerencie suas preferências de aplicativo e configurações de conta.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
            <CardDescription>Atualize seus dados pessoais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" defaultValue="Alex Coder" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Endereço de Email</Label>
              <Input id="email" type="email" defaultValue="alex.coder@example.com" />
            </div>
            <Button className="w-full">Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Gerencie suas preferências de notificação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                <span>Notificações por Email</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receba atualizações sobre novas lições e conquistas.
                </span>
              </Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                <span>Notificações Push</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receba alertas em tempo real no seu dispositivo (se suportado).
                </span>
              </Label>
              <Switch id="push-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a aparência.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-1">
                <Label htmlFor="language">Idioma</Label>
                <Select defaultValue="pt">
                    <SelectTrigger id="language">
                        <SelectValue placeholder="Selecionar idioma" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pt">Português</SelectItem>
                        <SelectItem value="en">Inglês</SelectItem>
                        <SelectItem value="es" disabled>Español (em breve)</SelectItem>
                        <SelectItem value="fr" disabled>Français (em breve)</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <p className="text-sm text-muted-foreground">O tema (Claro/Escuro) é gerenciado pelo botão no cabeçalho.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
