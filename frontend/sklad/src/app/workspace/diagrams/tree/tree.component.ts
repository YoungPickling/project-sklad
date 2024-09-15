import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Item } from '../../../shared/models/item.model';
import { environment } from '../../../../environments/environment';
import { ImageService } from '../../../shared/image.service';
// import { ImageCacheDirective } from '../../../shared/directives/image.directive';

export interface TreeNode {
  item: Item;
  children?: TreeNode[];
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TreeComponent implements OnChanges {
  link = environment.API_SERVER + "/api/rest/v1/secret/image/";
  @Input() data: TreeNode;
  @Input() selectedItem: number;
  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _cachedHashes: Map<number, string> = new Map();

  private svg;
  private treeLayout = d3.tree<TreeNode>()
    .nodeSize([100, 250])
    .separation(() => 1);

  constructor(
    private imageService: ImageService,
    private cd: ChangeDetectorRef,
    // private ngZone: NgZone
  ) {}

  ngOnChanges() {
    Promise.resolve().then(() => this.loading.emit(true))
    
      this.preloadImages(this.data).then(() => {
        Promise.resolve().then(() => this.loading.emit(false))
        this.updateTree();
      });
    // });
  }

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

    const width = maxY - minY + nodeWidth + 200;
    const height = maxX - minX + nodeHeight + 200;

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
      .style('border-radius', '25px')
      .style('border', '1px solid #aaa')
      .style('padding', '0.5rem 0px')
      .style('background', '#fff')
      .html(d => `
        <div style="text-align: center; position: relative;">
          <div class="w-quantity">${this.getTotalQuantity(d.data.item.quantity)}</div>
          <img src="${this._cachedHashes.get(d.data.item.id)}" alt="${d.data.item.name}" style="width:50px;height:50px" />
          <p style="margin:0.2rem 0">${d.data.item.name}</p>
        </div>`
      );
      // <button onclick="alert('Clicked: ${d.data.item.name}')">Click Me</button>

    // Handle node updates and removal
    node.exit().remove();
  }

  private getTotalQuantity(keys: Map<number, number>) {
    console.log(keys)
    let res = 0;
    Object.keys(keys).forEach(k => res += keys[k])
    return res
  }
}