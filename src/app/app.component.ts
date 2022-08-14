import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { QuestionService } from './services/question.service';
import { UserService } from './services/user.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Subscription, take, tap } from 'rxjs';
import { IQuestion } from './interfaces/question.interface';
import { ResponseService } from './services/response/response.service';
import { IUser } from './interfaces/user.interface';

interface IResponseFormGroup {
  answeredIndex: FormControl<number | null>;
  questionId: FormControl<string>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public users: IUser[] = [];
  public questions: IQuestion[] = [];
  public matchingUsersCount: number = 0;
  public form = this.fb.group({
    chosenUser: ['', [Validators.required]],
    responses: this.fb.array<FormGroup<IResponseFormGroup>>([]),
  });

  @ViewChild('formDirective')
  private formDirective: FormGroupDirective | undefined;
  private mainSubscription = new Subscription();

  constructor(
    public userService: UserService,
    public responseService: ResponseService,
    private questionService: QuestionService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.listenToResponseCounter();
    this.getQuestions();
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.mainSubscription.unsubscribe();
  }

  submitResponse() {
    const responses = this.prepareResponses();
    this.responseService
      .saveResponses(responses)
      .pipe(
        take(1),
        tap(() => this.removeAnsweredUser())
      )
      .subscribe(() => {
        // angular-material specific
        // They track whether the form was already submitted or not and there is no way to reset this bool
        // without reaching to the ngForm itself as below.
        (this.formDirective as FormGroupDirective).resetForm();
        this.form.reset();
      });
  }

  private removeAnsweredUser(): void {
    this.users = this.users.filter(
      ({ id }) => id !== this.form.value.chosenUser
    );
  }

  private getUsers() {
    this.userService
      .getUsers()
      .pipe(take(1))
      .subscribe((users) => (this.users = users));
  }

  private listenToResponseCounter() {
    this.mainSubscription.add(
      this.responseService
        .getLiveFilteredCount()
        .subscribe((count) => (this.matchingUsersCount = count))
    );
  }

  private getQuestions() {
    this.questionService
      .getQuestions()
      .pipe(
        take(1),
        tap((questions) => (this.questions = questions))
      )
      .subscribe((questions) =>
        questions.forEach((question) =>
          this.form.controls.responses.push(
            this.fb.group<IResponseFormGroup>({
              questionId: this.fb.nonNullable.control(question.id),
              answeredIndex: this.fb.control(null, [Validators.required]),
            })
          )
        )
      );
  }

  private prepareResponses() {
    const rawValue = this.form.getRawValue();
    return rawValue.responses.map((response) => ({
      userId: rawValue.chosenUser as string,
      questionId: response.questionId as string,
      answeredIndex: response.answeredIndex as number,
    }));
  }
}
