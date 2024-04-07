import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { LeftBarItemComponent } from './left-bar-item/left-bar-item.component';

@Component({
  selector: 'app-left-bar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIconModule, LeftBarItemComponent],
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css']
})
export class LeftBarComponent {
  // Initial width of the left bar
  leftBarWidth: number; // Example initial width

  // Variables to track mouse dragging
  isResizerClicked = false;
  startX: number;

  constructor() {}

  // Method to handle mouse down event on the resizer
  onResizerMouseDown(event: MouseEvent) {
    this.isResizerClicked = true;
    this.startX = event.clientX;
    this.leftBarWidth = event.clientX;
  }

  // Method to handle mouse move event while dragging
  onWindowMouseMove(event: MouseEvent) {
    if (this.isResizerClicked) {
      const diffX = event.clientX - this.startX;
      this.leftBarWidth += diffX;
      document.documentElement.style.setProperty('--s-left-bar-width', this.leftBarWidth + 'px');
      this.startX = event.clientX;
    }
  }

  // Method to handle mouse up event when dragging is finished
  onWindowMouseUp() {
    this.isResizerClicked = false;
  }
}
