import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Embaralha os elementos de um array utilizando o algoritmo de Fisher-Yates.
 * Retorna um novo array embaralhado, não modifica o original.
 * @param array O array a ser embaralhado.
 * @returns Um novo array com os elementos embaralhados.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Conta o número de elementos interativos no conteúdo de uma lição.
 * @param content O conteúdo da lição em string.
 * @returns O número total de interações.
 */
export function countInteractions(content: string): number {
  if (!content) return 0;
  // Regex para encontrar os dois tipos de interações
  const wordChoiceRegexSource = "INTERACTIVE_WORD_CHOICE:\\s*OPTIONS=\\[(.*?)\\]";
  const fillBlankRegexSource = "INTERACTIVE_FILL_IN_BLANK:\\s*\\[(.*?)\\]";
  const combinedRegex = new RegExp(
    `<!--\\s*(${wordChoiceRegexSource})\\s*-->|<!--\\s*(${fillBlankRegexSource})\\s*-->`,
    "g"
  );
  const matches = content.match(combinedRegex);
  return matches ? matches.length : 0;
}
