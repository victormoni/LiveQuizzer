// src/app/features/quiz/detail/quiz-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  QuizService,
  Quiz,
  Question,
  VoteResult,
} from '../../../core/services/quiz.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-detail.component.html',
})
export class QuizDetailComponent implements OnInit, OnDestroy {
  quiz: Quiz | null = null;
  voteResults: Record<string, number[]> = {};
  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;

    // Busca somente o quiz desejado
    const subQuiz = this.quizService.getQuiz(id).subscribe((quiz) => {
      this.quiz = quiz;

      // Inscreve em cada votação
      quiz.questions.forEach((q: Question) => {
        const sub = this.quizService
          .subscribeVoteResults(q.id)
          .subscribe((res: VoteResult) => {
            this.voteResults[q.id] = res.counts;
          });
        this.subs.push(sub);
      });
    });

    this.subs.push(subQuiz);
  }

  vote(questionId: string, optionIndex: number): void {
    this.quizService.vote(questionId, optionIndex).subscribe();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
