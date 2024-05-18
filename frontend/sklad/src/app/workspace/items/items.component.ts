import { Component, OnInit } from '@angular/core';
import { Company } from '../../shared/models/company.model';
import { WorkspaceService } from '../workspace.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Item } from '../../shared/models/item.model';
import Utils from '../../shared/utils.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit {
  company: Company;
  customColumns: { [key:string]: {value: string, color: string, width: string}; } = {};
  addButtonActive = false;
  isLoading = false;

  addItemForm: FormGroup;

  constructor(
    private workspaceService: WorkspaceService
  ) {}

  private companyDetailSub: Subscription;

  ngOnInit() {
    this.companyDetailSub = this.workspaceService.companyDetails.subscribe(
      company => {
        this.company = company;

        company?.items?.forEach(item => {
          item?.columns?.forEach(column => {
            this.customColumns[column.name] = {
              value: column.value, 
              color: Utils.integerToHex(column.color), 
              width: column.width+''
            }
          })
        });
      }
    );

    this.resetForm()
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
    this.isLoading = true;
    
    let body: Item = this.addItemForm.value;
    body.color = Utils.hexToInteger(body.color + '');

    for (let i = 0; i < body.columns?.length; i++) {
      body.columns[i].color = Utils.hexToInteger(body.columns[i].color + '');
    }

    this.workspaceService.addItem(body, this.company.id);
    // this.addItemForm.reset();
    this.resetForm()
    this.isLoading = false;
  }

  get columns() {
    return this.addItemForm.get('columns') as FormArray;
  }

  addColumn() {
    const columnGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
      color: new FormControl('#ffffff'),
      width: new FormControl(''),
    });

    this.columns.push(columnGroup);
  }

  logger(something: any) {
    console.log(something);
  }

  onFontColor(hex: string) {
    return Utils.getFontColor(hex);
  }

  removeColumn(index: number) {
    this.columns.removeAt(index);
  }

  resetForm() {
    this.addItemForm = new FormGroup({
      code: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      color: new FormControl('#ffffff'),
      description: new FormControl(null),
      columns: new FormArray([])
    });
  }

  getItemColumnValue(item: Item, columnName: string): string {
    const column = item.columns.find(col => col.name === columnName);
    return column ? column.value : '';
  }
}
