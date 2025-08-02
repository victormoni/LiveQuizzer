import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Question, ScoreEntry } from '../../../core/services/quiz.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';

@Component({
  selector: 'app-question-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    LeaderboardComponent,
  ],
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.scss'],
})
export class QuestionCardComponent {
  @Input() question!: Question;
  @Input() timer!: number;
  @Input() voteResult?: number[];
  @Input() userVote?: number;
  @Input() correctAnswer?: number;
  @Input() currentIndex!: number;
  @Input() quizFinished = false;
  @Input() score = 0;
  @Input() bestScore = 0;
  @Input() topScores: ScoreEntry[] = [];
  @Input() totalQuestions!: number;

  @Output() vote = new EventEmitter<number>();
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() restart = new EventEmitter<void>();

  onSelect(optionIdx: number) {
    this.vote.emit(optionIdx);
  }

  percent(idx: number): number {
    if (!this.voteResult) return 0;
    const total = this.voteResult.reduce((sum, v) => sum + v, 0) || 1;
    return (this.voteResult[idx] / total) * 100;
  }

  onRestart() {
    this.restart.emit();
  }

  isFirstQuestion(): boolean {
    return this.currentIndex === 0;
  }

  isLastQuestion(): boolean {
    return (
      this.totalQuestions > 0 && this.currentIndex === this.totalQuestions - 1
    );
  }
}
