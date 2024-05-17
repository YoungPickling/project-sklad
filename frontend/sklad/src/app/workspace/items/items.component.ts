import { Component, OnInit } from '@angular/core';
import { Company } from '../../shared/models/company.model';
import { WorkspaceService } from '../workspace.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormControl, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ItemColumn } from '../../shared/models/item-column.model';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit {
  company: Company;
  addButtonActive = false;

  addItemForm: FormGroup;

  constructor(
    private workspaceService: WorkspaceService
  ) {}

  private companyDetailSub: Subscription;

  ngOnInit() {
    this.companyDetailSub = this.workspaceService.companyDetails.subscribe(
      company => {
        this.company = company;
      }
    );

    this.addItemForm = new FormGroup({
      code: new FormControl(null),
      name: new FormControl(null),
      color: new FormControl(16777215),
      description: new FormControl(null),
      columns: new FormArray([])
      // columns: new FormGroup({
      //   name: new FormArray([]),
      //   value: new FormArray([]),
      //   color: new FormArray(null),
      //   width: new FormArray(null),
      // }),
    });
  }

  ngOnDestroy() {
    if(this.companyDetailSub) {
      this.companyDetailSub.unsubscribe()
    }
  }

  onClickAddBtn() {
    this.addButtonActive = !this.addButtonActive;
  }

  onSubmitAddItem() {
    console.log(this.addItemForm.value);
  }

  get columns() {
    return this.addItemForm.get('columns') as FormArray;
  }

  addColumn() {
    const columnGroup = new FormGroup({
      name: new FormControl(''),
      value: new FormControl(''),
      color: new FormControl(''),
      width: new FormControl(''),
    });

    this.columns.push(columnGroup);
  }
}
