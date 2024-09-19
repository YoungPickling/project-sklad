import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AlertComponent } from '../../shared/alert/alert.component';
import { ImageCacheDirective } from '../../shared/directives/image.directive';
import { Company } from '../../shared/models/company.model';
import { WorkspaceService } from '../workspace.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TreeComponent, TreeNode } from './tree/tree.component';
import { Item } from '../../shared/models/item.model';
import { FormsModule } from '@angular/forms';
import { Location } from '../../shared/models/location.model';
import { ClickOutsideDirective } from '../../shared/directives/clickOutside.directive';

@Component({
  selector: 'app-diagrams',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatIconModule,
    ImageCacheDirective,
    AlertComponent,
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

  editItem: number;
  modifyAmount: number = 0;
  assembleAmount: number = 0;

  selectedItem: number;
  selectedLocation: number;

  isPopupVisible: boolean = false;

  treeData: TreeNode = null;
  treeResponse: number = 0;

  link = environment.API_SERVER + "/api/rest/v1/secret/image/";

  private companyDetailSub: Subscription;
  private loadingSubscription: Subscription;
  // private popUpSub: Subscription;
  private errorSubscription: Subscription;

  constructor(
    private workspaceService: WorkspaceService,
  ) {}

  ngOnInit(): void {
    this.companyDetailSub = this.workspaceService.companyDetails.subscribe(
      company => {
        this.company = company;
        // check if any item has inheritance
        let tempNoTies = true;
        // const empty: {} = {};

        this.noLocations = company.locations?.length === 0

        if(this.noLocations) {
          return;
        }

        for (let i = 0; i < company?.items?.length; i++) {
          const parents = company.items[i].parents;
          if(Object.keys(parents).length > 0) {
            tempNoTies = false;
            break;
          }
        }
        this.noTies = tempNoTies;

        if(this.noTies) {
          return;
        }

        if(company.locations[0]?.id) {
          this.selectedLocation = company.locations[0].id
        }
      }
    );

    // this.selectedItem

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
  
  ngOnDestroy(): void {
    this.workspaceService.errorResponse.next(null);
    this.companyDetailSub.unsubscribe();
    this.loadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  onItemChange(itemId: number): void {
    this.safeRemoveSelection()
    const selectedItem = this.findItemById(itemId);
    
    if(selectedItem) {
      // Build the tree starting from the selected item
      const tree = this.buildTreeNode(selectedItem, 0);
      
      // Update the treeData with the constructed tree
      this.treeData = tree;
      // console.log('Tree data updated:', this.treeData);
    }
  }

  onLocationChange(LocationId?: number): void {
    this.safeRemoveSelection()
  }

  onOutsideClick() {
    this.safeRemoveSelection()
  }

  private safeRemoveSelection() {
    if(this.editItem) {
      this.editItem = null;
    }
  }

  buildTreeNode(item: Item, amount = 0): TreeNode {
    const treeNode: TreeNode = {
      item: item,
      amount: amount,
      children: []
    };
  
    // If the item has parents, recursively add them as children nodes
    if (item.parents && Object.keys(item.parents).length > 0) {
      const itemIds: string[] = [...Object.keys(item.parents)]

      itemIds.forEach((parentId) => {
        const parentItem = this.findItemById(+parentId);
        if (parentItem) {
          treeNode.children.push(this.buildTreeNode(parentItem, item.parents[parentId]));
        }
      });
    }
  
    return treeNode;
  }

  togglePopup() {
    this.isPopupVisible = !this.isPopupVisible;
  }

  findItemById(id: number): Item | undefined {
    return this.company.items?.find(item => item.id == id);
  }

  findLocationById(id: number): Location | undefined {
    return this.company.locations?.find(loc => loc.id == id);
  }

  get items() {
    return this.company.items?.sort((a, b) => a.id - b.id);
  }

  get locations() {
    return this.company.locations?.sort((a, b) => a.id - b.id);
  }

  canSubmit(): boolean {
    return !(this.modifyAmount !== 0 || this.assembleAmount !== 0);
  }

  // maxAssemble() {
  //   // TODO
  //   if(this.editItem) {
  //     if(this.treeData.item.id !== this.editItem) {
  //       this.treeData.children.forEach(x => {
  //         x.item.id === this.editItem;
  //       });
  //     }
  //   }
  // }

  // maxAssemble(): number {
  //   // Check if there's an item selected to be edited
  //   if (this.editItem) {
  //     const targetNode = this.findNodeById(this.treeData, this.editItem);
      
  //     if (targetNode) {
  //       let maxAssemblies = Infinity;
  
  //       // Iterate over the child items and calculate the limiting factor
  //       targetNode.children.forEach(childNode => {
  //         const requiredAmount = childNode.amount; // The amount required for one assembly
  //         const availableAmount = this.getAvailableAmount(childNode.item.id); // Assume you have this function that gets available stock
  
  //         // Calculate how many times we can assemble this item based on this child
  //         const possibleAssemblies = Math.floor(availableAmount / requiredAmount);
  
  //         // Find the minimum assemblies we can perform (i.e., the limiting factor)
  //         maxAssemblies = Math.min(maxAssemblies, possibleAssemblies);
  //       });
  
  //       return maxAssemblies; // This will be the maximum number of assemblies
  //     }
  //   }
  
  //   return 0; // Default return value if no assemblies are possible
  // }

  maxAssemble() {
    if (!this.editItem || !this.treeData) {
      return 0; // No item selected or no tree data available
    }
  
    const currentNode = this.findNodeById(this.treeData, this.editItem);
  
    if (!currentNode || !currentNode.children?.length) {
      return 0; // No children found for the item
    }
  
    // Initialize a large number to compare with
    let maxAssemblies = Number.MAX_VALUE;
  
    // Iterate over each child component (e.g., bolts, plates)
    currentNode.children.forEach(child => {
      const requiredAmount = child.amount; // Amount needed to assemble one parent item
      const availableAmount: number = child.item.quantity[this.selectedLocation] // Get available amount from stock
      console.log("requiredAmount: " + requiredAmount, "availableAmount: " + availableAmount);
      // Calculate how many times we can assemble with this child component
      const assembliesWithThisChild = Math.floor(availableAmount / requiredAmount);
  
      // The limiting factor will be the minimum assemblies we can make
      maxAssemblies = Math.min(maxAssemblies, assembliesWithThisChild);
    });
    
    return maxAssemblies;
  }
  
  // private findNodeById(node: TreeNode, num: number): TreeNode {
  //   if(node.item.id === num) {
  //     return node
  //   }
  //   node.children.forEach(x => {
  //     return this.findNodeById(node, num);
  //   });
  // }

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

  onSubmitChanges() {
    
  }
}
