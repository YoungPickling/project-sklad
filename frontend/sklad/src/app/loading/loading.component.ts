import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { timer } from 'rxjs';

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
export class LoadingComponent implements AfterViewInit {
  toggleMenu: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
    // private router: Router,
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      timer(5000).subscribe(() => this.toggleMenu = true);
    }
  }
}
