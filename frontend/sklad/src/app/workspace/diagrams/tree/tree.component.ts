import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Item } from '../../../shared/models/item.model';
import { environment } from '../../../../environments/environment';
import { ImageService } from '../../../shared/image.service';
import { CommonModule } from '@angular/common';
import { DiagramService } from '../diagram.service';
import { Subscription } from 'rxjs';

export interface TreeNode {
  item: Item;
  amount: number;
  children?: TreeNode[];
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {
  link = environment.API_SERVER + "/api/rest/v1/secret/image/";
  @Input() data: TreeNode;
  @Input() selectedItem: number;
  @Input() selectedLocation: number;
  // @Input() selection: number;
  // @Output() selectionChange: EventEmitter<number> = new EventEmitter<number>();
  selection: number | null;
  private selectionSub: Subscription;
  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _cachedHashes: Map<number, string> = new Map();

  private svg;
  private treeLayout = d3.tree<TreeNode>()
    .nodeSize([100, 250])
    .separation(() => 1);

  constructor(
    private imageService: ImageService,
    private diagramService: DiagramService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.selectionSub = this.diagramService.editItem.subscribe(
      num => {
        this.selection = num;
        this.updateTree();
      }
    )
  }

  ngOnChanges() {
    Promise.resolve().then(() => this.loading.emit(true))

    this.preloadImages(this.data).then(() => {
      Promise.resolve().then(() => this.loading.emit(false))
      this.updateTree();
    });
  }

  ngOnDestroy(): void {
    this.selectionSub.unsubscribe();
  }

  // get selection() {
  //   return this.diagramService.editItem.getValue()
  // }

  private preloadImages(node: TreeNode): Promise<void> {

    const imageRequests: Promise<void>[] = [];
    const fallbackImage = "https://via.placeholder.com/50";
    
    const traverse = (node: TreeNode) => {
      if (node.item.image?.hash) {
        const imageUrl = this.link + node.item.image.hash;

        // Push each image request as a Promise
        const imageRequest = new Promise<void>((resolve) => {
          this.imageService.getImage(imageUrl).subscribe({
            next: (res: string) => {
              this._cachedHashes.set(node.item.id, res);
              resolve();
            },
            error: (err: any) => {
              this._cachedHashes.set(node.item.id, fallbackImage);
              resolve();
            }
          });
        });
        imageRequests.push(imageRequest);
      } else {
        this._cachedHashes.set(node.item.id, fallbackImage);
      }

      // Recursively check children
      if (node.children) {
        node.children.forEach(child => traverse(child));
      }
    };

    // Start traversal from the root node
    traverse(node);

    // Return a promise that resolves when all image requests are done
    return Promise.all(imageRequests).then(() => {});
  }

  changeSelection(value: number) {
    // this.selection = value;
    // this.selectionChange.emit(this.selection);
    this.diagramService.editItem.next(value)
  }

  // onOutsideClick() {
  //   if (this.selection !== null) {
  //     this.changeSelection(null);
  //   }
  // }

  onContainerClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.w-block')) {
      this.changeSelection(null);
    }
  }

  private updateTree() {
    const nodeWidth = 140;
    const nodeHeight = 100;
    
    // Clear the previous SVG before re-creating the tree
    d3.select('#tree-container').select('svg').remove();

    const root = d3.hierarchy<TreeNode>(this.data);
    this.treeLayout(root);

    const minX = d3.min(root.descendants(), d => d.x) || 0;
    const maxX = d3.max(root.descendants(), d => d.x) || 0;
    const minY = d3.min(root.descendants(), d => d.y) || 0;
    const maxY = d3.max(root.descendants(), d => d.y) || 0;

    const width = maxY - minY + nodeWidth; //  + 200
    const height = maxX - minX + nodeHeight + 50;

    // Create the SVG container for the tree
    this.svg = d3
      .select('#tree-container')
      .append('svg')
      .attr('width', Math.max(100, width))
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${nodeWidth / 2 - minY}, ${nodeHeight / 2 - minX})`);

    // Bind data and add links
    const link = this.svg
      .selectAll('.link')
      .data(root.links());

    // Handle link enter, update, and exit transitions
    link.join(
      enter => enter.append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
          .x(d => d.y)
          .y(d => d.x))
        .attr('fill', 'none')
        .attr('stroke', '#111')
        .attr('stroke-width', 1.7),
      update => update.attr('d', d3.linkHorizontal<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
        .x(d => d.y)
        .y(d => d.x)),
      exit => exit.remove()
    );

    // Bind data and add nodes
    const node = this.svg
      .selectAll('.node')
      .data(root.descendants());

    // Handle node enter, update, and exit transitions
    const nodeEnter = node.enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y - nodeWidth / 2 }, ${d.x - nodeHeight / 2})`);

    // Add div to each node
    nodeEnter
      .append('foreignObject')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .append('xhtml:div')
      .classed('w-block-selected', d => this.selection === d.data.item.id)
      .classed('w-block-wrap', d => this.selection !== d.data.item.id)
      .html(d => `
        <div class="w-block">
          <div 
          class="w-quantity"
          style="background-color:
          ${d.data.item.quantity[this.selectedLocation] !== 0 ? 
            d.data.item.quantity[this.selectedLocation] >= d.data.amount ? 
            '#3e3': 'revert-layer' : '#f33'}"
          >${d.data.item.quantity[this.selectedLocation]}</div>
          ${+d.data.item.id !== this.data.item.id ? 
            `<div class="w-needed">x${d.data.amount}</div>` : ''}
          <img
            src="${this._cachedHashes.get(d.data.item.id)}"
            alt="${d.data.item.name}"
            style="width:50px;height:50px"/>
          <p style="margin:0.2rem 0">${d.data.item.name}</p>
        </div>`
      );

    nodeEnter.each((d, i, nodes) => {
      const button = d3.select(nodes[i]).select('.w-block').node();
      this.renderer.listen(button, 'click', (event) => {
        event.stopPropagation(); // for OnClickOutside directive to work

        const tempId = d.data.item.id
        this.changeSelection(tempId)

        d3.selectAll("foreignObject").selectChild()
          .on("click", (event) => d3.select(event.currentTarget)
            .classed('w-block-selected', 
              (d: d3.HierarchyPointNode<TreeNode>) => tempId === d.data.item.id)
          );
        }
      );
    });

    // Handle node updates and removal
    node.exit().remove();
  }
}