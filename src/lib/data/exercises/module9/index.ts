
import type { Exercise } from '@/lib/types';
import { module9MultipleChoiceExercises } from './multipleChoice';
import { module9FillInTheBlankExercises } from './fillInTheBlank';
import { module9AssociationExercises } from './association';
import { module9OrderingExercises } from './ordering';
import { module9DragAndDropExercises } from './dragAndDrop';

export const module9Exercises: Exercise[] = [
  ...module9MultipleChoiceExercises,
  ...module9FillInTheBlankExercises,
  ...module9AssociationExercises,
  ...module9OrderingExercises,
  ...module9DragAndDropExercises,
];
