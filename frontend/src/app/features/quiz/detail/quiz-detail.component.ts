import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { take, takeUntil } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';

import {
  QuizService,
  Quiz,
  Question,
} from '../../../core/services/quiz.service';

import { QuestionCardComponent } from '../../../shared/components/question-card/question-card.component';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    QuestionCardComponent,
  ],
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.scss'],
})
export class QuizDetailComponent implements OnInit, OnDestroy {
  quiz: Quiz | null = null;
  timers: Record<string, number> = {};
  voteResults: Record<string, number[]> = {};
  userVotes: Record<string, number> = {};
  correctAnswers: Record<string, number> = {};
  topScores: { userId: string; name: string; score: number }[] = [];
  currentIndex = 0;
  private destroy$ = new Subject<void>();
  maxTime = 15;

  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id')!;

    this.quizService
      .getQuiz(quizId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((q) => {
        this.quiz = { ...q, questions: this.shuffle(q.questions) };

        this.timers = {};
        this.correctAnswers = {};

        this.quiz.questions.forEach((ques: Question) => {
          this.timers[ques.id] = this.maxTime;

          interval(1000)
            .pipe(take(this.maxTime + 1), takeUntil(this.destroy$))
            .subscribe((elapsed) => {
              this.timers[ques.id] = this.maxTime - elapsed;
            });

          this.quizService
            .subscribeVoteResults(ques.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              this.voteResults[ques.id] = res.counts;
            });

          // Aqui está o ponto chave:
          this.correctAnswers[ques.id] = ques.correctAnswer;
        });

        this.loadLeaderboard();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get currentQuestion(): Question {
    return this.quiz!.questions[this.currentIndex];
  }

  canVote(qid: string): boolean {
    return this.userVotes[qid] == null && this.timers[qid] > 0;
  }

  vote(questionId: string, optionIndex: number) {
    if (!this.canVote(questionId)) return;
    this.userVotes[questionId] = optionIndex;
    this.quizService.vote(questionId, optionIndex).subscribe();
  }

  goToPrev() {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  goToNext() {
    if (!this.quiz) return;
    if (this.currentIndex < this.quiz.questions.length - 1) {
      this.currentIndex++;
    } else {
      // Ao finalizar o quiz, salve o recorde se for maior
      const score = this.getScore();
      const best = Number(localStorage.getItem('bestQuizScore') || 0);
      if (score > best) {
        localStorage.setItem('bestQuizScore', score.toString());
      }
      // this.confettiService.launch();
    }
  }

  quizFinished(): boolean {
    const q = this.currentQuestion;
    return this.userVotes[q.id] != null && this.isLastQuestion();
  }

  isFirstQuestion(): boolean {
    return this.currentIndex === 0;
  }

  isLastQuestion(): boolean {
    return (
      this.quiz != null && this.currentIndex === this.quiz.questions.length - 1
    );
  }

  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  public getScore(): number {
    if (!this.quiz) return 0;
    return this.quiz.questions.filter(
      (q) => this.userVotes[q.id] === this.correctAnswers[q.id]
    ).length;
  }

  private loadLeaderboard(): void {
    this.quizService
      .getTopScores()
      .pipe(takeUntil(this.destroy$))
      .subscribe((list) => (this.topScores = list));
  }

  public getBestScore(): number {
    return Number(localStorage.getItem('bestQuizScore') || 0);
  }

  public restartQuiz(): void {
    if (!this.quiz) return;

    this.quiz = {
      ...this.quiz,
      questions: this.shuffle(this.quiz.questions),
    };

    this.currentIndex = 0;
    this.userVotes = {};
    this.voteResults = {};
    this.timers = {};
    this.correctAnswers = {};

    this.quiz.questions.forEach((q) => {
      this.timers[q.id] = this.maxTime;

      interval(1000)
        .pipe(take(this.maxTime + 1), takeUntil(this.destroy$))
        .subscribe((elapsed) => {
          this.timers = {
            ...this.timers,
            [q.id]: this.maxTime - elapsed,
          };
        });

      // Ponto chave de novo:
      this.correctAnswers[q.id] = q.correctAnswer;
    });
  }
}
