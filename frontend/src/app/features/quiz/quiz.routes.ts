import { Route } from '@angular/router';
import { QuizListComponent } from './list/quiz-list.component';
import { QuizDetailComponent } from './detail/quiz-detail.component';

export const quizRoutes: Route[] = [
  { path: '', component: QuizListComponent },
  { path: ':id', component: QuizDetailComponent },
];
