import { CommonModule, isPlatformBrowser,  } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { LeftBarComponent } from './left-bar/left-bar.component';
import { LeftBarItemComponent } from './left-bar/left-bar-item/left-bar-item.component';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    MatIconModule, 
    LeftBarComponent,
    LeftBarItemComponent,
    HttpClientModule
  ],
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  // constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  showLeftBar = true;

  constructor(
    private matIconRegistry: MatIconRegistry, 
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'left_bar_open',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/lb-on-ico.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'left_bar_close',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/lb-off-ico.svg')
    );
  }

  ngOnInit() {}

  toggleLeftBar() {
    this.showLeftBar = !this.showLeftBar;
  }

  // ngAfterViewInit() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     try {
  //       const leftBar: HTMLElement | null = document.querySelector("left-bar");
  //       const resizer: HTMLElement | null = document.querySelector(".sklad-left-bar-resizer");

  //       let isResizing = false;

  //       function handleMouseMove(event: MouseEvent) {
  //         if (isResizing && leftBar) {
  //           const leftBarWidth = event.clientX - leftBar.getBoundingClientRect().left;
  //           leftBar.style.width = `${leftBarWidth}px`;
  //           document.documentElement.style.setProperty(
  //             "--s-left-bar-width",
  //             `min(100vw - var(--s-left-bar-edge), ${leftBarWidth}px)`
  //           );
  //         }
  //       }

  //       if (resizer) {
  //         resizer.addEventListener("mousedown", (event) => {
  //           isResizing = true;
  //           document.addEventListener("mousemove", handleMouseMove);
  //           document.addEventListener("mouseup", () => {
  //             isResizing = false;
  //             document.removeEventListener("mousemove", handleMouseMove);
  //           });
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Error in ngAfterViewInit:', error);
  //     }
  //   }
  // }

  // toggleLeftBar() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     try {
  //       const leftBar: HTMLElement | null = document.querySelector("left-bar");
  //       const resizer: HTMLElement | null = document.querySelector(".sklad-left-bar-resizer");

  //       if(leftBar && resizer) {
  //         if(this.showLeftBar) {
  //           leftBar.style.display = "none"
  //           resizer.style.display = "none"
  //           this.showLeftBar = false
  //           console.log("off")
  //         } else {
  //           leftBar.style.display = "block"
  //           resizer.style.display = "block"
  //           this.showLeftBar = true
  //           console.log("on")
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error in toggleLeftBar:', error);
  //     }
  //   }
  // }
}
