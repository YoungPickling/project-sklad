import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { WorkspaceService } from "../workspace.service";
import { Company } from "../../shared/models/company.model";
import { Subscription } from "rxjs";

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingPageComponent implements OnInit {
  company: Company;

  constructor(
    private workspaceService: WorkspaceService
  ) {}

  private companyDetailSub: Subscription;

  ngOnInit() {
    this.companyDetailSub = this.workspaceService.companyDetails.subscribe(
      company => {
        this.company = company;
      }
    );
  }

  ngOnDestroy() {
    if(this.companyDetailSub) {
      this.companyDetailSub.unsubscribe()
    }
  }
}