import { Route } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { QuizListComponent } from './features/quiz/list/quiz-list.component';
import { QuizDetailComponent } from './features/quiz/detail/quiz-detail.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'quiz', component: QuizListComponent, canActivate: [AuthGuard] },
  {
    path: 'quiz/:id',
    component: QuizDetailComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' },
];
