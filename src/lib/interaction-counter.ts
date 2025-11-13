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
