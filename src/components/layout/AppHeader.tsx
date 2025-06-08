
"use client";

import Link from "next/link";
import { Moon, Sun, UserCircle, Menu as MenuIcon, Home, BookOpen, Target, SpellCheck, Trophy, LayoutDashboard, Settings, Award, Bot } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mockUserProfile } from "@/lib/mockData";
import type { NavItem } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatbotDialog } from "@/components/chatbot/ChatbotDialog";
import { cn } from "@/lib/utils";

const mainNavItems: NavItem[] = [
  { href: "/", label: "Roadmap", icon: Home },
  { href: "/lessons", label: "Lições", icon: BookOpen },
  { href: "/exercises", label: "Exercícios", icon: Target },
  { href: "/dictionary", label: "Dicionário", icon: SpellCheck },
  { href: "/achievements", label: "Conquistas", icon: Trophy },
];

const toolNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function AppHeader() {
  const { setTheme, theme } = useTheme();
  const isMobile = useIsMobile();

  const allNavItemsForMobileMenu = [...mainNavItems, ...toolNavItems];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <TooltipProvider delayDuration={0}>
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          {/* Left Section: Logo/Title */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Award className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-bold tracking-tight">DevAbility Hub</h1>
            </Link>
          </div>

          {/* Middle Section (Desktop only): Nav Icons */}
          {!isMobile && (
            <nav className="ml-6 flex items-center gap-1">
              {mainNavItems.map((item) => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Button asChild variant="ghost" size="icon" aria-label={item.label}>
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
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
                       <item.icon className="h-5 w-5" />
                     </Link>
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent>
                   <p>{item.label}</p>
                 </TooltipContent>
               </Tooltip>
              ))}
            </nav>
          )}

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Right Section: Actions and Mobile Menu */}
          <div className="flex items-center gap-2">
            <div className={cn("items-center gap-2 text-sm font-medium", isMobile ? "hidden" : "flex")}>
              <span>💎</span>
              <span>{mockUserProfile.points} Pontos</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Alternar tema"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" suppressHydrationWarning>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={mockUserProfile.avatarUrl} alt={mockUserProfile.name} />
                    <AvatarFallback>{mockUserProfile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{mockUserProfile.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {mockUserProfile.id}@example.com
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <span className="flex items-center w-full">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Perfil
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <span className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Sair (não implementado)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Hamburger Menu */}
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
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                   <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex sm:hidden items-center gap-2 text-sm font-medium">
                        <span>💎</span>
                        <span>{mockUserProfile.points} Pontos</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </TooltipProvider>
    </header>
  );
}

