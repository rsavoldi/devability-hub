
import type { Exercise } from '@/lib/types';
import { module2MultipleChoiceExercises } from './multipleChoice';
import { module2FillInTheBlankExercises } from './fillInTheBlank';
import { module2AssociationExercises } from './association';
import { module2OrderingExercises } from './ordering';
import { module2DragAndDropExercises } from './dragAndDrop';

export const module2Exercises: Exercise[] = [
  ...module2MultipleChoiceExercises,
  ...module2FillInTheBlankExercises,
  ...module2AssociationExercises,
  ...module2OrderingExercises,
  ...module2DragAndDropExercises,
];
