import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwtDecode from 'jwt-decode';

// const AUTH_API = 'https://localhost:4200/API/auth';
const AUTH_API = 'http://localhost:3000/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})



export class AuthService {
  [x: string]: any;
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {

    return this.http.post(
      AUTH_API + 'login',
      {
        username,
        password,
      },
      httpOptions
    )
    // return new Observable(observer => {
    //   if(username == 'x' && password == 'xxxxxx')
    //   observer.next({status: 'success'});
    //   else
    //   observer.next({status: 'failed'});
    // });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  getUserDetails(username: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'user-details',
      {
        username,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return new Observable(observer => {
      observer.next({ status: 'success' });
    });
  }

  getTokenExpirationDate(token: string): Date | null {
    try {
      const decoded = jwtDecode(token) as any;

      if (decoded && decoded.exp) {
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decoded.exp);
        return expirationDate;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }

    return null;
  }

  isTokenExpired(token: string): boolean {
    const expirationDate = this.getTokenExpirationDate(token);
    return expirationDate ? expirationDate < new Date() : false;
  }
}


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// const AUTH_API = 'http://localhost:8080/api/auth/';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private token: string | null = null;

//   constructor(private http: HttpClient) {}

//   login(username: string, password: string): Observable<any> {
//     return this.http.post(
//       AUTH_API + 'login',
//       { username, password },
//       httpOptions
//     ).pipe(
//       tap((response: any) => {
//         if (response && response.token) {
//           this.token = response.token;
//           // Store the token in local storage or a secure storage mechanism
//           localStorage.setItem('token', this.token);
//         }
//       })
//     );
//   }

//   // Other methods for registration and logout

//   // Add a method to check if the user is logged in
//   isLoggedIn(): boolean {
//     return !!this.token;
//   }

//   // Add a method to get the token
//   getToken(): string | null {
//     return this.token;
//   }

//   // Add a method to log out
//   logout(): void {
//     this.token = null;
//     // Remove the token from storage
//     localStorage.removeItem('token');
//   }
// }

