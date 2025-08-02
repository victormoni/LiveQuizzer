import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // índice da opção correta
}
export interface VoteResult {
  questionId: string;
  counts: number[];
}

export interface ScoreEntry {
  userId: string;
  name: string;
  score: number;
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly scoresUrl = 'http://localhost:8080/api/scores';

  constructor(private apollo: Apollo, private http: HttpClient) {}

  getQuizzes(): Observable<Quiz[]> {
    return this.apollo
      .watchQuery<{ quizzes: Quiz[] }>({
        query: gql`
          query GetQuizzes {
            quizzes {
              id
              title
              questions {
                id
                text
                options
              }
            }
          }
        `,
      })
      .valueChanges.pipe(map((res) => res.data.quizzes));
  }

  getQuiz(id: string): Observable<Quiz> {
    return this.apollo
      .watchQuery<{ quiz: Quiz }>({
        query: gql`
          query GetQuiz($id: ID!) {
            quiz(id: $id) {
              id
              title
              questions {
                id
                text
                options
              }
            }
          }
        `,
        variables: { id },
      })
      .valueChanges.pipe(map((res) => res.data.quiz));
  }

  vote(questionId: string, optionIndex: number): Observable<boolean> {
    return this.apollo
      .mutate<{ vote: boolean }>({
        mutation: gql`
          mutation Vote($questionId: ID!, $optionIndex: Int!) {
            vote(questionId: $questionId, optionIndex: $optionIndex)
          }
        `,
        variables: { questionId, optionIndex },
      })
      .pipe(map((res) => !!res.data?.vote));
  }

  subscribeVoteResults(questionId: string): Observable<VoteResult> {
    return this.apollo
      .subscribe<{ voteResults: VoteResult }>({
        query: gql`
          subscription VoteResults($questionId: ID!) {
            voteResults(questionId: $questionId) {
              questionId
              counts
            }
          }
        `,
        variables: { questionId },
      })
      .pipe(map((res) => res.data!.voteResults));
  }

  submitScore(entry: ScoreEntry) {
    return this.http.post<void>(this.scoresUrl, entry);
  }

  getTopScores() {
    return this.http.get<ScoreEntry[]>(this.scoresUrl);
  }
}
