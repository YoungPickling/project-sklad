import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Company } from '../../shared/models/company.model';
import { WorkspaceService } from '../workspace.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Item } from '../../shared/models/item.model';
import { ClickOutsideDirective } from '../../shared/directives/clickOutside.directive'
import Utils from '../../shared/utils.service';
import { ContentEditableModel } from '../../shared/directives/contenteditable.directive';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatIconModule, 
    ClickOutsideDirective, 
    FormsModule,
    ContentEditableModel
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit, OnDestroy, AfterViewChecked {
  private focusCellKey: string | null = null;
  company: Company;
  addButtonActive = false;
  removeButtonActive = false;
  isLoading = false;

  itemsToDelete: Set<number> = new Set();

  customColumns: { [key: string]: {value: string, color: string, width: string}; } = {};
  cellEditMode: { [key: string]: boolean } = {}; // to be edited
  cellSelected: { [key: string]: boolean } = {};
  editCellMode: boolean = false;
  tempCellValue: string = '';
  
  lastCellClickedX: number;
  lastCellClickedY: number;
  isCellFirstClicked = false;

  addItemForm: FormGroup;

  constructor(
    private workspaceService: WorkspaceService,
    private cdr: ChangeDetectorRef
  ) {}

  private companyDetailSub: Subscription;
  private loadingSubscription: Subscription;

  ngOnInit() {
    this.companyDetailSub = this.workspaceService.companyDetails.subscribe(
      company => {
        this.company = company;

        company?.items?.forEach(item => {
          item?.columns?.forEach(column => {
            this.customColumns[column.name] = {
              value: column.value, 
              color: Utils.integerToHex(column.color), 
              width: column.width+''
            }
          })
        });
      }
    );

    this.loadingSubscription = this.workspaceService.isLoading.subscribe(
      state => {
        this.isLoading = state;
      }
    )

    this.resetForm()
  }

  ngOnDestroy() {
    this.companyDetailSub.unsubscribe();
    this.loadingSubscription.unsubscribe();
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

  onClickAddBtn() {
    this.itemsToDelete = new Set();
    this.addButtonActive = !this.addButtonActive;
    this.removeButtonActive = false;
  }

  onClickRemoveBtn() {
    if(this.removeButtonActive) {
      this.itemsToDelete = new Set();
    }
    this.removeButtonActive = !this.removeButtonActive;
    this.addButtonActive = false;
    this.resetForm();
  }

  onSubmitAddItem() {
    this.isLoading = true;
    this.addButtonActive = false;
    this.removeButtonActive = false;
    
    let body: Item = this.addItemForm.value;
    body.color = Utils.hexToInteger(body.color + '');

    for (let i = 0; i < body.columns?.length; i++) {
      body.columns[i].color = Utils.hexToInteger(body.columns[i].color + '');
    }

    this.workspaceService.addItem(body);
    // this.addItemForm.reset();
    this.resetForm();
  }
  
  onRemoveRows() {
    this.isLoading = true;
    this.addButtonActive = false;
    this.removeButtonActive = false;

    this.workspaceService.removeItems(Array.from(this.itemsToDelete.values()));
  }

  get columns() {
    return this.addItemForm.get('columns') as FormArray;
  }

  addColumn() {
    const columnGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
      color: new FormControl('#ffffff'),
      width: new FormControl(''),
    });

    this.columns.push(columnGroup);
  }

  logger(something: any) {
    console.log(something);
  }

  onFontColor(hex: string) {
    return Utils.getFontColor(hex);
  }

  removeColumn(index: number) {
    this.columns.removeAt(index);
  }

  onCheckboxChange(event: Event, index: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.itemsToDelete.add(index);
      // console.log("Added: " + index);
    } else {
      this.itemsToDelete.delete(index);
      // console.log("Removed: " + index);
    }
  }

  resetForm() {
    this.addItemForm = new FormGroup({
      code: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      color: new FormControl('#ffffff'),
      description: new FormControl(null),
      columns: new FormArray([])
    });
  }

  getItemColumnValue(item: Item, columnName: string): string {
    const column = item.columns.find(col => col.name === columnName);
    return column ? column.value : '';
  }

  doubleClickCell(x: number, y: number) {
    const cellKey = x + '-' + y;
    if (
      this.isCellFirstClicked && 
      this.lastCellClickedX === x && 
      this.lastCellClickedY === y
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

  onClickOutsideCell(key: string) {
    if(!this.isCellFirstClicked)
      this.cellEditMode[key] = false
  }

  updateCellValue(x: number, y: number) {
    this.isLoading = true;
    this.cellEditMode[x + '-' + y] = false;

    let tempItem: Item = { ...this.company.items[x - 1] };

    if (y === 1) {
      tempItem.code = this.tempCellValue;
      this.workspaceService.updateItem(tempItem);
    } else if (y === 2) {
      tempItem.name = this.tempCellValue;
      this.workspaceService.updateItem(tempItem);
    } else if (y === 3) {
      tempItem.description = this.tempCellValue;
      this.workspaceService.updateItem(tempItem);
    } 
    else if (y >= 4 && y <= (Object.keys(this.customColumns).length + 4)) {
      const customColumnKey = Object.keys(this.customColumns)[y - 4];
      const itemObject = this.company.items[x - 1].columns.find(col => col.name === customColumnKey).value;

      if (itemObject === undefined) {
        // this.workspaceService.updateItemColumn(tempItem);
        // this.company.items[x - 1].columns.push(new ItemColumn(null,"",))
      }

      // find(col => col.name === customColumnKey).value = this.tempCellValue;
    }

    console.log(this.tempCellValue, x + '-' + y);
  }
}
