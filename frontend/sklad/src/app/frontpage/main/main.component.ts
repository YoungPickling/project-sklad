import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  // encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  bannerHeader: string = 'Streamline Your Warehouse Operations';
  bannerSubheading: string = 'Visualise, reduce costs, maximize productivity';

  constructor(private router: Router) {}
  
  //Math.floor(Math.random() * max);

  ngOnInit() {
    const bannerHeaders = [
      'Streamline Your Warehouse Operations',
      'Take Control of Your Inventory',
      'Revolutionize Your Supply Chain Management',
      'Customizable Solutions Tailored to Your Needs',
      'Stay Ahead of Demand with Predictive Insights',
      'Boost Productivity, Minimize Errors'
    ];
    const bannerSubheadings = [
      'Optimize efficiency, reduce costs, maximize productivity',
      'Real-time tracking, accurate reporting, seamless integration',
      'Enhance visibility, improve decision-making, scale your business',
      'Adapt to your unique tequirements, scale as you grow',
      'Anticipate trends, optimize inventory levels, increase profitability',
      'Automate tasks, reduce downtime, enhance accuracy'
    ];

    // const pick = Math.floor(Math.random() * 6);

    // this.bannerHeader = bannerHeaders[pick];
    // this.bannerSubheading = bannerSubheadings[pick];
  }

  onTryOut() {
    this.router.navigate(['workspace']);
  }

  onSignIn() {
    this.router.navigate(['login']);
  }
}
