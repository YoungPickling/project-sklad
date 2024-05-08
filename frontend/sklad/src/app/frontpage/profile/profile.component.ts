import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
// import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { /* Observable, */ Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ShortenPipe } from '../../shared/pipes/shorten.pipe';
import { MatIconModule } from '@angular/material/icon';
import { AlertComponent } from '../../shared/alert/alert.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Company } from '../../shared/models/company.model';
import { BriefUserModel } from '../login/briefUser.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ShortenPipe, MatIconModule, AlertComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User = null;
  companyButtonState: boolean[];
  initials = "";

  error: string = "null";
  isLoading = false;
  alertOpen = false;
  alertTitle: string = null;
  alertPreset: string = null;

  private userDetailsSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private http: HttpClient
    // private route: Router 
  ) {}

  ngOnInit() {
    this.userDetailsSubscription = this.authService.userDetails.subscribe(
      user => {
        this.user = user;
        this.initials = user?.firstname.toUpperCase().at(0) + user?.lastname.toUpperCase().at(0);
        this.companyButtonState = new Array<boolean>(this.user?.company?.length || 0).fill(false);
      }
    );
  }

  ngOnDestroy() {
    if (this.userDetailsSubscription) {
      this.userDetailsSubscription.unsubscribe();
    }
  }

  onOpenAddCompanyMenu() {
    this.alertTitle = 'Add Company';
    this.alertPreset = 'addCompany'
    this.alertOpen = true;
  }

  onHandleError() {
    this.alertOpen = false;
    this.error = null;
  }

  onCloseAlert() {
    this.alertOpen = false;
  }

  onAddCompany($event: {name: string, description: string}) {
    this.isLoading = true;

    const userBriefData: BriefUserModel = JSON.parse(localStorage.getItem('userBriefData'));

    if (!userBriefData) {
      return;
    }

    this.http.post<Company>(
      environment.API_SERVER + '/api/secret/company',
      $event,
      {
        headers: {
          "Authorization": `Bearer ${userBriefData.token}`
        }
      }
    ).subscribe({
      next: () => {
        this.alertOpen = false;
        this.authService.autoLogin(); // updates company list
      },
      error: error => {
        console.error('Error creating a company:', error);
        this.error = error.error.error;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // getCompanyImage() {
  //   const userBriefData: {
  //     username: string;
  //     role: string;
  //     token: string;
  //   } = JSON.parse(localStorage.getItem('userBriefData'));

  //   if (!userBriefData || !this.user?.image?.hash) {
  //     return;
  //   }

  //   let authObs = this.http.get(
  //     environment.API_SERVER + `/api/secret/image/${this.user.image.hash}`,
  //     {
  //       headers: {
  //         "Authorization": `Bearer ${userBriefData.token}`
  //       },
  //       responseType: 'blob'
  //     }
  //   ).subscribe(
  //     (imageBlob: Blob) => {
  //       // Handle the image blob here
  //       // For example, you can create a URL for the blob and assign it to an image element
  //       const imageUrl = URL.createObjectURL(imageBlob);
  //       // Assign the URL to an image element in the HTML
  //       // For example:
  //       // document.getElementById('companyImage').src = imageUrl;
  //     },
  //     error => {
  //       console.error('Error fetching company image:', error);
  //     }
  //   );
  // }
}
