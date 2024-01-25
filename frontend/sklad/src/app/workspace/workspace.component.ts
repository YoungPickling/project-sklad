import { CommonModule, isPlatformBrowser  } from '@angular/common';
import { AfterViewInit, Component, Input, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { LeftBarComponent } from './left-bar/left-bar.component';

@Component({
  selector: 'workspace',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIconModule, LeftBarComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  @Input() showLeftBar: boolean = true;

  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const leftBar: HTMLElement | null = document.querySelector("left-bar");
        const resizer: HTMLElement | null = document.querySelector(".sklad-left-bar-resizer");

        let isResizing = false;

        function handleMouseMove(event: MouseEvent) {
          if (isResizing && leftBar) {
            const leftBarWidth = event.clientX - leftBar.getBoundingClientRect().left;
            leftBar.style.width = `${leftBarWidth}px`;
            document.documentElement.style.setProperty(
              "--s-left-bar-width",
              `min(100vw - var(--s-left-bar-edge), ${leftBarWidth}px)`
            );
          }
        }

        if (resizer) {
          resizer.addEventListener("mousedown", (event) => {
            isResizing = true;
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", () => {
              isResizing = false;
              document.removeEventListener("mousemove", handleMouseMove);
            });
          });
        }
      } catch (error) {
        console.error('Error in ngAfterViewInit:', error);
      }
    }
  }

  toggleLeftBar() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const leftBar: HTMLElement | null = document.querySelector("left-bar");
        const resizer: HTMLElement | null = document.querySelector(".sklad-left-bar-resizer");

        if(leftBar && resizer) {
          if(this.showLeftBar) {
            leftBar.style.display = "none"
            resizer.style.display = "none"
            this.showLeftBar = false
            console.log("off")
          } else {
            leftBar.style.display = "block"
            resizer.style.display = "block"
            this.showLeftBar = true
            console.log("on")
          }
        }
      } catch (error) {
        console.error('Error in toggleLeftBar:', error);
      }
    }
  }
}
