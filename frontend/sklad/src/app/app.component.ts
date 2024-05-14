import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { WorkspaceComponent } from './workspace/workspace.component';
import { AuthService } from './frontpage/login/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIconModule, WorkspaceComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'sklad';

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.autoLogin();
  }
}
