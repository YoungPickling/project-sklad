import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading = false;
  error: string;

  // private closeSub: Subscription;

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
        // console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: errorMessage => {
        console.log(errorMessage);
        if(errorMessage.error?.error) {
          this.error = errorMessage.error?.error;
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

  // ngOnDestroy() {
  //   if (this.closeSub) {
  //     this.closeSub.unsubscribe();
  //   }
  // }
}
