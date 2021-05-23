import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from './api/model/authResponse';
import { AuthRequest } from './api/model/authRequest';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState, LoginAction, LoginFailedAction, LogoutAction } from './auth.reducer';
import { DefaultService } from './api/api/default.service';
import { Action } from '@ngrx/store';
//import * as fromStore from 'src/app/core/store/states/state';
import * as fromAuth from './auth.reducer';
import { FormatInputPathObject } from 'path';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private tokenObservable$: Observable<string>;;
  public loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromAuth.AuthState>,
    private api: DefaultService) {


    this.tokenObservable$ = this.store.select(fromAuth.selectAccessToken);

    this.tokenObservable$.subscribe(value => {
      console.log(`token is ${value} now`);
      this.token = value;
      this.api.configuration.accessToken = (value.length === 0 ? undefined : value);
      this.loggedIn.next(!!value);
    });

    //this.tokenObservable$.subscribe(value => this.api.configuration.accessToken = (value.length === 0 ? undefined : value));
    //this.tokenObservable$.subscribe(value => this.loggedIn.next(!!value));
    
  }

  canAccess(path: string = null): boolean {
    return this.isLoggedIn;
  }

  login(username: string, password: string, path: string): void {
      this.api.login({
        username,
        password,
        path
      }).subscribe(response => {
        let path: string;
        let action: Action;
        if(response.success) {
          path = response.path;
          action = new LoginAction(response.authToken);
        } else {
          path = response.path;
          action = new LoginFailedAction();
        }
        this.store.dispatch(action);
        this.router.navigateByUrl(path);
      });
  }

  logout(): void {
    this.store.dispatch(new LogoutAction());
  }
}
