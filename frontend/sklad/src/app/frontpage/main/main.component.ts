import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  // encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  bannerHeader: string = 'Insights to Stay Ahead of Demand';
  bannerSubheading: string = 'Visualise, reduce costs, maximize productivity';

  delayOne: boolean = false;

  constructor(private router: Router) {}
  
  //Math.floor(Math.random() * max);

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
    this.router.navigate(['workspace']);
  }

  onSignIn() {
    this.router.navigate(['login']);
  }
}
