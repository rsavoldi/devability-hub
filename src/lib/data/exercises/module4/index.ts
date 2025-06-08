
import type { Exercise } from '@/lib/types';
import { module4MultipleChoiceExercises } from './multipleChoice';
import { module4FillInTheBlankExercises } from './fillInTheBlank';
import { module4AssociationExercises } from './association';
import { module4OrderingExercises } from './ordering';
import { module4DragAndDropExercises } from './dragAndDrop';

export const module4Exercises: Exercise[] = [
  ...module4MultipleChoiceExercises,
  ...module4FillInTheBlankExercises,
  ...module4AssociationExercises,
  ...module4OrderingExercises,
  ...module4DragAndDropExercises,
];
