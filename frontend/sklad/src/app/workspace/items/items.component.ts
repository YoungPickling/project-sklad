import { AfterViewChecked, ChangeDetectorRef, Component, Directive, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
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
import { ImageCacheDirective } from '../../shared/directives/image.directive';
import { HttpErrorResponse } from '@angular/common/http';
import { FilterSet } from '../workspace.service'

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatIconModule, 
    ClickOutsideDirective,
    ImageCacheDirective,
    FormsModule,
    ContentEditableModel,
    AlertComponent,
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit, OnDestroy, AfterViewChecked {
  company: Company;
  addButtonActive = false;
  removeButtonActive = false;
  filterButtonActive = false;
  filterFirstClicked = false;
  isLoading = false;

  activeFilterSet: FilterSet;
  
  itemsToDelete: Set<number> = new Set();
  
  private focusCellKey: string | null = null;
  customColumns: { [key: string]: {value: string, color: string, width: string}; } = {};
  cellEditMode: { [key: string]: boolean } = {}; // to be edited
  rowImageContextMenu: boolean[];
  rowImageContextMenuOpen = false
  editCellMode: boolean = false;
  tempCellValue: string = '';

  checkList: { [key: number]: boolean } = {};
  
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
  errorResponse: HttpErrorResponse;

  itemParentsToUpdate: number;
  parentsMap: Map<number,number>;

  link = environment.API_SERVER + "/api/rest/v1/secret/image/";

  private companyDetailSub: Subscription;
  private loadingSubscription: Subscription;
  private filterSubscription: Subscription;
  private errorSubscription: Subscription;

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
              color: Utils.integerToHex(+column.color), 
              width: column.width+''
            }
          })
        });
      }
    );

    this.filterSubscription = this.workspaceService.itemFilter.subscribe(
      set => {
        this.activeFilterSet = set;
      }
    );

    this.rowImageContextMenu = new Array<boolean>(this.company?.items?.length).fill(false);

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

    this.resetForm();
  }

  ngOnDestroy() {
    this.workspaceService.errorResponse.next(null);
    this.companyDetailSub.unsubscribe();
    this.loadingSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    if (this.focusCellKey) {
      const inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById(this.focusCellKey);
      if (inputElement !== undefined) {
        this.focusCellKey = null;
        inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); // { behavior: 'smooth', block: 'start' }
        window.getSelection().selectAllChildren(inputElement);
        inputElement.focus();
      }
    }
  }

  get items() {
    return this.company?.items.sort((a, b) => a.id - b.id);
  }

  get suppliers() {
    return this.company?.suppliers.sort((a, b) => a.id - b.id);
  }

  get columns() {
    return this.addItemForm.get('columns') as FormArray;
  }

  get locationPostfix() {
    return 3 + Object.keys(this.customColumns).length;
  }

  get supplierPostfix() {
    return 3 + Object.keys(this.customColumns).length + this.company.locations.length;
  }

  get parentPostfix() {
    return 4 + Object.keys(this.customColumns).length + this.company.locations.length;
  }

  getlocation(item: Item, id: number) {
    let res = 0 ;
    try {
      res = item.quantity[id];
    } catch (error) {
    }
    return res !== 0 ? res : 0; // item.quantity[location.id]
  }

  onClickAddBtn() {
    if(this.removeButtonActive) {
      this.itemsToDelete = new Set();
    }
    this.itemsToDelete = new Set();
    this.addButtonActive = !this.addButtonActive;
    this.removeButtonActive = false;
    this.filterButtonActive = false;
  }

  onClickRemoveBtn() {
    if(this.removeButtonActive) {
      this.itemsToDelete = new Set();
    }
    this.removeButtonActive = !this.removeButtonActive;
    this.addButtonActive = false;
    this.filterButtonActive = false;
    this.resetForm();
  }

  onClickFilterBtn() {
    this.filterButtonActive = !this.filterButtonActive;
    if(this.removeButtonActive) {
      this.itemsToDelete = new Set();
    }
    this.addButtonActive = false;
    this.removeButtonActive = false;
  }

  onClickOutsideFilter() {
    if(!this.filterFirstClicked) {
      this.filterFirstClicked = true;
    } else {
      this.filterButtonActive = false;
      this.filterFirstClicked = false;
    }
  }

  onSubmitAddItem() {
    this.isLoading = true;
    this.addButtonActive = false;
    this.removeButtonActive = false;
    
    let body: Item = this.addItemForm.value;
    body.color = Utils.hexToInteger(body.color + '');
    body.quantity = {};
    body.parents = {};
    body.suppliers = [];
    body.product = false;

    for (let i = 0; i < body.columns?.length; i++) {
      body.columns[i].color = Utils.hexToInteger(body.columns[i].color + '');
    }

    for (let i = 0; i < this.company.locations.length; i++) { 
      body.quantity[this.company.locations[i].id] = 0;
    }

    try {
      this.workspaceService.addItem(body);
    } catch(error) {
      console.error(error)
      this.isLoading = false;
    }
    this.resetForm();
  }
  
  onRemoveRows() {
    this.isLoading = true;
    this.addButtonActive = false;
    this.removeButtonActive = false;
    try {
      this.workspaceService.removeItems(Array.from(this.itemsToDelete.values()));
    } catch(error) {
      console.error(error)
      this.isLoading = false;
    }
  }


  getItemById(id: number) {
    return this.company.items.filter(i => i?.id == id)[0] || {};
  }

  colorByOrder(i: number): string {
    return Utils.colorByOrder(i)
  }

  isNotNumber(number: any) {
    return isNaN(Number(number));
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
      !this.cellEditMode[cellKey] &&
      this.isCellFirstClicked && 
      this.lastCellClickedX === x && 
      this.lastCellClickedY === y
    ) {
      console.log('double clicked!' + cellKey) // HTMLInputElement

      if(y !== this.supplierPostfix) {
        const el: HTMLElement = document.getElementById(cellKey);
        this.tempCellValue = el.textContent || '';
      } else {

        this.company.suppliers.forEach(sup => {
          this.checkList[sup.id] = false;
        });

        this.items[x].suppliers.forEach(sup => {
          this.checkList[sup.id] = true;
        });
      }

      this.cellEditMode[cellKey] = true;
      this.focusCellKey = cellKey + 'f';
      this.cdr.detectChanges();
    } else if (this.focusCellKey !== cellKey + 'f') {
      this.isCellFirstClicked = true;
      if(this.lastCellClickedX !== x || this.lastCellClickedY !== y) {
        this.cellEditMode = {};
        this.checkList = {};
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

    if (y === 0) {
      let tempItem: Item = this.copyItem(x);
      tempItem.code = this.tempCellValue;
      this.updateItem(tempItem);
    } else if (y === 1) {
      let tempItem: Item = this.copyItem(x);
      tempItem.name = this.tempCellValue;
      this.updateItem(tempItem);
    } else if (y === 2) {
      let tempItem: Item = this.copyItem(x);
      tempItem.description = this.tempCellValue;
      this.updateItem(tempItem);
    } else if (y >= 3 && y < this.locationPostfix) {
      let tempItem: Item = this.copyItemColumns(x);
      // The Angluar 'keyvalue' pipeline in a template and Javascript sorts keys differently
      // So make sure the key order is the same everywhere
      const keyStore: string[] = Object.keys(this.customColumns).sort();

      // taking column's key
      const customColumnKey: string = keyStore[y - 3];

      // find existing column value for a copy
      const itemColumnObject: ItemColumn = tempItem.columns.find(
        col => col.name === customColumnKey
      );
      
      if (!itemColumnObject) {
        const newItem = {name: customColumnKey, value: this.tempCellValue};
        tempItem.columns.push(newItem);
      } else {
        tempItem.columns.find(col => col.name === customColumnKey).value = this.tempCellValue;
      }
      this.updateItem(tempItem);
    } else if (y >= this.locationPostfix && y < this.supplierPostfix) {
      try {
        this.workspaceService.updateItemLocations(
          this.company.items[x].id, 
          this.company.locations[y - this.locationPostfix].id, 
          parseInt(this.tempCellValue)
        );
      } catch (error) {
        console.log(error);
        this.isLoading = false;
      }
    } else if (y == this.supplierPostfix) {
      // const keyStore: string[] = Object.keys(this.customColumns).filter(s => this.customColumns[s])
      // console.log(keyStore)
      const keyStore: string[] = Object.keys(this.checkList).filter(s => this.checkList[s])

      let numStore: number[] = [];
      for (let i = 0; i < keyStore.length; i++)
        numStore.push(parseInt(keyStore[i]));

      try {
        this.workspaceService.updateItemSuppliers(this.items[x].id, numStore);
      } catch (error) {
        console.error(error);
        this.isLoading = false;
      }
    }
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
    } else if (event.key === "Enter" && Object.keys(this.checkList).length) {
      let coordinates: string[] = Object.keys(this.cellEditMode).at(0).split('-');
      console.log(parseInt(coordinates[0]) + '' + parseInt(coordinates[1]))
      this.updateCellValue(parseInt(coordinates[0]), parseInt(coordinates[1]))
      this.checkList = {};
    }
  }

  onCloseAlert() {
    this.alertOpen = false;
  }

  onClickRemoveItemImage(index: number) {
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

  onClickSetParents(index: number): void {
    this.confirmField = "";
    this.alertPreset = AlertPresets.addParents;
    this.itemParentsToUpdate = this.items[index].id;
    this.parentsMap = this.items[index].parents;
    this.alertOpen = true;
  }
  /*
  onRemoveItemImage() {
    this.alertOpen = false;
    this.addButtonActive = false;
    this.removeButtonActive = false;
    this.isLoading = true;
    // this.workspaceService.removeItemImage();
  }
  */
  onUpdateParents(parents: any) {
    this.alertOpen = false;
    this.isLoading = true;
    this.addButtonActive = false;
    this.removeButtonActive = false;
    // console.log(this.itemParentsToUpdate);
    try {
      this.workspaceService.updateItemParents(parents, this.itemParentsToUpdate);
    } catch (error) {
      console.error(error)
      this.isLoading = false;
    }
  }

  log(log: any) {
    console.log(log)
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
    this.updateItem(tempItem);
  }

  private updateItem(item: Item) {
    try{
      this.workspaceService.updateItem(item);
    } catch (error) {
      console.error(error);
      this.isLoading = false;
    }
  }

  private copyItemColumns(x): Item {
    // Create a deep copy of the item
    return { 
      ...this.company.items[x],
      columns: this.company.items[x].columns.map(col => ({ ...col }))
    };
  }

  private copyItem(x): Item {
    return {...this.company.items[x]};
  }
}
