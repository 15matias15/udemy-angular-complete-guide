import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as fromAuth from '../../auth/store/auth.reducers';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('Req Intercepted', req);
    // const copiedReq = req.clone({ headers: req.headers.set('', '') });

    return this.store
      .select('auth')
      .pipe(
        take(1),
        switchMap((authState: fromAuth.State) => {
          const copiedReq = req.clone({
            params: req.params.set('token', authState.token)
          });
          return next.handle(copiedReq);
        })
      );
  }
}
