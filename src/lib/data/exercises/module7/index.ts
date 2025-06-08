
import type { Exercise } from '@/lib/types';
import { module7MultipleChoiceExercises } from './multipleChoice';
import { module7AssociationExercises } from './association';
import { module7FillInTheBlankExercises } from './fillInTheBlank';
import { module7OrderingExercises } from './ordering';
import { module7DragAndDropExercises } from './dragAndDrop';

export const module7Exercises: Exercise[] = [
  ...module7MultipleChoiceExercises,
  ...module7FillInTheBlankExercises,
  ...module7AssociationExercises,
  ...module7OrderingExercises,
  ...module7DragAndDropExercises,
];
