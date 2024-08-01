import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Company } from "../shared/models/company.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { BriefUserModel } from "../frontpage/login/briefUser.model";
import { Item } from "../shared/models/item.model";
import { Supplier } from "../shared/models/supplier.model";
import { Location } from "../shared/models/location.model";

@Injectable()
export class WorkspaceService {
  companyDetails = new BehaviorSubject<Company>(null);
  isLoading = new BehaviorSubject<boolean>(false);

  closeAlert = new BehaviorSubject<boolean>(false);
  errorResponse = new BehaviorSubject<HttpErrorResponse>(null);

  private API_PATH = "/api/rest/v1/secret/";

  constructor(
    private http: HttpClient
  ) {}

  getCompany(id: number): void {
    this.http.get<any>(
      environment.API_SERVER + this.API_PATH + "company/" + id,
      { ...this.getHeaders() }
    ).subscribe(
      {
        next: (result: Company) => {
          console.log(result);
          result.items?.sort((a, b) => a.id - b.id);
          this.companyDetails.next(result);
        },
        error: error => {
          this.errorResponse.next(error);
          this.isLoading.next(false);
          console.error('Error getting a Company:', error);
        },
        complete: () => {
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }
      }
    );
  }

  addItem(item: Item): void {
    this.http.post<Item>(
      environment.API_SERVER + this.API_PATH + "item/" + this.companyDetails.value.id,
      item,
      { ...this.getHeaders() }
    ).subscribe(this.subscriptionTemplate('Error inserting new item:'));
  }

  updateItem(item: Item): void {
    this.http.put<Item>(
      environment.API_SERVER + this.API_PATH + "item/" + item.id,
      item,
      { ...this.getHeaders() }
    ).subscribe(this.subscriptionTemplate('Error updating existing item:'));
  }

  removeItems(items: number[]): void {
    this.http.delete<number[]>(
      environment.API_SERVER + this.API_PATH + "item",
      {
        ...this.getHeaders(),
        params : { "delete": items }
      }
    ).subscribe(this.subscriptionTemplate('Error removing items:'));
  }

  addGalleryImage(image: FormData, companyId: number): void {
    this.http.post<any>(
      environment.API_SERVER + this.API_PATH + "image/" + companyId,
      image,
      { ...this.getHeaders() }
    ).subscribe(this.subscriptionTemplate('Error uploading image to Gallery:'));
  }

  removeGalleryImage(hash: string): void {
    this.http.delete<any>(
      environment.API_SERVER + this.API_PATH + "image/" + hash,
      { ...this.getHeaders() }
    ).subscribe(this.subscriptionTemplate('Error removing gallery image:'));
  }

  addSupplier(supplier): void {
    this.http.post<Supplier>(
      environment.API_SERVER + this.API_PATH + "supplier/" + this.companyDetails.value.id,
      supplier,
      { ...this.getHeaders() }
    ).subscribe(this.subscriptionTemplate('Error inserting new Supplier:'));
  }

  updateSupplier(supplier: Supplier): void {
    this.http.put<Supplier>(
      environment.API_SERVER + this.API_PATH + "supplier/" + this.companyDetails.value.id,
      supplier,
      { ...this.getHeaders() }
    ).subscribe(this.subscriptionTemplate('Error removing suppliers:'));
  }

  removeSuppliers(suppliers: number[]): void {
    this.http.delete<number[]>(
      environment.API_SERVER + this.API_PATH + "supplier/" + this.companyDetails.value.id,
      {
        ...this.getHeaders(),
        params : {"delete": suppliers}
      }
    ).subscribe(this.subscriptionTemplate('Error removing suppliers:'));
  }

  addLocation(location): void {
    this.http.post<Location>(
      environment.API_SERVER + this.API_PATH + "location/" + this.companyDetails.value.id,
      location,
      { ...this.getHeaders() }
    ).subscribe(this.subscriptionTemplate('Error inserting new Location:'));
  }

  updateLocation(location: Location): void {
    this.http.put<Location>(
      environment.API_SERVER + this.API_PATH + "location/" + this.companyDetails.value.id,
      location,
      { ...this.getHeaders() }
    ).subscribe(this.subscriptionTemplate('Error updating existing Location:'));
  }

  removeLocations(locations: number[]): void {
    this.http.delete<number[]>(
      environment.API_SERVER + this.API_PATH + "location/" + this.companyDetails.value.id,
      {
        ...this.getHeaders(),
        params : {"delete": locations}
      }
    ).subscribe(this.subscriptionTemplate('Error removing locations:'));
  }

  updateItemSuppliers(itemId: number, supplierIds: number[]) {
    this.http.post<any>(
      environment.API_SERVER + this.API_PATH + "item/suppliers/" + itemId,
      null,
      {
        ...this.getHeaders(),
        params : {"s": supplierIds}
      }
    ).subscribe(this.subscriptionTemplate('Error assigning Suppliers to an Item:'));
  }

  updateItemLocations(itemId: number, locationId: number, quantity: number) {
    this.http.put<any>(
      `${environment.API_SERVER + this.API_PATH}item/location/${itemId}/${locationId}`,
      Number.isNaN(quantity) ? -1 : quantity,
      { ...this.getHeaders() }
    ).subscribe(this.subscriptionTemplate('Error assigning Suppliers to an Item:'));
  }

  updateItemParents(parents: any, itemId: number) {
    this.http.put<any>(
      `${environment.API_SERVER + this.API_PATH}item/parents/${itemId}`,
      parents,
      { ...this.getHeaders() }
    ).subscribe(this.subscriptionTemplate('Error assigning Parents to an Item:'));
  }

  // removeItemImage() {
  //   this.isLoading.next(false); 
  // }

  private getLatestUpdates(result: any): void {
    if(result) {
      console.log(result)
    }
    this.getCompany(this.companyDetails.value.id);
  }

  private reset(): void {
    this.companyDetails.next(null);
  }

  private subscriptionTemplate(msg: string) {
    return {
      next: result => {
        this.getLatestUpdates(result);
      },
      error: error => {
        this.errorResponse.next(error);
        this.isLoading.next(false);
        console.error(msg, error);
      },
      complete: () => {
        this.isLoading.next(false);
        this.closeAlert.next(false);
      }
    }
  }

  private getToken(): string {
    if (typeof localStorage === 'undefined')
      throw "No local storage";

    const userBriefData: BriefUserModel = JSON.parse(localStorage.getItem('userBriefData'));

    if (!userBriefData)
      throw "No authentication data found";

    return userBriefData.token;
  }

  private getHeaders() {
    return { headers: {
        "Authorization": `Bearer ${this.getToken()}`
      }
    }
  }
}