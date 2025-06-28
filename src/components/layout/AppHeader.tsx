
// src/components/layout/AppHeader.tsx
"use client";

import Link from "next/link";
import { UserCircle, Menu as MenuIcon, Settings, LogOut, UserPlus, LogIn, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { NavItem } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatbotDialog } from "@/components/chatbot/ChatbotDialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useLessonUi } from "@/contexts/LessonUiContext";
import { Progress } from "../ui/progress";


const mainNavItems: NavItem[] = [
  { href: "/", label: "Roadmap", emoji: "🗺️" },
  { href: "/lessons", label: "Lições", emoji: "📖" },
  { href: "/exercises", label: "Exercícios", emoji: "🎯" },
  { href: "/dictionary", label: "Dicionário", emoji: "📚" },
  { href: "/achievements", label: "Conquistas", emoji: "🏆" },
];

const toolNavItems: NavItem[] = [
];

export function AppHeader() {
  const { setTheme, theme } = useTheme();
  const isMobile = useIsMobile();
  const { currentUser, userProfile, signInWithGoogle, signOutFirebase, clearCurrentUserProgress } = useAuth();
  const router = useRouter();
  const lessonUi = useLessonUi();

  const allNavItemsForMobileMenu = [...mainNavItems, ...toolNavItems];

  const handleClearProgress = () => {
    if (confirm("Tem certeza que deseja limpar seu progresso local? Esta ação não pode ser desfeita.")) {
      clearCurrentUserProgress();
      router.push('/');
    }
  };

  const displayName = userProfile?.name || "Convidado(a)";
  const displayAvatarFallback = displayName.substring(0, 1).toUpperCase();
  const displayAvatarUrl = userProfile?.avatarUrl || `https://placehold.co/100x100.png?text=${displayAvatarFallback}`;


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <TooltipProvider delayDuration={0}>
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span role="img" aria-label="Troféu DevAbility Hub" className="text-2xl">🏆</span>
              <h1 className="text-xl font-bold tracking-tight">DevAbility Hub</h1>
            </Link>
          </div>

          {!isMobile && (
            lessonUi && lessonUi.lessonTitle ? (
              // MINI PROGRESS GUI (for lesson pages)
              <div className="flex-1 flex items-center justify-center px-4">
                <div
                  className="flex items-center gap-3 text-sm font-medium border rounded-full px-3 py-1.5 bg-muted/50 shadow-inner"
                  title={lessonUi.lessonTitle ?? undefined}
                >
                  <span className="text-lg" role="img" aria-label="Lição">
                    📖
                  </span>
                  <h2 className="font-semibold text-foreground">
                    Lição {lessonUi.lessonNumber}
                  </h2>
                  <Progress
                    value={
                      lessonUi.totalInteractions > 0
                        ? (lessonUi.completedInteractions /
                            lessonUi.totalInteractions) *
                          100
                        : 0
                    }
                    className="h-2 w-32"
                  />
                  <span className="font-mono text-muted-foreground w-14 text-center">
                    {lessonUi.completedInteractions}/{lessonUi.totalInteractions}
                  </span>
                </div>
              </div>
            ) : (
            // MAIN NAV (for other pages)
            <nav className="ml-6 flex items-center gap-1">
              {mainNavItems.map((item) => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Button asChild variant="ghost" size="icon" aria-label={item.label}>
                      <Link href={item.href}>
                        <span className="text-xl leading-none">{item.emoji}</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {toolNavItems.map((item) => (
                 <Tooltip key={item.href}>
                 <TooltipTrigger asChild>
                   <Button asChild variant="ghost" size="icon" aria-label={item.label}>
                     <Link href={item.href}>
                       <span className="text-xl leading-none">{item.emoji}</span>
                     </Link>
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent>
                   <p>{item.label}</p>
                 </TooltipContent>
               </Tooltip>
              ))}
            </nav>
            )
          )}

          {/* This spacer is only needed when the main nav is visible */}
          <div className={cn("flex-grow", (lessonUi && lessonUi.lessonTitle && !isMobile) ? "hidden" : "block")} />

          <div className="flex items-center gap-2">
            {userProfile && (
              <div className={cn("items-center gap-2 text-sm font-medium", isMobile ? "hidden" : "flex")}>
                <span>💎</span>
                <span>{userProfile.points} Pontos</span>
              </div>
            )}
            
            <ChatbotDialog />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Alternar tema"
              className="text-xl"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
              <span className="sr-only">Alternar tema</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" suppressHydrationWarning>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={displayAvatarUrl} alt={displayName} />
                    <AvatarFallback>{displayAvatarFallback}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    {currentUser?.email && (
                       <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleClearProgress}>
                  <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                  <span className="text-destructive">Limpar Progresso Local</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {currentUser ? (
                  <DropdownMenuItem onClick={signOutFirebase}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Login</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">
                         <UserPlus className="mr-2 h-4 w-4" /> 
                         <span>Registrar</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Abrir menu principal" suppressHydrationWarning>
                    <MenuIcon className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Navegação</DropdownMenuLabel>
                  {allNavItemsForMobileMenu.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href}>
                        <span className="flex items-center w-full">
                          <span className="mr-2 text-lg leading-none">{item.emoji}</span>
                          {item.label}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                   {userProfile && ( 
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex sm:hidden items-center gap-2 text-sm font-medium">
                          <span>💎</span>
                          <span>{userProfile.points} Pontos</span>
                      </DropdownMenuItem>
                    </>
                   )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </TooltipProvider>
    </header>
  );
}
