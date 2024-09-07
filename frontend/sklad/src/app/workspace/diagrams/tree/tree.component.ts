import { Component, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { Item } from '../../../shared/models/item.model';
import { environment } from '../../../../environments/environment';
import { ImageCacheDirective } from '../../../shared/directives/image.directive';

export interface TreeNode {
  item: Item;
  children?: TreeNode[];
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [ImageCacheDirective],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnChanges {
  link = environment.API_SERVER + "/api/rest/v1/secret/image/";
  @Input() data: TreeNode;
  @Input() selectedItem: number;

  private svg;
  private treeLayout = d3.tree<TreeNode>()
    .nodeSize([180, 280])
    .separation(() => 1);

  ngOnChanges() {
    this.updateTree();
  }

  private updateTree() {
    const nodeWidth = 140;
    const nodeHeight = 150;
    
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
      .attr('transform', d => `translate(${d.y - nodeWidth / 2}, ${d.x - nodeHeight / 2})`);

    // Add div to each node
    nodeEnter
      .append('foreignObject')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .append('xhtml:div')
      .style('border-radius', '25px')
      .style('border', '1px solid #aaa')
      .style('padding', '10px 0px')
      .style('background', '#fff')
      .html(d => `
        <div style="text-align: center;">
          <img src="${this.link + d.data.item.image?.hash}" alt="${d.data.item.name}" style="width:50px;height:50px" />
          <p>${d.data.item.name}</p>
          <button onclick="alert('Clicked: ${d.data.item.name}')">Click Me</button>
        </div>`
      );

    // Handle node updates and removal
    node.exit().remove();
  }
}