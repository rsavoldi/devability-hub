
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { TranslatedText } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, XCircle } from 'lucide-react';

interface MultipleChoiceExerciseProps {
  question: TranslatedText;
  options: TranslatedText[];
  correctAnswerIndex: number; // 0-indexed
  onCompleted: (isCorrect: boolean) => void;
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  question,
  options,
  correctAnswerIndex,
  onCompleted,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { language, text } = useLanguage();

  const handleSubmit = () => {
    if (selectedValue === undefined) return;
    const selectedIndex = parseInt(selectedValue, 10);
    const correct = selectedIndex === correctAnswerIndex;
    setIsCorrect(correct);
    setSubmitted(true);
    onCompleted(correct); // Notify parent about completion and correctness
  };

  return (
    <Card className="w-full max-w-lg mx-auto my-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{question[language]}</CardTitle>
        {!submitted && <CardDescription>{text('selectAnswer')}</CardDescription>}
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedValue} onValueChange={setSelectedValue} disabled={submitted}>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 my-2 p-2 border rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option[language]}</Label>
              {submitted && index === correctAnswerIndex && <CheckCircle className="h-5 w-5 text-green-500" />}
              {submitted && selectedValue === index.toString() && index !== correctAnswerIndex && <XCircle className="h-5 w-5 text-red-500" />}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        {!submitted && (
          <Button onClick={handleSubmit} disabled={selectedValue === undefined} className="w-full">
            {text('submit')}
          </Button>
        )}
        {submitted && isCorrect && (
          <p className="text-green-600 font-semibold flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" /> {text('correct')}
          </p>
        )}
        {submitted && !isCorrect && (
          <p className="text-red-600 font-semibold flex items-center">
            <XCircle className="mr-2 h-5 w-5" /> {text('incorrect')}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};
