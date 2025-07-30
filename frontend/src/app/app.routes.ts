import { Route } from '@angular/router';
import { quizRoutes } from './features/quiz/quiz.routes';

export const routes: Route[] = [
  { path: 'quiz', children: quizRoutes },
  { path: '', redirectTo: 'quiz', pathMatch: 'full' },
  { path: '**', redirectTo: 'quiz' },
];
