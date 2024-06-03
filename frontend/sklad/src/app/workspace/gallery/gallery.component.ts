import { Component, OnDestroy, OnInit } from '@angular/core';
import { Company } from '../../shared/models/company.model';
import { WorkspaceService } from '../workspace.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit, OnDestroy {
  company: Company;
  link = environment.API_SERVER + "/api/rest/v1/secret/image/";

  addButtonActive = false;
  removeButtonActive = false;
  isLoading = false;

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

  onClickAddBtn() {

  }

  onClickRemoveBtn() {

  }
}
