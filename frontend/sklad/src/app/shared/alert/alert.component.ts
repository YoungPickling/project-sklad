import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Company } from '../models/company.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() preset: string;
  @Input() message: string;
  @Input() title: string;
  @Output() close = new EventEmitter<void>();
  @Output() addCompany = new EventEmitter<{name: string, description: string}>();

  private lastMessage: string;
  private formGroup: FormGroup;

  ngOnInit() {
    this.lastMessage = this.message;

    if(this.preset === 'addCompany') {
      this.formGroup = new FormGroup({
        // 'companyData': new FormGroup({
          'name': new FormControl(null, [Validators.required]),
          'description': new FormControl(null, [Validators.required])
        // })
      });
      // this.signupForm.valueChanges.subscribe(
      //   (value) => console.log(value)
      // );
      // this.formGroup.statusChanges.subscribe(
        // (status) => console.log(status)
      // ); 
    }
  }

  inputValidation(s: string) {
    return !this.formGroup.get(s).valid && this.formGroup.get(s).touched;
  }

  checkInvalid(s: string, fieldName: string) { // nameIsForbidden
    return this.formGroup.get(fieldName).errors[s];
  }

  onSubmit() {
    this.isLoading = true;
    this.addCompany.emit(this.formGroup.value);
  }

  onCloseError() {
    this.lastMessage = this.message;
  }

  onClose() {
    this.close.emit();
  }
}
