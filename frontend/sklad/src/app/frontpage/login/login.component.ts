import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading = false;
  error: string;

  constructor(
    private loginService: AuthService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;

    const username = form.value.username;
    const password = form.value.password;

    let authObs: Observable<LoginResponseData>;

    authObs = this.loginService.login(username, password);

    authObs.subscribe({
      next: (resData) => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: errorMessage => {
        console.log(errorMessage);
        if(errorMessage.status == 0) {
          this.error = 'Error connecting to the server, please try later'
        } else if(errorMessage.status == 403) {
          this.error = 'Wrong username or password';
        } else {
          this.error = 'Something went wrong';
        }
        this.isLoading = false;
      }
    });

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }
}
