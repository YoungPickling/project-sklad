import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { DirNavElementComponent } from './dir-nav/dir-nav.component';

@Component({
  selector: 'left-bar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIconModule, DirNavElementComponent],
  templateUrl: './left-bar.component.html',
  styleUrl: './left-bar.component.css'
})
export class LeftBarComponent {

}
