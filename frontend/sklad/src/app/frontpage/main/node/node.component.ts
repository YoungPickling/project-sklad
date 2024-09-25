import { Component, Input, OnInit } from '@angular/core';
import { ImageCacheDirective } from '../../../shared/directives/image.directive';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [ImageCacheDirective],
  templateUrl: './node.component.html',
  styleUrl: './node.component.css'
})
export class NodeComponent {
  linkRoot = environment.FRONT_SERVER;
  @Input() link: string;
  @Input() name: string;
  @Input() stock: number;
  @Input() needed: string;

  // ngOnInit() {
  //   console.log("node: " + this.linkRoot + this.link)
  // }
}
