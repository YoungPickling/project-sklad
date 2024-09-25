import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Company } from '../../shared/models/company.model';
import { WorkspaceService } from '../workspace.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AlertComponent, AlertPresets } from '../../shared/alert/alert.component';
import { Location } from '../../shared/models/location.model';
import { ClickOutsideDirective } from '../../shared/directives/clickOutside.directive';
import { ContentEditableModel } from '../../shared/directives/contenteditable.directive';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [
    CommonModule, 
    AlertComponent,
    ClickOutsideDirective,
    ContentEditableModel,
    MatIconModule
  ],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css'
})
export class LocationsComponent implements OnInit, OnDestroy {
  company: Company;
  removeButtonActive = false;
  isLoading = false;

  locationsToDelete: Set<number> = new Set();

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
  errorResponse: HttpErrorResponse;

  constructor(
    private workspaceService: WorkspaceService,
    private cdr: ChangeDetectorRef
  ) {}

  private companyDetailSub: Subscription;
  private loadingSubscription: Subscription;
  private alertWindowSubscription: Subscription;
  private errorSubscription: Subscription;

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
    );

    this.alertWindowSubscription = this.workspaceService.closeAlert.subscribe(
      state => {
        this.alertOpen = state;
      }
    );

    this.errorSubscription = this.workspaceService.errorResponse.subscribe(
      error => {
        this.errorResponse = error;
      }
    );
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
    this.workspaceService.errorResponse.next(null);
    if(this.companyDetailSub) {
      this.companyDetailSub.unsubscribe()
    }
    this.loadingSubscription.unsubscribe();
    this.alertWindowSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  get locations() {
    return this.company?.locations.sort((a, b) => a.id - b.id);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Escape" && this.alertOpen) {
      this.alertOpen = false;
    }
  }

  onClickAddBtn() {
    this.alertPreset = AlertPresets.addLocation
    this.error = null;
    this.alertOpen = true;
  }

  onClickRemoveBtn() {
    if(this.removeButtonActive) {
      this.locationsToDelete = new Set();
    }
    this.removeButtonActive = !this.removeButtonActive;
  }

  onAddLocation(location: any) {
    this.isLoading = true;
    this.workspaceService.addLocation(location);
  }

  onCloseAlert() {
    this.alertOpen = false;
  }

  // ###########
  // row removal logic
  // ###########

  onCheckboxChange(event: Event, index: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.locationsToDelete.add(index);
    } else {
      this.locationsToDelete.delete(index);
    }
  }

  onRemoveRows() {
    this.isLoading = true;
    this.removeButtonActive = false;
    this.workspaceService.removeLocations(Array.from(this.locationsToDelete.values()));
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

    // Create a deep copy of the Location
    let tempLocation: Location = {...this.company.locations[x]};

    switch(y) {
      case 0: { tempLocation.name = this.tempCellValue; break; }
      case 1: { tempLocation.street_and_number = this.tempCellValue; break; }
      case 2: { tempLocation.city_or_town = this.tempCellValue; break; }
      case 3: { tempLocation.country_code = this.tempCellValue; break; }
      case 4: { tempLocation.postal_code = this.tempCellValue; break; }
      case 5: { tempLocation.phone_number = this.tempCellValue; break; }
      case 6: { tempLocation.phone_number_two = this.tempCellValue; break; }
      case 7: { tempLocation.description = this.tempCellValue; break; }
    }
    try {
      this.workspaceService.updateLocation(tempLocation);
      console.log(this.tempCellValue, x + '-' + y);
    } catch (error) {
      console.error(error)
    }
  }
}
