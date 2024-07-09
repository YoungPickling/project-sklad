import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
// import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { /* Observable, */ Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ShortenPipe } from '../../shared/pipes/shorten.pipe';
import { MatIconModule } from '@angular/material/icon';
import { AlertComponent, AlertPresets } from '../../shared/alert/alert.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Company } from '../../shared/models/company.model';
import { BriefUserModel } from '../login/briefUser.model';
import { Router, RouterModule } from '@angular/router';
import { ImageCacheDirective } from '../../shared/directives/image.directive';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    ShortenPipe, 
    MatIconModule, 
    AlertComponent,
    ImageCacheDirective
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User = null;
  companyButtonState: boolean[];
  initials = "";
  userImageHash = "";
  link = environment.API_SERVER + "/api/rest/v1/secret/image/";

  error: string = "null";
  isLoading = false;
  alertOpen = false;
  alertTitle: string = null;
  alertPreset: AlertPresets = null;
  companyForEdit: {id: string, name: string, description: string};

  private userDetailsSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.userDetailsSubscription = this.authService.userDetails.subscribe(
      user => {
        this.user = user;
        this.initials = user?.firstname.toUpperCase().at(0) + user?.lastname.toUpperCase().at(0);
        this.userImageHash = user?.image?.hash || "";
        this.companyButtonState = new Array<boolean>(this.user?.company?.length || 0).fill(false);
      }
    );
  }

  ngOnDestroy() {
    if (this.userDetailsSubscription) {
      this.userDetailsSubscription.unsubscribe();
    }
  }

  onHandleError() {
    this.alertOpen = false;
    this.error = null;
  }

  onCloseAlert() {
    this.alertOpen = false;
  }

  onOpenAddCompanyMenu() {
    this.alertTitle = 'Add Company';
    this.alertPreset = AlertPresets.addCompany
    this.alertOpen = true;
  }

  onOpenEditCompanyMenu(id: string, name: string, description: string) {
    this.companyForEdit = {id: id, name: name, description: description};
    this.alertTitle = 'Edit Company: ' + name;
    this.alertPreset = AlertPresets.editCompany
    this.alertOpen = true;
  }

  onAddCompany(event: {name: string, description: string}) {
    this.isLoading = true;

    const userBriefData: BriefUserModel = JSON.parse(localStorage.getItem('userBriefData'));

    if (!userBriefData) {
      return;
    }

    this.http.post<Company>(
      environment.API_SERVER + '/api/rest/v1/secret/company',
      event,
      {
        headers: {
          "Authorization": `Bearer ${userBriefData.token}`
        }
      }
    ).subscribe(
      {
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
      }
    );
  }

  onEditCompany(event: {name: string, description: string}) {
    this.isLoading = true;
    const userBriefData: BriefUserModel = JSON.parse(localStorage.getItem('userBriefData'));

    if (!userBriefData) {
      return;
    }

    const body = {name: event.name, description: event.description};

    this.http.put<Company>(
      environment.API_SERVER + '/api/rest/v1/secret/company/' + this.companyForEdit.id,
      body,
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

  onOpenWorkspace(companyId: string) {
    this.isLoading = true;
    this.router.navigate(['/workspace', companyId]);
  }
}
