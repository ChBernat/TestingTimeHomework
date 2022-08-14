import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import usersData from '../mocks/users.mock.json';

@Injectable({ providedIn: 'root' })
export class UserService {
  public getUsers(): Observable<IUser[]> {
    return of(usersData);
  }
}
