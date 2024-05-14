import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { ActivatedRoute, Params, RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    MatIconModule
  ],
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  companyId: string | number;
  isLoading = false
  showLeftBar = true;

  routeHandler: Subscription;

  constructor(
    private route: ActivatedRoute
    // private matIconRegistry: MatIconRegistry, 
    // private domSanitizer: DomSanitizer
  ) {

    // this.matIconRegistry.addSvgIcon(
    //   'left_bar_open',
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/lb-on-ico.svg')
    // );
    // this.matIconRegistry.addSvgIcon(
    //   'left_bar_close',
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/lb-off-ico.svg')
    // );

  }

  ngOnInit() {
    this.companyId = this.route.snapshot.params['companyId'];
    this.routeHandler = this.route.params
      .subscribe({
        next: (params: Params) => {
          this.companyId = params['companyId'];
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  toggleLeftBar() {
    this.showLeftBar = !this.showLeftBar;
  }

  ngOnDestroy() {
    this.routeHandler.unsubscribe();
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
