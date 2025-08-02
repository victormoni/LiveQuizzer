// src/app/features/quiz/leaderboard/leaderboard.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ScoreEntry } from '../../../core/services/quiz.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <h3>🏆 Top 10</h3>
    <ol>
      <li *ngFor="let s of scores; trackBy: trackById">
        {{ s.name }} — {{ s.score }} pts
      </li>
    </ol>
  `,
})
export class LeaderboardComponent {
  @Input() scores: ScoreEntry[] = [];
  trackById(_i: number, s: ScoreEntry) {
    return s.userId;
  }
}
