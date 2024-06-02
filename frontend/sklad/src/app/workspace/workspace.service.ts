import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Company } from "../shared/models/company.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { BriefUserModel } from "../frontpage/login/briefUser.model";
import { Item } from "../shared/models/item.model";

@Injectable()
export class WorkspaceService {
  companyDetails = new BehaviorSubject<Company>(null);
  isLoading = new BehaviorSubject<boolean>(false);

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
      environment.API_SERVER + "/api/rest/v1/secret/company/" + id,
      {
        headers: {
          "Authorization": `Bearer ${userBriefData.token}`
        }
      }
    ).subscribe(
      {
        next: (result: Company) => {
          console.log(result);
          result.items?.sort((a, b) => a.id - b.id);
          this.companyDetails.next(result);
        },
        error: error => {
          console.error('Error getting a company:', error);
        },
        complete: () => {
          this.isLoading.next(false);
        }
      }
    );
  }

  addItem(item: Item) {
    if (typeof localStorage === 'undefined')
      return;

    const userBriefData: BriefUserModel = JSON.parse(localStorage.getItem('userBriefData'));

    if (!userBriefData)
      return;

    this.http.post<Item>(
      environment.API_SERVER + "/api/rest/v1/secret/item/" + this.companyDetails.value.id,
      item,
      {
        headers: {
          "Authorization": `Bearer ${userBriefData.token}`
        }
      }
    ).subscribe(
      {
        next: result => {
          console.log(result)
          this.getCompany(this.companyDetails.value.id);
        },
        error: error => {
          console.error('Error inserting new item:', error);
        },
        complete: () => {
          this.isLoading.next(false);
        }
      }
    );
  }

  updateItem(item: Item) {
    if (typeof localStorage === 'undefined')
      return;

    const userBriefData: BriefUserModel = JSON.parse(localStorage.getItem('userBriefData'));

    if (!userBriefData)
      return;

    this.http.put<Item>(
      environment.API_SERVER + "/api/rest/v1/secret/item/" + item.id,
      item,
      {
        headers: {
          "Authorization": `Bearer ${userBriefData.token}`
        }
      }
    ).subscribe(
      {
        next: result => {
          console.log(result)
          this.getCompany(this.companyDetails.value.id);
        },
        error: error => {
          console.error('Error updating existing item:', error);
        },
        complete: () => {
          this.isLoading.next(false);
        }
      }
    );
  }

  removeItems(items: number[]) {
    if (typeof localStorage === 'undefined')
      return;

    const userBriefData: BriefUserModel = JSON.parse(localStorage.getItem('userBriefData'));

    if (!userBriefData)
      return;

    this.http.delete<number[]>(
      environment.API_SERVER + "/api/rest/v1/secret/item",
      {
        headers: {
          "Authorization": `Bearer ${userBriefData.token}`
        },
        params : {
          "delete": items
        }
      }
    ).subscribe(
      {
        next: result => {
          console.log(result)
          this.getCompany(this.companyDetails.value.id);
        },
        error: error => {
          console.error('Error removing items:', error);
        },
        complete: () => {
          this.isLoading.next(false);
        }
      }
    );
  }

  reset() {
    this.companyDetails.next(null);
  }
}