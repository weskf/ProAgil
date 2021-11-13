import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = 'http://localhost:5000/api/user/';  
  jwtHelper = new JwtHelperService();
  decodeToken: any;

  constructor(private http: HttpClient) { }

  login(model: any){
    return this.http
      .post(`${this.baseURL}login`, model).pipe(
        map((response: any) => {
          const user = response;
          if(user){
            localStorage.setItem('token', user.token);
            this.decodeToken = this.jwtHelper.decodeToken(user.token);
          }
        })
      );
  }

  register(model: any){
      return this.http.post(`${this.baseURL}Register`, model)
  }

  loggedIn(){
    const token = localStorage.getItem('token');
    const tokenExpired = !this.jwtHelper.isTokenExpired(token);
    console.log(tokenExpired);
    return tokenExpired;
  }
}
