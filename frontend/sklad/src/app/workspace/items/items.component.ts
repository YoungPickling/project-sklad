import { AfterViewChecked, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
import { AlertComponent, AlertPresets } from '../../shared/alert/alert.component';
import { Image } from '../../shared/models/image.model';
import { environment } from '../../../environments/environment';
import { ItemColumn } from '../../shared/models/item-column.model';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatIconModule, 
    ClickOutsideDirective, 
    FormsModule,
    ContentEditableModel,
    AlertComponent
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
  rowImageContextMenu: boolean[];
  rowImageContextMenuOpen = false
  editCellMode: boolean = false;
  tempCellValue: string = '';
  
  lastCellClickedX: number;
  lastCellClickedY: number;
  isCellFirstClicked = false;

  addItemForm: FormGroup;

  alertOpen = false;
  alertPreset: AlertPresets = null;
  alertItemName: string;
  error: string;
  tempId: number;
  confirmField: string;
  imageList: Image[];

  link = environment.API_SERVER + "/api/rest/v1/secret/image/";

  private companyDetailSub: Subscription;
  private loadingSubscription: Subscription;

  constructor(
    private workspaceService: WorkspaceService,
    private cdr: ChangeDetectorRef
  ) {}

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

    this.rowImageContextMenu = new Array<boolean>(this.company?.items?.length).fill(false);

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

    // let tempItem: Item = { ...this.company.items[x - 1] };

    // Create a deep copy of the item
    let tempItem: Item = { 
      ...this.company.items[x - 1],
      columns: this.company.items[x - 1].columns.map(col => ({ ...col }))
  };

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
      // The Angluar 'keyvalue' pipeline in a template and Javascript sorts keys differently
      // So make sure the key order is the same everywhere
      const keyStore: string[] = Object.keys(this.customColumns).sort();

      // taking column's key
      const customColumnKey: string = keyStore[y - 4];

      // find existing column value for a copy
      const itemColumnObject: ItemColumn = tempItem.columns.find(
        col => col.name === customColumnKey
      );
      
      if (!itemColumnObject) {
        const newItem = {name: customColumnKey, value: this.tempCellValue};
        tempItem.columns.push(newItem);
        this.workspaceService.updateItem(tempItem);
      } else {
        tempItem.columns.find(col => col.name === customColumnKey).value = this.tempCellValue;
        this.workspaceService.updateItem(tempItem);
        // this.company.items[x - 1].columns.push(newItem)
      }
    }

    console.log(this.tempCellValue, x + '-' + y);
  }

  onOpenImageContext(index: number) {
    this.rowImageContextMenu[index] = !this.rowImageContextMenu[index];
  }
  

  onClickOutsideImageContextMenu(i: number) {
    if(this.rowImageContextMenu[i]) {
      this.rowImageContextMenu[i] = false;
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.alertOpen = false;
      this.rowImageContextMenu.fill(false);
    }
  }

  onCloseAlert() {
    this.alertOpen = false;
  }

  onClickRemoveItemImage(index: number) {
    // console.log(image);
    this.tempId = index;
    this.alertItemName = this.company?.items[index]?.name;
    this.alertPreset = AlertPresets.removeItemImage
    this.rowImageContextMenu[index] = false;
    this.alertOpen = true;
  }

  onClickSelectImageFromGallery(index: number) {
    // console.log(image);
    this.rowImageContextMenu[index] = false;
    this.tempId = index;
    this.alertItemName = this.company?.items[index]?.name;
    this.imageList = this.company.imageData;
    this.confirmField = "";
    this.alertPreset = AlertPresets.updateItemImage;
    this.alertOpen = true;
  }

  onRemoveItemImage() {
    this.alertOpen = false;
    this.addButtonActive = false;
    this.removeButtonActive = false;
    this.isLoading = true;
    this.workspaceService.removeItemImage();
  }

  onUpdateItemImage(imageId: number) {
    console.log(imageId);

    this.alertOpen = false;
    this.isLoading = true;
    this.imageList = null;
    this.addButtonActive = false;
    this.removeButtonActive = false;

    let tempItem: Item = { ...this.company.items[this.tempId] };
    if (imageId !== -1) {
      tempItem.image = { ...this.company.imageData.filter(x => x.id === imageId).at(0) };
    } else {
      tempItem.image = null;
    }
    
    console.log(tempItem);
    this.workspaceService.updateItem(tempItem);
  }
}
