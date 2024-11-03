import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Company } from '../../shared/models/company.model';
import { WorkspaceService } from '../workspace.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { AlertComponent, AlertPresets } from '../../shared/alert/alert.component';
import { Image } from '../../shared/models/image.model';
import { ImageCacheDirective } from '../../shared/directives/image.directive';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    AlertComponent,
    ImageCacheDirective
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit, OnDestroy {
  company: Company;
  link = environment.API_SERVER + "/api/rest/v1/secret/image/";
  altLink = environment.FRONT_SERVER;

  addButtonActive = false;
  removeButtonActive = false;

  alertOpen = false;
  closeComfirmationOpen = false;
  isLoading = false;
  alertPreset: AlertPresets = null;
  error: string = "null";
  alertTitle: string = null;
  errorResponse: HttpErrorResponse;

  imageData: Image;

  confirmDeletWindow = false;
  confirmMessage: string;
  
  private companyDetailSub: Subscription;
  private loadingSubscription: Subscription;
  private alertWindowSubscription: Subscription;
  private errorSubscription: Subscription;

  constructor(
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit() {
    this.companyDetailSub = this.workspaceService.companyDetails.subscribe(
      company => {
        this.company = company;
      }
    );

    this.loadingSubscription = this.workspaceService.isLoading.subscribe(
      state => {
        this.isLoading = state;
      }
    );

    this.alertWindowSubscription = this.workspaceService.closeAlert.subscribe(
      state => {
        this.alertOpen = state;
      }
    );

    this.errorSubscription = this.workspaceService.errorResponse.subscribe(
      error => {
        this.errorResponse = error;
      }
    );
  }

  ngOnDestroy() {
    this.workspaceService.errorResponse.next(null);
    if(this.companyDetailSub) {
      this.companyDetailSub.unsubscribe()
    }
    this.loadingSubscription.unsubscribe();
    this.alertWindowSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  get images() {
    return this.company?.imageData.sort((a, b) => a.id - b.id);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Escape") {
      if (this.confirmDeletWindow) {
        this.confirmDeletWindow = false;
      } else if (this.alertOpen) {
        this.alertOpen = false;
      }
    }
  }

  onClickAddBtn() {
    this.alertTitle = 'Upload Gallery Image';
    this.alertPreset = AlertPresets.addGalleryImage
    this.alertOpen = true;
  }

  onClickRemoveBtn() {
    // TODO
  }

  onHandleClose() {
    if (this.confirmDeletWindow)
      this.confirmDeletWindow = false;
    else if (this.alertOpen) 
      this.alertOpen = false;
    
    this.error = null;
  }

  onCloseAlert() {
    this.alertOpen = false;
  }

  onAddGalleryImage(event: { image: File }) {
    this.isLoading = true;

    const formData = new FormData();
    formData.append('image', event.image, event.image.name);

    this.workspaceService.addGalleryImage(formData, this.company.id);
  }

  onClickOpenImage(image: Image) {
    // console.log(image);
    this.alertTitle = image.name;
    this.alertPreset = AlertPresets.showGalleryImage
    this.imageData = image;
    this.alertOpen = true;
  }

  onClickDeleteImage() {
    this.confirmDeletWindow = true;
    this.confirmMessage = this.imageData?.name;
  }

  onClickConfirmDeleteImage() {
    this.confirmDeletWindow = false;
    this.isLoading = true;
    this.workspaceService.removeGalleryImage(this.imageData?.hash)
  }
}
