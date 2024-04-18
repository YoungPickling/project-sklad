import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../shared/directives/clickOutside.directive';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  loginMenu = false;

  constructor(private router: Router) {}

  onHome() {
    this.router.navigate(['']);
  }

  onLogin() {
    this.router.navigate(['login']);
  }

  closeLoginMenu() {
    this.loginMenu = false;
  }
}
