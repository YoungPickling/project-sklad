import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Image } from '../models/image.model';
import { environment } from '../../../environments/environment';
import { ImageCacheDirective } from '../directives/image.directive';

export enum AlertPresets {
  addCompany,
  editCompany,
  addGalleryImage,
  showGalleryImage,
  removeItemImage,
  updateItemImage,
  addSupplier
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ImageCacheDirective],
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
  @Input() tempId: number;
  @Input() forEdit: {id?: number, name: string, description: string};
  @Output() close = new EventEmitter<void>();
  @Output() addCompany = new EventEmitter<{name: string, description: string}>();
  @Output() editCompany = new EventEmitter<{name: string, description: string}>();
  @Output() addGalleryImage = new EventEmitter<{ image: File }>();
  @Output() deleteImage = new EventEmitter<void>();
  @Output() confirmDeleteImage = new EventEmitter<void>();
  @Output() removeItemImage = new EventEmitter<number>();
  @Output() setItemImage = new EventEmitter<number>();

  @Input() imageData: Image;
  @Input() imageList: Image[];
  checkedImageId = -1;
  
  @Input() confirmWindow: boolean = false;
  @Input() confirmMessage: string;
  confirmField = '';
  @Output() confirmWindowClose = new EventEmitter<void>();

  link = environment.API_SERVER + "/api/rest/v1/secret/";

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
    } else if (this.preset === AlertPresets.addGalleryImage) {
      this.formGroup = new FormGroup({
        'image': new FormControl(null, [Validators.required])
      });
    }
  }

  inputValidation(s: string) {
    return !this.formGroup.get(s).valid && this.formGroup.get(s).touched;
  }

  checkInvalid(s: string, fieldName: string) {
    return this.formGroup.get(fieldName).errors[s];
  }

  onSubmit() {
    // if(this.preset === AlertPresets.addCompany) {
    //   this.isLoading = true;
    //   this.addCompany.emit(this.formGroup.value);
    // // } else if(this.preset === 'editCompany') {
    // } else if(this.preset === AlertPresets.editCompany) {
    //   this.isLoading = true;
    //   this.editCompany.emit(this.formGroup.value);
    // } else if(this.preset === AlertPresets.addGalleryImage) {
    //   this.isLoading = true;
    //   const imageFile = this.formGroup.get('image').value;
    //   this.addGalleryImage.emit({ image: imageFile });
    // }

    switch(this.preset) { 
      case AlertPresets.addCompany: { 
        this.isLoading = true;
        this.addCompany.emit(this.formGroup.value); 
        break; 
      } 
      case AlertPresets.editCompany: { 
        this.isLoading = true;
        this.editCompany.emit(this.formGroup.value);
        break; 
      } 
      case AlertPresets.addGalleryImage: { 
        this.isLoading = true;
        const imageFile = this.formGroup.get('image').value;
        this.addGalleryImage.emit({ image: imageFile }); 
        break; 
      } 
   } 
  }

  onCloseError() {
    this.lastMessage = this.message;
  }

  onClose() {
    this.close.emit();
  }

  onCloseConfirmation() {
    this.close.emit();
  }

  isAddCompay() {
    return this.preset === AlertPresets.addCompany;
  }

  isEditCompay() {
    return this.preset === AlertPresets.editCompany;
  }

  isAddImage() {
    return this.preset === AlertPresets.addGalleryImage;
  }

  isShowImage() {
    return this.preset === AlertPresets.showGalleryImage;
  }
  
  isRemoveItemImage() {
    return this.preset === AlertPresets.removeItemImage;
  }

  isUpdateItemImage() {
    return this.preset === AlertPresets.updateItemImage;
  }

  isAddSupplier() {
    return this.preset === AlertPresets.addSupplier;
  }

  uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.formGroup.patchValue({ image: file });
      this.formGroup.get('image').updateValueAndValidity();
    }
  }

  onDeleteImage() {
    this.deleteImage.emit()
  }
  
  onConfirmDeleteImage() {
    this.confirmDeleteImage.emit()
  }

  onRemoveItemImage() {
    this.isLoading = true;
    this.removeItemImage.emit();
  }

  onFilter(): Image[] {
    return this.imageList.filter(image => image.name.toLowerCase().indexOf(this.confirmField.trim().toLowerCase()) !== -1 );
  }

  onSetItemImage() {
    this.isLoading = true;
    this.setItemImage.emit(this.checkedImageId);
    this.checkedImageId = -1;
  }
}
