
import type { Exercise } from '@/lib/types';
import { module12MultipleChoiceExercises } from './multipleChoice';
import { module12FillInTheBlankExercises } from './fillInTheBlank';
import { module12AssociationExercises } from './association';
import { module12OrderingExercises } from './ordering';
import { module12DragAndDropExercises } from './dragAndDrop';

export const module12Exercises: Exercise[] = [
  ...module12MultipleChoiceExercises,
  ...module12FillInTheBlankExercises,
  ...module12AssociationExercises,
  ...module12OrderingExercises,
  ...module12DragAndDropExercises,
];
