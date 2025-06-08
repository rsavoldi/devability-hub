"use client";

import { useState, useMemo, useEffect } from 'react';
import { mockDictionaryTerms } from '@/lib/mockData';
import type { DictionaryTerm } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

export function DictionaryDisplay() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensure client-side specific logic runs after mount
  }, []);


  const filteredTerms = useMemo(() => {
    let terms = mockDictionaryTerms;
    if (searchTerm) {
      terms = terms.filter(term =>
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeLetter) {
      terms = terms.filter(term => term.term.toUpperCase().startsWith(activeLetter));
    }
    return terms.sort((a,b) => a.term.localeCompare(b.term));
  }, [searchTerm, activeLetter]);

  const termsByLetter = useMemo(() => {
    return filteredTerms.reduce((acc, term) => {
      const firstLetter = term.term[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(term);
      return acc;
    }, {} as Record<string, DictionaryTerm[]>);
  }, [filteredTerms]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  if (!mounted) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Themed Dictionary 📖</CardTitle>
          <CardDescription>Explore key terms and concepts in development.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search terms or definitions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value) setActiveLetter(null); // Clear letter filter when searching
              }}
              className="w-full text-base"
            />
          </div>

          <div className="flex flex-wrap gap-1 mb-6 justify-center">
            <ButtonLetterFilter letter="All" isActive={activeLetter === null && !searchTerm} onClick={() => { setActiveLetter(null); setSearchTerm(''); }} />
            {alphabet.map(letter => (
              <ButtonLetterFilter key={letter} letter={letter} isActive={activeLetter === letter} onClick={() => { setActiveLetter(letter); setSearchTerm(''); }} />
            ))}
          </div>
          
          {Object.keys(termsByLetter).length > 0 ? (
            <ScrollArea className="h-[500px] pr-4">
              <Accordion type="multiple" className="w-full" defaultValue={Object.keys(termsByLetter)}>
                {Object.entries(termsByLetter).map(([letter, terms]) => (
                  <AccordionItem value={letter} key={letter}>
                    <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                      {letter} ({terms.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-4">
                        {terms.map(term => (
                          <li key={term.id} className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors">
                            <h4 className="font-semibold text-lg text-primary">{term.term}</h4>
                            <p className="mt-1 text-sm">{term.definition}</p>
                            {term.category && (
                              <Badge variant="secondary" className="mt-2">{term.category}</Badge>
                            )}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {searchTerm ? `No terms found for "${searchTerm}".` : activeLetter ? `No terms starting with "${activeLetter}".`: "No terms available."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ButtonLetterFilterProps {
  letter: string;
  isActive: boolean;
  onClick: () => void;
}

function ButtonLetterFilter({letter, isActive, onClick}: ButtonLetterFilterProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-md transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
    >
      {letter}
    </button>
  );
}
