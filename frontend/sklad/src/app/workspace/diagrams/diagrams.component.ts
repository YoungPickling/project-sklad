import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AlertComponent } from '../../shared/alert/alert.component';
import { ImageCacheDirective } from '../../shared/directives/image.directive';
import { Company } from '../../shared/models/company.model';
import { WorkspaceService } from '../workspace.service';
import { Subscription } from 'rxjs';
import Utils from '../../shared/utils.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-diagrams',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule,
    ImageCacheDirective,
    AlertComponent,
  ],
  templateUrl: './diagrams.component.html',
  styleUrl: './diagrams.component.css'
})
export class DiagramsComponent implements OnInit {
  company: Company;
  isLoading = false;
  errorResponse: HttpErrorResponse;

  noTies: boolean;

  link = environment.API_SERVER + "/api/rest/v1/secret/image/";

  private companyDetailSub: Subscription;
  private loadingSubscription: Subscription;
  private errorSubscription: Subscription;

  constructor(
    private workspaceService: WorkspaceService,
  ) {}

  ngOnInit(): void {
    this.companyDetailSub = this.workspaceService.companyDetails.subscribe(
      company => {
        this.company = company;
        
        let tempNoTies = true;
        for (let i = 0; i < company.items?.length; i++) {
          if(company.items[i].parents?.size > 0) {
            tempNoTies = false;
            break;
          }
        }
        this.noTies = tempNoTies;
      }
    );

    this.loadingSubscription = this.workspaceService.isLoading.subscribe(
      state => {
        this.isLoading = state;
      }
    );

    this.errorSubscription = this.workspaceService.errorResponse.subscribe(
      error => {
        this.errorResponse = error;
      }
    );
  }


}
