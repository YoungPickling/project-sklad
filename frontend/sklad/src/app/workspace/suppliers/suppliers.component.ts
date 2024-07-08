import { Component, OnDestroy, OnInit } from '@angular/core';
import { Company } from '../../shared/models/company.model';
import { WorkspaceService } from '../workspace.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AlertPresets } from '../../shared/alert/alert.component';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent implements OnInit, OnDestroy {
  company: Company;
  addButtonActive = false;
  removeButtonActive = false;
  isLoading = false;

  alertOpen = false;
  alertPreset: AlertPresets = null;
  error: string;
  tempId: number;
  confirmField: string;

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
