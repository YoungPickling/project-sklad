import { CommonModule } from '@angular/common';
import { Component, HostListener, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule} from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Params, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { WorkspaceService } from './workspace.service';
import { Company } from '../shared/models/company.model';
import { AuthService } from '../frontpage/login/auth.service';
import { ClickOutsideDirective } from '../shared/directives/clickOutside.directive';
import { environment } from '../../environments/environment';
import { ImageCacheDirective } from '../shared/directives/image.directive';
import { ImageService } from '../shared/image.service';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet, 
    MatIconModule,
    ClickOutsideDirective,
    ImageCacheDirective
  ],
  providers: [WorkspaceService],
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkspaceComponent implements OnInit, OnChanges, OnDestroy {
  companyId: number;
  isLoading = false; // not implemented
  sideBarMaximized = false;

  loginMenu = false;
  isLoggedIn = false;
  username = "";
  initials = "";
  userImageHash = "";
  link = environment.API_SERVER + "/api/rest/v1/secret/image/";

  private userDetailsSubscription: Subscription;
  
  company: Company;
  currentRoute: string[][];

  private routeParamsSub: Subscription;
  private routerEventsSub: Subscription;
  private companyDetailSub: Subscription;

  leftBarMenu: {name: string, logo: string, number: string, link: string[]}[]

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private workspaceService: WorkspaceService,
    private imageService: ImageService
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
    this.userDetailsSubscription = this.authService.userDetails.subscribe(
      user => {
        if(user) {
          this.isLoggedIn = !!user;
          // console.log(this.isLoggedIn);
          this.username = user?.username || "";
          this.initials = user?.firstname.toUpperCase().at(0) + user?.lastname.toUpperCase().at(0);
          this.userImageHash = user?.image?.hash || "";
        }
      }
    );

    // this.companyId = +this.route.snapshot.params['companyId'];

    // this.currentRoute = this.onBreadcrumbUpdate(this.router.url);

    this.routeParamsSub = this.route.params.subscribe({
      next: (params: Params) => {
        this.companyId = params['companyId'];
          try {
            this.workspaceService.getCompany(this.companyId);
          } catch(error) {
            console.error(error);
          }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });

    this.companyDetailSub = this.workspaceService.companyDetails.subscribe(
      company => {
        if(company) {
          this.company = company
          this.companyId = company.id
          this.currentRoute = this.onBreadcrumbUpdate(this.router.url);
        }
      }
    );

    this.routerEventsSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = this.onBreadcrumbUpdate(event.urlAfterRedirects);
      }
    );

    // this.leftBarMenu = [
    //   {
    //     name: "items", 
    //     logo: "inventory_2", 
    //     number: this.company?.items?.length.toString(), 
    //     link: ['/workspace', this.companyId.toString(), 'items']
    //   },
    //   {
    //     name: "suppliers", 
    //     logo: "local_shipping", 
    //     number: this.company?.suppliers?.length.toString(), 
    //     link: ['/workspace', this.companyId.toString(), 'suppliers']
    //   },
    //   {
    //     name: "locations", 
    //     logo: "warehouse", 
    //     number: this.company?.locations?.length.toString(), 
    //     link: ['/workspace', this.companyId.toString(), 'locations']
    //   },
    //   {
    //     name: "users", 
    //     logo: "group", 
    //     number: this.company?.user?.length.toString(), 
    //     link: ['/workspace', this.companyId.toString(), 'users']
    //   },
    //   {
    //     name: "gallery", 
    //     logo: "photo_library", 
    //     number: this.company?.imageData?.length.toString(), 
    //     link: ['/workspace', this.companyId.toString(), 'gallery']
    //   }
    // ]
  }

  ngOnChanges() {
    
  }

  ngOnDestroy() {
    this.imageService.clearCache()
    this.routeParamsSub.unsubscribe();
    this.routerEventsSub.unsubscribe();
    this.companyDetailSub.unsubscribe();
    this.userDetailsSubscription.unsubscribe();
  }

  closeLoginMenu() {
    this.loginMenu = false;
  }

  onLogout() {
    this.loginMenu = false;
    this.authService.logout();
    this.router.navigate(['']);
  }

  onBreadcrumbUpdate(route: string): string[][] {
    const pathSegments = route.split("/");
    // Remove the first two segments
    const relevantSegments = pathSegments.slice(3);

    const breadcrumb: string[][] = [];
    breadcrumb.push(["Home", "/workspace/" + this.companyId]);

    if(relevantSegments) {
      const modedSegments = relevantSegments.map(
        str => str.charAt(0).toUpperCase() + str.slice(1)
      )

      for (let i = 0; i < relevantSegments.length; i++) {
        breadcrumb.push([modedSegments[i], breadcrumb[i][1] + '/' + relevantSegments[i]])
      }
    }
    return breadcrumb;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.altKey) {
      switch(event.key) { 
        case "h": { 
          this.router.navigate(['/workspace', this.companyId]); 
          break; 
        } 
        case "i": { 
          this.router.navigate(['/workspace', this.companyId, 'items']); 
          break; 
        } 
        case "s": { 
          this.router.navigate(['/workspace', this.companyId, 'suppliers']);
          break; 
        } 
        case "l": { 
          this.router.navigate(['/workspace', this.companyId, 'locations']); 
          break; 
        } 
        case "u": { 
          this.router.navigate(['/workspace', this.companyId, 'users']); 
          break; 
        } 
        case "g": { 
          this.router.navigate(['/workspace', this.companyId, 'gallery']);
          break; 
        } 
        // case "d": { 
        //   this.router.navigate(['/workspace', this.companyId, 'diagrams']);
        //   break; 
        // } 
        case "b": { 
          this.sideBarMaximized = !this.sideBarMaximized;
          break; 
       } 
     } 
    }
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
