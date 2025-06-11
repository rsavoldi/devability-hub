
import { DictionaryDisplay } from '@/components/dictionary/DictionaryDisplay';
// import { SpellCheck } from 'lucide-react'; // Removido

export default function DictionaryPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center">
           <span role="img" aria-label="Livro Aberto" className="text-4xl mr-3">📖</span> {/* Substituído por emoji */}
           DevAbility Dictionary
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Sua referência rápida para termos e conceitos chave sobre desenvolvimento e inclusão.
        </p>
      </header>
      <DictionaryDisplay />
    </div>
  );
}
