import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IQuestion } from '../interfaces/question.interface';
import questions from '../mocks/questions.mock.json';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  public getQuestions(): Observable<IQuestion[]> {
    return of(questions);
  }
}
