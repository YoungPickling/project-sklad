import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ClickOutsideDirective } from '../shared/directives/clickOutside.directive';

@Component({
  selector: 'app-frontpage',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    HeaderComponent,
    // ClickOutsideDirective
  ],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.css',
  encapsulation: ViewEncapsulation.None
})
export class FrontpageComponent {
  private year: number = (new Date()).getFullYear();
  copyright: string = '© 2022-' + this.year + ' Maksim Pavlenko';
}