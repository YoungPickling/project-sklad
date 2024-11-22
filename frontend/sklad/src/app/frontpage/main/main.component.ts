import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, HostListener, Inject, PLATFORM_ID, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { ImageCacheDirective } from '../../shared/directives/image.directive';
import { environment } from '../../../environments/environment';
import { NodeComponent } from './node/node.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    NodeComponent,
    // ImageCacheDirective,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  // encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  bannerHeader: string = 'Insights to Stay Ahead of Demand';
  bannerSubheading: string = 'Visualise, reduce costs, maximize productivity';

  translateX: number = 180;
  svgWidth: number = 390;
  pathD: string[] = ['M0,0C125,0,125,-150,250,-150',
    'M0,0C125,0,125,-50,250,-50',
    'M0,0C125,0,125,50,250,50',
    'M0,0C125,0,125,150,250,150'];

  // variable = getComputedStyle(
  //   (document.querySelector('.node-offset') as Element)
  // ) as CSSStyleDeclaration;

  delayOne: boolean = false;
  link = environment.FRONT_SERVER;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // const bannerHeaders = [
    //   'Streamline Your Warehouse Operations',
    //   'Take Control of Your Inventory',
    //   'Revolutionize Your Supply Chain Management',
    //   'Customizable Solutions Tailored to Your Needs',
    //   'Insights to Stay Ahead of Demand',
    //   'Boost Productivity, Minimize Errors',

    //   'Insights for Success',
    //   'Analyze Stock'
    // ];
    // const bannerSubheadings = [
    //   'Optimize efficiency, reduce costs, maximize productivity',
    //   'Real-time tracking, accurate reporting, seamless integration',
    //   'Enhance visibility, improve decision-making, scale your business',
    //   'Adapt to your unique tequirements, scale as you grow',
    //   'Anticipate trends, optimize inventory levels, increase profitability',
    //   'Automate tasks, reduce downtime, enhance accuracy'
    // ];

    // const pick = Math.floor(Math.random() * 6);

    // this.bannerHeader = bannerHeaders[pick];
    // this.bannerSubheading = bannerSubheadings[pick];
    this.updateView();
  }

  ngAfterViewInit(): void {
    new Promise(() => {
      setTimeout(() => {
        this.delayOne = true;
      }, 300);
    })
  }

  // To make sure everything displays as it should
  ngOnDestroy(): void {
    this.delayOne = false;
  }

  onTryOut() {
    this.router.navigate(['workspace',0]);
  }

  onSignIn() {
    this.router.navigate(['login']);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateView();
  }

  updateView() {
    if (isPlatformBrowser(this.platformId)) {
      const screenWidth = window.innerWidth;
      this.translateX = Math.max(Math.min(screenWidth * 0.25, 180), 80);

      // this.svgWidth = Math.max(Math.min(screenWidth * 0.5416667, 390), 295);
      this.svgWidth = 295 + (this.translateX - 85) ;

      for (let i = 0; i < this.pathD.length; i++) {
        const controlPoint = Math.max(Math.min(screenWidth * 0.17361, 125), 80);
        const controlPointX = Math.max(Math.min(screenWidth * 0.17361, 125), 80);
        const controlPointY = Math.max(Math.min(screenWidth * (-0.34722), -150 + 100 * i), -150  + 100 * i);
        const endPointX = Math.max(Math.min(screenWidth * 0.25722, 250), 80);

        this.pathD[i] = `M50,0C${controlPoint},0,${controlPointX},${controlPointY},${endPointX},${controlPointY}`;
      }
    } else {
      this.translateX = 180;
      this.svgWidth = 390;
      this.pathD = ['M50,0C125,0,125,-150,250,-150',
        'M50,0C125,0,125,-50,250,-50',
        'M50,0C125,0,125,50,250,50',
        'M50,0C125,0,125,150,250,150']
    }
  }
}
