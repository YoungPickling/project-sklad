import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export enum AlertPresets {
  addCompany,
  editCompany,
  addImage
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() isLoading: boolean;
  // @Input() preset: string;
  @Input() preset: AlertPresets;
  @Input() message: string;
  @Input() title: string;
  @Input() forEdit: {id?: number, name: string, description: string};
  @Output() close = new EventEmitter<void>();
  @Output() addCompany = new EventEmitter<{name: string, description: string}>();
  @Output() editCompany = new EventEmitter<{name: string, description: string}>();

  private lastMessage: string;
  private formGroup: FormGroup;

  ngOnInit() {
    this.lastMessage = this.message;

    // if(this.preset === 'addCompany' || this.preset === 'editCompany') {
    if(this.preset === AlertPresets.addCompany || this.preset === AlertPresets.editCompany) {
      this.formGroup = new FormGroup({
        // 'companyData': new FormGroup({
          'name': new FormControl(null, [Validators.required]),
          'description': new FormControl(null, [Validators.required])
        // })
      });
      // if (this.preset === 'editCompany' && this.forEdit) {
      if (this.preset === AlertPresets.editCompany && this.forEdit) {
        this.formGroup.patchValue(this.forEdit);
      }
    }
  }

  inputValidation(s: string) {
    return !this.formGroup.get(s).valid && this.formGroup.get(s).touched;
  }

  checkInvalid(s: string, fieldName: string) { // nameIsForbidden
    return this.formGroup.get(fieldName).errors[s];
  }

  onSubmit() {
    // if(this.preset === 'addCompany') {
    if(this.preset === AlertPresets.addCompany) {
      this.isLoading = true;
      this.addCompany.emit(this.formGroup.value);
    // } else if(this.preset === 'editCompany') {
    } else if(this.preset === AlertPresets.editCompany) {
      this.isLoading = true;
      this.editCompany.emit(this.formGroup.value);
    }
  }

  onCloseError() {
    this.lastMessage = this.message;
  }

  onClose() {
    this.close.emit();
  }

  isAddCompay() {
    return this.preset === AlertPresets.addCompany;
  }

  isEditCompay() {
    return this.preset === AlertPresets.editCompany;
  }

  isAddImage() {
    return this.preset === AlertPresets.addImage;
  }
}
