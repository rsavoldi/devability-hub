
"use client";

import React from 'react';
import InteractiveRoadmap from '@/components/roadmap/InteractiveRoadmap';
import { learningPaths } from '@/content/learningPaths';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LearningPathsPage() {
  const { text, language } = useLanguage();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-center text-primary">
            {text('learningPaths')}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {text('tagline')}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center mb-6">
                {language === 'pt' 
                ? "Navegue pelas trilhas de conhecimento para explorar os diversos aspectos do desenvolvimento e inclusão. Clique em um nó para começar." 
                : "Navigate the learning paths to explore various aspects of development and inclusion. Click on a node to begin."}
            </p>
        </CardContent>
      </Card>
      
      <InteractiveRoadmap items={learningPaths} basePath="/learning-paths" isMainRoadmap={true} />
    </div>
  );
}
