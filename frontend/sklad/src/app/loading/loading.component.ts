import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
// import { AuthService } from '../../frontpage/login/auth.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent implements OnInit {
  toggleMenu = true;

  constructor(
    // private router: Router,
  ) {
    // setTimeout(() => {
    //   this.toggleMenu = true;
    // }, 5000);
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.toggleMenu = true;
    // }, 5000);
  }
}
