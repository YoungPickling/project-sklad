import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';

@Component({
  selector: 'app-frontpage',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
  ],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.css'
})
export class FrontpageComponent {
  
}

export const frontpageRoutes: Routes = [
  { 
    path: '', 
    component: FrontpageComponent,
    children: [
      { path: '', component: MainComponent, pathMatch: 'full' },
    ]
  },
];