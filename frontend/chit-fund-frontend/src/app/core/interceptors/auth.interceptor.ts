// import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { inject } from '@angular/core';
// import { AuthService } from '../services/auth.service';

// export const AuthInterceptor: HttpInterceptorFn = (
//   req: HttpRequest<unknown>,
//   next: HttpHandlerFn
// ): Observable<HttpEvent<unknown>> => {
//   const authService = inject(AuthService);
//   const token = authService.getToken();

//   if (token) {
//     const authReq = req.clone({
//       headers: req.headers.set('Authorization', `Bearer ${token}`)
//     });
//     return next(authReq);
//   }

//   return next(req);
// };

// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { Observable, from } from 'rxjs';
// import { StorageService } from '../services/storage.service';
// import { switchMap } from 'rxjs/operators';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private storageService: StorageService) {}

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     return from(this.addToken(request)).pipe(
//       switchMap(requestWithToken => next.handle(requestWithToken))
//     );
//   }

//   private async addToken(request: HttpRequest<any>): Promise<HttpRequest<any>> {
//     const token = await this.storageService.getItem('token');
    
//     if (token && !request.url.includes('/login')) {
//       return request.clone({
//         headers: request.headers.set('Authorization', `Bearer ${token}`)
//       });
//     }
    
//     return request;
//   }
// }

import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);

  return from(addToken(req, storageService)).pipe(
    switchMap(requestWithToken => next(requestWithToken))
  );
};

async function addToken(request: HttpRequest<unknown>, storageService: StorageService): Promise<HttpRequest<unknown>> {
  const token = await storageService.getItem('token');
  
  if (token && !request.url.includes('/login')) {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }
  
  return request;
}