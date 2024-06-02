import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { Router } from "@angular/router";
import { catchError, switchMap, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { BriefUserModel } from "./briefUser.model";
import { User } from "../../shared/models/user.model";

export interface LoginResponseData {
  role: string,
  access_token: string
}

export interface RegisterData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<BriefUserModel>(null); // BehaviorSubject
  userDetails = new BehaviorSubject<User>(null);
  // private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    // private router: Router
  ) {}

  login(username: string, password: string) {
    return this.http.post<LoginResponseData>(
      environment.API_SERVER + "/api/rest/v1/secret/auth/login",
      {
        username: username,
        password: password
      }
    )
    .pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(
          username,
          resData.role, 
          resData.access_token
        );
        // this.getUserDetails(resData.access_token);
      }),
      switchMap(resData =>
        this.getUserDetails(resData.access_token)
      )
    );
  }

  signup(regData: RegisterData) {
    return this.http.post<LoginResponseData>(
      environment.API_SERVER + "/api/rest/v1/secret/auth/register",
      regData
    )
    .pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(
          regData.username,
          resData.role, 
          resData.access_token
        );
      }),
      switchMap(resData =>
        this.getUserDetails(resData.access_token)
      )
    );
  }

  getUserDetails(token: string) {
    return this.http.get<any>(
      environment.API_SERVER + "/api/rest/v1/secret/user/me",
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    )
    .pipe(
      catchError(this.handleError),
      tap(userDetails  => {
        this.handleAuthenticationDetails(userDetails);
      })
    )
  }

  logout() {
    this.user.next(null);
    this.userDetails.next(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('userBriefData');
    // this.router.navigate(['/login']);
    // localStorage.removeItems('userBriefData', 'userData');
    // if (this.tokenExpirationTimer) {
    //   clearTimeout(this.tokenExpirationTimer);
    // }
    // this.tokenExpirationTimer = null;
  }

  private handleAuthentication(
    username: string,
    role: string,
    accessToken: string,
  ) {
    const user = new BriefUserModel(username, role, accessToken);
    this.user.next(user);
    localStorage.setItem('userBriefData', JSON.stringify(user));
  }

  private handleAuthenticationDetails(
    user: User
  ) {
    // const userDetails = new BriefUserModel();
    // console.log(user)
    this.userDetails.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
      return throwError(errorRes);
  }

  // autoLogout(expirationDuration: number) {
  //   console.log(expirationDuration);
  //   this.tokenExpirationTimer = setTimeout(() => {
  //     this.logout();
  //   }, expirationDuration);
  // }

  autoLogin() {
    if (typeof localStorage === 'undefined') {
      // Handle the case where localStorage is not available, such as SSR or non-browser environment
      return;
    }

    const userBriefData: BriefUserModel = JSON.parse(localStorage.getItem('userBriefData'));

    if (!userBriefData) {
      return;
    }

    const loadedUser = new BriefUserModel(
      userBriefData.username,
      userBriefData.role,
      userBriefData.token
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      // const userDetails: Observable<User> = this.getUserDetails(loadedUser.token)

      this.getUserDetails(loadedUser.token).subscribe({
        next: (user: User) => {
          this.handleAuthenticationDetails(user);
        },
        error: (error) => {
          // Handle error, maybe logout user or show a message
          console.error("Error fetching user details:", error);
          this.logout();
        }
      });

      // this.http.post<LoginResponseData>(
      //   environment.API_SERVER + "/api/rest/v1/secret/auth/login",
      //   {
      //     email: email,
      //     password: password,
      //     // returnSecureToken: true
      //   }
      // )
      // const expirationDuration = 
      //   new Date(userBriefData.token).getTime() - 
      //   new Date().getTime();
      // this.autoLogout(expirationDuration);
    }
  }

  
}