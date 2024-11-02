import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { WorkspaceService } from "../workspace.service";
import { Company } from "../../shared/models/company.model";
import { Subscription } from "rxjs";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  company: Company;
  companyId: number;

  constructor(
    private workspaceService: WorkspaceService
  ) {}

  private companyDetailSub: Subscription;

  ngOnInit() {
    this.companyDetailSub = this.workspaceService.companyDetails.subscribe(
      company => {
        if(company) {
          this.company = company;
          this.companyId = company.id;
        }
      }
    );
  }
    

  ngOnDestroy() {
    if(this.companyDetailSub) {
      this.companyDetailSub.unsubscribe()
    }
  }
}