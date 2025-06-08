
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import MainLayout from '@/components/layout/MainLayout'; // Import MainLayout

export default function HomePage() {
  const { text } = useLanguage();

  return (
    <MainLayout> {/* Wrap content with MainLayout */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4 md:p-8">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="items-center">
            <Rocket className="w-16 h-16 text-primary mb-4" />
            <CardTitle className="text-4xl font-headline text-primary">
              {text('welcomeTitle')}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              {text('welcomeSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/learning-paths" passHref>
              <Button size="lg" className="mt-8 font-semibold animate-pulse">
                {text('explorePaths')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
