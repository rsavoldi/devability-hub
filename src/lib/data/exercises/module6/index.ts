
import type { Exercise } from '@/lib/types';
import { module6MultipleChoiceExercises } from './multipleChoice';
import { module6AssociationExercises } from './association';
import { module6FillInTheBlankExercises } from './fillInTheBlank';
import { module6OrderingExercises } from './ordering';
import { module6DragAndDropExercises } from './dragAndDrop';

export const module6Exercises: Exercise[] = [
  ...module6MultipleChoiceExercises,
  ...module6AssociationExercises,
  ...module6FillInTheBlankExercises,
  ...module6OrderingExercises,
  ...module6DragAndDropExercises,
];
