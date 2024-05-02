import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../shared/directives/clickOutside.directive';
import { AuthService } from '../login/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  loginMenu = false;
  isLoggedIn = false;
  username = "";
  initials = "";

  private userDetailsSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.userDetailsSubscription = this.authService.userDetails.subscribe(
      user => {
        this.isLoggedIn = !!user;
        this.username = user?.username || "";
        this.initials = user?.firstname.toUpperCase().at(0) + user?.lastname.toUpperCase().at(0)
      }
    );
  }

  getDetails() {
    return this.authService.userDetails.value
  }

  onHome() {
    this.router.navigate(['']);
  }

  onLogin() {
    this.router.navigate(['login']);
  }

  onLogout() {
    this.loginMenu = false;
    this.authService.logout();
    this.router.navigate(['']);
  }

  closeLoginMenu() {
    this.loginMenu = false;
  }

  ngOnDestroy() {
    if (this.userDetailsSubscription) {
      this.userDetailsSubscription.unsubscribe();
    }
  }
}
