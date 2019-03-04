import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, switchMap, mergeMap, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

import * as AuthAction from './auth.actions';

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthAction.TRY_SIGNUP),
    map((action: AuthAction.TrySignup) => {
      return action.payload;
    }),
    switchMap((authData: { username: string; password: string }) => {
      return from(
        firebase
          .auth()
          .createUserWithEmailAndPassword(authData.username, authData.password)
      );
    }),
    switchMap(() => {
      return from(firebase.auth().currentUser.getIdToken());
    }),
    mergeMap((token: string) => {
      this.router.navigate(['/']);
      return [
        {
          type: AuthAction.SIGNUP
        },
        {
          type: AuthAction.SET_TOKEN,
          payload: token
        }
      ];
    })
  );

  @Effect()
  authSignin = this.actions$.pipe(
    ofType(AuthAction.TRY_SIGNIN),
    map((action: AuthAction.TrySignin) => {
      return action.payload;
    }),
    switchMap((authData: { username: string; password: string }) => {
      return from(
        firebase
          .auth()
          .signInWithEmailAndPassword(authData.username, authData.password)
      );
    }),
    switchMap(() => {
      return from(firebase.auth().currentUser.getIdToken());
    }),
    mergeMap((token: string) => {
      this.router.navigate(['/']);
      return [
        {
          type: AuthAction.SIGNIN
        },
        {
          type: AuthAction.SET_TOKEN,
          payload: token
        }
      ];
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthAction.LOGOUT),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(private actions$: Actions, private router: Router) {}
}
