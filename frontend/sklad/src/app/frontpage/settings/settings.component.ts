import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../login/auth.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { User } from "../../shared/models/user.model";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit, OnDestroy {
  menuSelector: number = 0;

  user: User = null;
  userImageHash = ""
  link = environment.API_SERVER + "/api/rest/v1/secret/image/";

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
        this.userImageHash = user?.image?.hash || "";
      }
    );
  }

  ngOnDestroy() {
    if (this.userDetailsSubscription)
      this.userDetailsSubscription.unsubscribe();
  }
}