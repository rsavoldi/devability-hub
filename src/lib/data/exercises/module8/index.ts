
import type { Exercise } from '@/lib/types';
import { module8MultipleChoiceExercises } from './multipleChoice';
import { module8FillInTheBlankExercises } from './fillInTheBlank';
import { module8AssociationExercises } from './association';
import { module8OrderingExercises } from './ordering';
import { module8DragAndDropExercises } from './dragAndDrop';

export const module8Exercises: Exercise[] = [
  ...module8MultipleChoiceExercises,
  ...module8FillInTheBlankExercises,
  ...module8AssociationExercises,
  ...module8OrderingExercises,
  ...module8DragAndDropExercises,
];
