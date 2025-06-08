
import { DictionaryDisplay } from '@/components/dictionary/DictionaryDisplay';
import { SpellCheck } from 'lucide-react';

export default function DictionaryPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center">
           <SpellCheck className="w-10 h-10 mr-3 text-primary"/>
           DevAbility Dictionary <span role="img" aria-label="open book">📖</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your quick reference for key development terms and concepts.
        </p>
      </header>
      <DictionaryDisplay />
    </div>
  );
}
