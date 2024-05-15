import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Company } from "../shared/models/company.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { BriefUserModel } from "../frontpage/login/briefUser.model";

@Injectable()
export class WorkspaceService {
  companyDetails = new BehaviorSubject<Company>(null);

  constructor(
    private http: HttpClient
  ) {}

  getCompany(id: number) {
    if (typeof localStorage === 'undefined')
      return;

    const userBriefData: BriefUserModel = JSON.parse(localStorage.getItem('userBriefData'));

    if (!userBriefData)
      return;

    this.http.get<any>(
      environment.API_SERVER + "/api/secret/company/" + id,
      {
        headers: {
          "Authorization": `Bearer ${userBriefData.token}`
        }
      }
    ).subscribe(
      {
        next: result => {
          console.log(result)
          this.companyDetails.next(result);
        },
        error: error => {
          console.error('Error creating a company:', error);
        },
        complete: () => {
          // this.isLoading = false;
        }
      }
    );
  }

  reset() {
    this.companyDetails.next(null);
  }
}