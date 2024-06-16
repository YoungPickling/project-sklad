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

  closeAlert = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient
  ) {}

  getCompany(id: number): void {
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

  addItem(item: Item): void {
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
          this.getLatestUpdates(result);
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

  updateItem(item: Item): void {
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
          this.getLatestUpdates(result);
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

  removeItems(items: number[]): void {
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
          this.getLatestUpdates(result);
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

  addGalleryImage(image: File, companyId: number): void {
    const userBriefData: BriefUserModel = JSON.parse(localStorage.getItem('userBriefData'));

    if (!userBriefData) {
      console.error('User data not available in localStorage');
      this.isLoading.next(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', image, image.name);

    this.http.post<any>(
      environment.API_SERVER + "/api/rest/v1/secret/image/" + companyId,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${userBriefData.token}`
        }
      }
    ).subscribe(
      {
        next: result => {
          this.getLatestUpdates(result);
        },
        error: error => {
          console.error('Error uploading image to Gallery:', error);
        },
        complete: () => {
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }
      }
    );
  }

  removeGalleryImage(hash: string): void {
    const userBriefData: BriefUserModel = JSON.parse(localStorage.getItem('userBriefData'));

    if (!userBriefData) {
      console.error('User data not available in localStorage');
      this.isLoading.next(false);
      return;
    }

    this.http.delete<any>(
      environment.API_SERVER + "/api/rest/v1/secret/image/" + hash,
      {
        headers: {
          "Authorization": `Bearer ${userBriefData.token}`
        }
      }
    ).subscribe(
      {
        next: result => {
          this.getLatestUpdates(result);
        },
        error: error => {
          console.error('Error removing gallery image:', error);
        },
        complete: () => {
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }
      }
    );
  }

  removeItemImage() {
    // TODO
    this.isLoading.next(false); 
  }

  private getLatestUpdates(result: any): void {
    console.log(result)
    this.getCompany(this.companyDetails.value.id);
  }

  private reset(): void {
    this.companyDetails.next(null);
  }
}