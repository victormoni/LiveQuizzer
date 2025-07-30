import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}
export interface Question {
  id: string;
  text: string;
  options: string[];
}
export interface VoteResult {
  questionId: string;
  counts: number[];
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  constructor(private apollo: Apollo) {}

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
}
