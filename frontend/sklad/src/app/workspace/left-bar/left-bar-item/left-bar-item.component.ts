import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-left-bar-item',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './left-bar-item.component.html',
  styleUrl: './left-bar-item.component.css'
})
export class LeftBarItemComponent {
  @Input() logo: string = "question_mark";
  @Input() title: string = "?";
  isOpen: boolean = false;

  constructor() {}

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
