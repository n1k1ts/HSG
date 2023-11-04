import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve the token from local storage
    const token = sessionStorage.getItem('auth-token'); // Replace 'your_token_key' with the actual key you use in local storage.

    // Clone the request and add the token to the headers if it exists
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `${token}`
        }
      });
    }

    // Set withCredentials to true if needed
    req = req.clone({
      withCredentials: true,
    });

    return next.handle(req).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          // Handle HTTP errors (e.g., 404, 500, etc.)
          if (error.status == 403) {
            sessionStorage.clear();
            alert("Session has been expired");
            window.location.href = '/login'
          }
          console.error('HTTP error:', error.status, error.statusText);
          // You can add your custom error handling logic here

          // Re-throw the error to propagate it to the subscriber
          return throwError(error);
        } else {
          // Handle non-HTTP errors (e.g., network errors, client errors)
          console.error('Non-HTTP error:', error);
          // You can add your custom error handling logic here

          // Re-throw the error to propagate it to the subscriber
          return throwError(error);
        }
      })
    );
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
