import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuizService, Quiz } from '../../../core/services/quiz.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quiz-list.component.html',
})
export class QuizListComponent implements OnInit {
  quizzes$: Observable<Quiz[]>;

  constructor(private quizService: QuizService) {
    this.quizzes$ = this.quizService.getQuizzes();
  }
  ngOnInit(): void {}

  trackByQuizId(_idx: number, quiz: Quiz) {
    return quiz.id;
  }
}
