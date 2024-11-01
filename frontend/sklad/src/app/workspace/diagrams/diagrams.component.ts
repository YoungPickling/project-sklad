import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ImageCacheDirective } from '../../shared/directives/image.directive';
import { Company } from '../../shared/models/company.model';
import { AssembleDTO, WorkspaceService } from '../workspace.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TreeComponent, TreeNode } from './tree/tree.component';
import { Item } from '../../shared/models/item.model';
import { FormsModule } from '@angular/forms';
import { Location } from '../../shared/models/location.model';
import { ClickOutsideDirective } from '../../shared/directives/clickOutside.directive';
import { DiagramService, EMPTY_PARAMS, NodeSelectParams } from './diagram.service';

@Component({
  selector: 'app-diagrams',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatIconModule,
    ImageCacheDirective,
    TreeComponent,
    ClickOutsideDirective
  ],
  templateUrl: './diagrams.component.html',
  styleUrl: './diagrams.component.css'
})
export class DiagramsComponent implements OnInit, OnDestroy {
  company: Company;
  isLoading = false;
  errorResponse: HttpErrorResponse;

  treeLoading: boolean;

  noTies: boolean;
  noLocations: boolean;

  editItem: number = null;
  editItemName: string;
  private editItemSub: Subscription;
  selectParams: NodeSelectParams;
  private selectParamsSub: Subscription;
  locationSet: number[];

  selectedItem: number;
  selectedLocation: number;
  private diagramSub: Subscription;

  isPopupVisible: boolean = false;

  treeData: TreeNode = null;
  treeResponse: number = 0;

  link = environment.API_SERVER + "/api/rest/v1/secret/image/";

  private companyDetailSub: Subscription;
  private loadingSubscription: Subscription;
  private errorSubscription: Subscription;

  constructor(
    private workspaceService: WorkspaceService,
    private dService: DiagramService
  ) {}

  ngOnInit(): void {
    this.companyDetailSub = this.workspaceService.companyDetails.subscribe(
      company => {
        this.company = company;

        // check if any item has inheritance
        let tempNoTies = true;

        this.noLocations = !company?.locations?.length;

        if(this.noLocations) {
          return;
        }

        const locations: number[] = [];
        for (let i = 0; i < company?.locations?.length; i++) {
          locations.push(company?.locations[i].id);
        }
        this.locationSet = locations;

        for (let i = 0; i < company?.items?.length; i++) {
          const parents = company?.items[i]?.parents;
          if(Object.keys(parents).length > 0) {
            tempNoTies = false;
            break;
          }
        }
        this.noTies = tempNoTies;

        if(this.noTies) {
          return;
        }

        if(!this.selectedLocation && company?.locations[0]?.id) {
          this.selectedLocation = company?.locations[0]?.id;
        }
      }
    );

    this.diagramSub = this.dService.diagram.subscribe(
      (d: {item: number, location: number}) => {
        if(d) {
          this.selectedItem = d.item;
          this.selectedLocation = d.location;
        }
      }
    );

    this.selectParamsSub = this.dService.params.subscribe( p => this.selectParams = p);

    this.editItemSub = this.dService.editItem.subscribe(
      num => {
        this.editItem = num;
        const item = this.findItemById(num);
        this.editItemName = item?.name || '';

        const parentIds: number[] = [];
        if (item?.parents) {
          for (let [key, value] of Object.entries(item?.parents)) {
            parentIds.push(+key);
          }
        }

        const min = item?.quantity[this.selectedLocation] * -1

        this.dService.params.next({
          modifyAmount: 0,
          minModifyAmount: min, 
          assembleAmount: 0,
          maxAssembleAmount: this.maxAssemble(),
          minAssembleAmount: min,
          itemParents: parentIds
        });
      }
    );

    this.loadingSubscription = this.workspaceService.isLoading.subscribe(
      state => {
        this.isLoading = state;
        if(!state && this.selectedItem !== null) {
          this.onItemChange(this.selectedItem);
        }
      }
    );

    this.errorSubscription = this.workspaceService.errorResponse.subscribe(
      error => {
        this.errorResponse = error;
      }
    );
  }
  
  ngOnDestroy(): void {
    this.workspaceService.errorResponse.next(null);

    this.dService.editItem.next(null);
    this.dService.params.next(EMPTY_PARAMS);

    this.editItemSub.unsubscribe();
    this.selectParamsSub.unsubscribe();
    this.diagramSub.unsubscribe();
    
    this.companyDetailSub.unsubscribe();
    this.loadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  onItemChange(itemId: number): void {
    this.safeRemoveSelection();
    const selectedItem = this.findItemById(itemId);
    
    if(selectedItem) {
      const tree = this.buildTreeNode(selectedItem, 0);
      this.dService.diagram.next({item: this.selectedItem, location: this.selectedLocation});
      this.treeData = tree;
    }
  }

  onLocationChange(LocationId?: number): void {
    this.dService.diagram.next({item: this.selectedItem, location: this.selectedLocation});
    this.safeRemoveSelection();
  }

  onOutsideClick() {
    this.safeRemoveSelection();
  }

  private safeRemoveSelection() {
    if(this.editItem) {
      this.dService.editItem.next(null);
    }
  }

  buildTreeNode(item: Item, amount = 0): TreeNode {
    const tempItem = {...item}

    const treeNode: TreeNode = {
      item: tempItem,
      amount: amount,
      children: []
    };

    if (item.parents && Object.keys(item.parents).length > 0) {
      const itemIds: string[] = [...Object.keys(item.parents)];

      itemIds.forEach((parentId) => {
        const parentItem = this.findItemById(+parentId);
        if (parentItem) {
          treeNode.children.push(this.buildTreeNode(parentItem, item.parents[parentId]));
        }
      });
    }
  
    return treeNode;
  }

  findItemById(id: number): Item | undefined {
    return this.company?.items?.find(item => item.id == id);
  }

  findLocationById(id: number): Location | undefined {
    return this.company?.locations?.find(loc => loc.id == id);
  }

  get items() {
    return this.company?.items?.sort((a, b) => a.id - b.id);
  }

  get locations() {
    return this.company?.locations?.sort((a, b) => a.id - b.id);
  }

  canSubmit(): boolean {
    return !(this.selectParams.modifyAmount !== 0 || this.selectParams.assembleAmount !== 0);
  }

  private maxAssemble() {
    if (!this.editItem || !this.treeData) {
      return 0; // No item selected or no tree data available
    }
  
    const currentNode = this.findNodeById(this.treeData, this.editItem);
  
    if (!currentNode || !currentNode.children?.length) {
      return 0; // No children found for the item
    }
  
    let maxAssemblies = Number.MAX_VALUE;
  
    currentNode.children.forEach(child => {
      const requiredAmount = child.amount;
      const availableAmount: number = child.item.quantity[this.selectedLocation];
      const assembliesWithThisChild = Math.floor(availableAmount / requiredAmount);
  
      maxAssemblies = Math.min(maxAssemblies, assembliesWithThisChild);
    });
    
    return maxAssemblies;
  }

  private findNodeById(node: TreeNode, num: number): TreeNode | undefined {
    if (node.item.id === num) {
      return node;
    }
    for (const child of node.children) {
      const result = this.findNodeById(child, num);
      if (result) {
        return result;
      }
    }
    return undefined;
  }

  refreshTree() {
    this.dService.params.next(this.selectParams);
  }

  onSubmitChanges() {
    this.isLoading = true;

    const itemId = this.editItem;
    const body: AssembleDTO = {
      add: this.selectParams.modifyAmount,
      build: this.selectParams.assembleAmount ,
      locationId: this.selectedLocation
    };

    this.dService.editItem.next(null);
    this.dService.params.next(EMPTY_PARAMS);

    try {
      this.workspaceService.assembleItem(body, itemId);
    } catch(error) {
      console.error(error);
      this.isLoading = false;
    }
  }
}
