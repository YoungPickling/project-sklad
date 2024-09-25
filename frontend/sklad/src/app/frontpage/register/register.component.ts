import { Router, RouterModule } from "@angular/router";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { AuthService, LoginResponseData, RegisterData } from "../login/auth.service";
import { Observable } from "rxjs";

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
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

    const formObject: RegisterData = {
      firstname: form.value.firstname,
      lastname: form.value.lastname,
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    }

    let authObs: Observable<LoginResponseData>;

    authObs = this.loginService.signup(formObject);

    authObs.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/profile']);
      },
      error: (msg) => {
        console.log(msg);
        if (msg.error?.error) {
          this.error = msg.error?.error;
        } else {
          this.error = 'Something went wrong';
        }
        this.isLoading = false;
      },
    });

    // form.reset();
  }
}