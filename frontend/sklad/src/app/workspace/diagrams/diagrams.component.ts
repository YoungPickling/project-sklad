import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
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
  ],
  templateUrl: './diagrams.component.html',
  styleUrl: './diagrams.component.css'
})
export class DiagramsComponent implements OnInit, OnDestroy, AfterViewInit {
  company: Company;
  isLoading = false;
  errorResponse: HttpErrorResponse;

  noTies: boolean;
  selectedItem: number = -1;
  treeData: TreeNode = null;

  link = environment.API_SERVER + "/api/rest/v1/secret/image/";

  private companyDetailSub: Subscription;
  private loadingSubscription: Subscription;
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
        const empty: {} = {};

        for (let i = 0; i < company?.items?.length; i++) {
          const parents = company.items[i].parents;
          if(Object.keys(parents).length > 0) {
            tempNoTies = false;
            break;
          }
        }
        this.noTies = tempNoTies;
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

    // this.createBarChart();
  }

  ngAfterViewInit(): void {
    
  }

  // onItemChange(itemId: number) {
  //   console.log('Selected Item ID:', itemId);
  //   this.selectedItem = itemId;
  //   this.updateTreeData(itemId);
  // }

  onItemChange(itemId: number): void {
    console.log('Selected Item ID:', itemId);
    const selectedItem = this.findItemById(itemId);
    console.log(selectedItem)
    
    if(selectedItem) {
      // Build the tree starting from the selected item
      const tree = this.buildTreeNode(selectedItem);
      
      // Update the treeData with the constructed tree
      this.treeData = tree;
      console.log('Tree data updated:', this.treeData);
    } else {
      console.error('Item not found');
    }
  }

  buildTreeNode(item: Item): TreeNode {
    console.log('inside item ', item.name, !!item.parents, item.parents.size > 0, Object.keys(item.parents).length);
    const treeNode: TreeNode = {
      item: item,  // Set the current item as the node's name (or identifier)
      children: []
    };
  
    // If the item has parents, recursively add them as children nodes
    if (item.parents && Object.keys(item.parents).length > 0) {
      const itemIds: string[] = [...Object.keys(item.parents)]

      itemIds.forEach((parentId) => {
        const parentItem = this.findItemById(+parentId);
        if (parentItem) {
          treeNode.children.push(this.buildTreeNode(parentItem));
        }
      });
    }
  
    return treeNode;
  }

  findItemById(id: number): Item | undefined {
    return this.company.items?.find(item => item.id == id);
    // return this.company.items.filter(i => i?.id == id)[0];
  }

  get items() {
    return this.company.items?.sort((a, b) => a.id - b.id);
  }

  ngOnDestroy(): void {
    this.workspaceService.errorResponse.next(null);
    this.companyDetailSub.unsubscribe();
    this.loadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }


}
