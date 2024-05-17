import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule} from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Params, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { WorkspaceService } from './workspace.service';
import { Company } from '../shared/models/company.model';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet, 
    MatIconModule,
  ],
  providers: [WorkspaceService],
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  companyId: number;
  isLoading = false;
  showLeftBar = true;
  sideBarMaximized = true;
  
  company: Company;
  currentRoute: string;
  // breadcrum: {name: string, url: string[]}[];

  private routeParamsSub: Subscription;
  private routerEventsSub: Subscription;
  private companyDetailSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private workspaceService: WorkspaceService
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
    this.currentRoute = this.onBreadcrumbUpdate(this.router.url);

    this.companyId = +this.route.snapshot.params['companyId'];

    this.routeParamsSub = this.route.params.subscribe({
      next: (params: Params) => {
        this.companyId = params['companyId'];
        this.workspaceService.getCompany(this.companyId);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });

    this.companyDetailSub = this.workspaceService.companyDetails.subscribe(
      company => this.company = company
    );

    this.routerEventsSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = this.onBreadcrumbUpdate(event.urlAfterRedirects);
      }
    );
  }

  // toggleLeftBar() {
  //   this.showLeftBar = !this.showLeftBar;
  // }

  ngOnDestroy() {
    this.routeParamsSub.unsubscribe();
    this.routerEventsSub.unsubscribe();
    this.companyDetailSub.unsubscribe();
  }
  
  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  // onBreadcrumbUpdate(route: string) {
  //   const splitRoute: string[] = route.slice(1).split("/");
  //   splitRoute.shift();
  //   splitRoute.shift();
  //   splitRoute.unshift("Home");
  //   console.log(splitRoute)
  //   return splitRoute.toString();
  // }

  onBreadcrumbUpdate(route: string): string {
    const pathSegments = route.split("/");
    // Remove the first two segments
    const relevantSegments = pathSegments.slice(3);
    // Add "Home" at the beginning
    const breadcrumb = ["Home", ...relevantSegments];
    // Join segments with a delimiter of your choice, e.g., ' > '
    return breadcrumb.join(" > ");
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
