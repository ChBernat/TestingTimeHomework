import { Injectable } from '@angular/core';
import { filter, map, Observable, of, Subject, tap } from 'rxjs';
import { IResponse } from '../../interfaces/response.interface';
import mockedAnswers from '../../mocks/expected-answers.mock.json';

@Injectable({ providedIn: 'root' })
export class ResponseService {
  private responses: IResponse[] = [];
  private matchingQuestionnairesCount = 0;
  private responses$ = new Subject<IResponse[]>();

  // mocks POST
  public saveResponses(responses: IResponse[]): Observable<IResponse[]> {
    this.responses = this.responses.concat(responses);
    // mocks WSS / WS emitter
    this.responses$.next(responses);
    return of(responses);
  }
  // mocks GET
  public getLiveResponses(): Observable<IResponse[]> {
    // mocks WSS / WS receiver
    return this.responses$.asObservable();
  }

  public getLiveFilteredCount(
    expectedAnswers: Record<string, number> = mockedAnswers
  ): Observable<number> {
    return this.getLiveResponses().pipe(
      filter((responses: IResponse[]) =>
        this.checkIfResponseMatches(responses, expectedAnswers)
      ),
      tap(() => this.matchingQuestionnairesCount++),
      map(() => this.matchingQuestionnairesCount)
    );
  }

  private checkIfResponseMatches(
    responses: IResponse[],
    answerFilters: Record<string, number>
  ): boolean {
    return responses.every(
      (response) =>
        answerFilters[response.questionId] === response.answeredIndex
    );
  }
}
