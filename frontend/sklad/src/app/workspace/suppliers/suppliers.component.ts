import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Company } from '../../shared/models/company.model';
import { WorkspaceService } from '../workspace.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AlertComponent, AlertPresets } from '../../shared/alert/alert.component';
import { ClickOutsideDirective } from '../../shared/directives/clickOutside.directive';
import { ContentEditableModel } from '../../shared/directives/contenteditable.directive';
import { Supplier } from '../../shared/models/supplier.model';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule, 
    AlertComponent,
    ClickOutsideDirective,
    ContentEditableModel
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent implements OnInit, OnDestroy {
  company: Company;
  addButtonActive = false;
  removeButtonActive = false;
  isLoading = false;

  suppliersToDelete: Set<number> = new Set();

  private focusCellKey: string | null = null;
  customColumns: { [key: string]: {value: string, color: string, width: string}; } = {};
  cellEditMode: { [key: string]: boolean } = {};
  cellSelected: { [key: string]: boolean } = {};
  tempCellValue: string = '';
  lastCellClickedX: number;
  lastCellClickedY: number;
  isCellFirstClicked = false;

  alertOpen = false;
  alertPreset: AlertPresets = null;
  error: string;

  constructor(
    private workspaceService: WorkspaceService,
    private cdr: ChangeDetectorRef
  ) {}

  private companyDetailSub: Subscription;
  private loadingSubscription: Subscription;
  private alertWindowSubscription: Subscription;

  ngOnInit() {
    this.companyDetailSub = this.workspaceService.companyDetails.subscribe(
      company => {
        this.company = company;
      }
    );

    this.loadingSubscription = this.workspaceService.isLoading.subscribe(
      state => {
        this.isLoading = state;
      }
    )

    this.alertWindowSubscription = this.workspaceService.closeAlert.subscribe(
      state => {
        this.alertOpen = state;
      }
    )
  }

  ngAfterViewChecked() {
    if (this.focusCellKey) {
      const inputElement = <HTMLInputElement>document.getElementById(this.focusCellKey);
      if (inputElement) {
        inputElement.focus();
        window.getSelection().selectAllChildren(inputElement);
        this.focusCellKey = null;
      }
    }
  }

  ngOnDestroy() {
    if(this.companyDetailSub) {
      this.companyDetailSub.unsubscribe()
    }
    this.loadingSubscription.unsubscribe();
    this.alertWindowSubscription.unsubscribe();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Escape" && this.alertOpen) {
      this.alertOpen = false;
    }
  }

  onClickAddBtn() {
    this.alertPreset = AlertPresets.addSupplier
    this.error = null;
    this.alertOpen = true;
  }

  onClickRemoveBtn() {
    if(this.removeButtonActive) {
      this.suppliersToDelete = new Set();
    }
    this.removeButtonActive = !this.removeButtonActive;
  }

  onAddSupplier(supplier: any) {
    this.isLoading = true;
    this.workspaceService.addSupplier(supplier);
  }

  onCloseAlert() {
    this.alertOpen = false;
  }

  // ###########
  // cell logic
  // ###########

  onClickOutsideCell(key: string) {
    if(!this.isCellFirstClicked)
      this.cellEditMode[key] = false
  }

  doubleClickCell(x: number, y: number) {
    const cellKey = x + '-' + y;
    if (
      this.isCellFirstClicked && 
      this.lastCellClickedX === x && 
      this.lastCellClickedY === y &&
      !this.cellEditMode[cellKey]
    ) {
      console.log('double clicked!' + cellKey) // HTMLInputElement
      this.tempCellValue = (<HTMLElement>document.getElementById(cellKey)).textContent || '';
      this.cellEditMode[cellKey] = true;
      this.focusCellKey = cellKey + 'f';
      this.cdr.detectChanges();
    } else if (this.focusCellKey !== cellKey + 'f') {
      this.isCellFirstClicked = true;
      if(this.lastCellClickedX !== x || this.lastCellClickedY !== y) {
        this.cellEditMode = {};
      }
      this.lastCellClickedX = x;
      this.lastCellClickedY = y;

      new Promise((resolve, reject) => {
        setTimeout(() => {
          this.isCellFirstClicked = false;
        }, 300);
      })
    }
  }

  updateCellValue(x: number, y: number) {
    this.isLoading = true;
    this.cellEditMode[x + '-' + y] = false;

    // Create a deep copy of the Supplier
    let tempSupplier: Supplier = {...this.company.suppliers[x]};

    switch(y) {
      case 0: { tempSupplier.name = this.tempCellValue; break; }
      case 1: { tempSupplier.street_and_number = this.tempCellValue; break; }
      case 2: { tempSupplier.city_or_town = this.tempCellValue; break; }
      case 3: { tempSupplier.country_code = this.tempCellValue; break; }
      case 4: { tempSupplier.postal_code = this.tempCellValue; break; }
      case 5: { tempSupplier.phone_number = this.tempCellValue; break; }
      case 6: { tempSupplier.phone_number_two = this.tempCellValue; break; }
      case 7: { tempSupplier.website = this.tempCellValue; break; }
      case 8: { tempSupplier.description = this.tempCellValue; break; }
    }
    this.workspaceService.updateSupplier(tempSupplier);

    console.log(this.tempCellValue, x + '-' + y);
  }
}
