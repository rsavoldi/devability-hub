
"use client";

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { dictionaryTerms as allTerms } from '@/content/dictionary';
import type { DictionaryTerm, Language } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ThematicDictionaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThematicDictionaryDialog: React.FC<ThematicDictionaryDialogProps> = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { language, text } = useLanguage();

  const filteredTerms = useMemo(() => {
    if (!searchTerm) return allTerms;
    return allTerms.filter(term =>
      term.term[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition[language].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, language, allTerms]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] flex flex-col h-[80vh]">
        <DialogHeader>
          <DialogTitle className="font-headline">{text('dictionary')}</DialogTitle>
          <DialogDescription>{text('searchDictionary')}</DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder={text('searchDictionary') + "..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="my-4"
        />
        <ScrollArea className="flex-grow border rounded-md">
          {filteredTerms.length > 0 ? (
            <Accordion type="single" collapsible className="w-full p-4">
              {filteredTerms.map((term) => (
                <AccordionItem value={term.id} key={term.id}>
                  <AccordionTrigger className="font-semibold text-left hover:no-underline">
                    {term.term[language]}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {term.definition[language]}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="p-4 text-center text-muted-foreground">{text('noResultsFound')}</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
