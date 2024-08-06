import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
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
export class DiagramsComponent implements OnInit, OnDestroy, AfterViewInit {
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
        // console.log(company?.items?.length)
        let tempNoTies = true;
        const empty: {} = {};

        for (let i = 0; i < company?.items?.length; i++) {
          const parents = company.items[i].parents;
          // console.log(company?.items[i]?.parents)
          // console.log(Object.keys(parents).length > 0)
          if(Object.keys(parents).length > 0) {
            tempNoTies = false;
            break;
          }
        }
        this.noTies = tempNoTies;
        // console.log(this.noTies)
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

  ngAfterViewInit(): void {
    
  }

  ngOnDestroy(): void {
    this.workspaceService.errorResponse.next(null);
    this.companyDetailSub.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }


}
