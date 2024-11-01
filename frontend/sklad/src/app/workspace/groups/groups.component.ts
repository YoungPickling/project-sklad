import { ChangeDetectorRef, Component } from '@angular/core';
import { Company } from '../../shared/models/company.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { WorkspaceService } from '../workspace.service';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../shared/directives/clickOutside.directive';
import { ContentEditableModel } from '../../shared/directives/contenteditable.directive';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Group } from '../../shared/models/group.model';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    ClickOutsideDirective,
    ContentEditableModel,
    MatIconModule
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
  company: Company;
  addButtonActive = false;
  removeButtonActive = false;
  isLoading = false;

  groupsToDelete: Set<number> = new Set();

  private focusCellKey: string | null = null;
  cellEditMode: { [key: string]: boolean } = {};
  cellSelected: { [key: string]: boolean } = {};
  tempCellValue: string = '';
  lastCellClickedX: number;
  lastCellClickedY: number;
  isCellFirstClicked = false;

  addGroupForm: FormGroup;

  // alertOpen = false;
  // alertPreset: AlertPresets = null;
  error: string;
  errorResponse: HttpErrorResponse;

  constructor(
    private workspaceService: WorkspaceService,
    private cdr: ChangeDetectorRef
  ) {}

  private companyDetailSub: Subscription;
  private loadingSubscription: Subscription;
  // private alertWindowSubscription: Subscription;
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

    // this.alertWindowSubscription = this.workspaceService.closeAlert.subscribe(
    //   state => {
    //     this.alertOpen = state;
    //   }
    // );

    this.errorSubscription = this.workspaceService.errorResponse.subscribe(
      error => {
        this.errorResponse = error;
      }
    );

    this.resetForm();
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
    this.companyDetailSub.unsubscribe()
    this.loadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  get itemGroups() {
    return this.company?.itemGroups?.sort((a, b) => a.id - b.id);
  }

  onClickAddBtn() {
    console.log(this.company?.itemGroups)
    this.groupsToDelete = new Set();
    this.addButtonActive = !this.addButtonActive;
    this.removeButtonActive = false;
    this.error = null;
  }

  onClickRemoveBtn() {
    this.groupsToDelete = new Set();
    this.removeButtonActive = !this.removeButtonActive;
    this.addButtonActive = false;
    this.resetForm();
  }

  onSubmitAddGroup() {
    this.isLoading = true;
    this.addButtonActive = false;
    this.removeButtonActive = false;

    try {
      this.workspaceService.addGroup(this.addGroupForm.value as Group);
    } catch(error) {
      console.error(error)
    }
    this.isLoading = false;
    this.resetForm();
  }

  resetForm() {
    this.addGroupForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
    });
  }

  // ###########
  // row removal logic
  // ###########

  onCheckboxChange(event: Event, index: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.groupsToDelete.add(index);
    } else {
      this.groupsToDelete.delete(index);
    }
  }

  onRemoveRows() {
    this.isLoading = true;
    this.removeButtonActive = false;
    this.workspaceService.removeGroups(Array.from(this.groupsToDelete.values()));
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

      new Promise(() => {
        setTimeout(() => {
          this.isCellFirstClicked = false;
        }, 300);
      })
    }
  }

  updateCellValue(x: number, y: number) {
    this.isLoading = true;
    this.cellEditMode[x + '-' + y] = false;

    // Create a deep copy of the Group
    const tempGroup: Group = {...this.company.itemGroups[x]};
    tempGroup.name = this.tempCellValue;

    try {
      this.workspaceService.updateGroup(tempGroup);
      console.log(this.tempCellValue, x + '-' + y);
    } catch (error) {
      console.error(error)
    }
  }
}
