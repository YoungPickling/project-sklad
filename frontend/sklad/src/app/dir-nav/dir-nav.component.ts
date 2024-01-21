import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dir-nav-element',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dir-nav.component.html',
  styleUrl: './dir-nav.component.css'
})
export class DirNavElementComponent {
  @Input() logo: string = "question_mark";
  @Input() title: string = "?";
  isOpen: boolean = false;

  constructor() {
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
