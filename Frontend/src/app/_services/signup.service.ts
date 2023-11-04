import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private signUpUrl = 'your-sign-up-endpoint-url';
  constructor(private http: HttpClient) { }
  signUp(username: string, email: string, password: string): Observable<any> {
    const body = { username, email, password };
    return this.http.post(this.signUpUrl, body);
  }
}
