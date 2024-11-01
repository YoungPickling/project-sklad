import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Company } from "../shared/models/company.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { BriefUserModel } from "../frontpage/login/briefUser.model";
import { Item } from "../shared/models/item.model";
import { Supplier } from "../shared/models/supplier.model";
import { Location } from "../shared/models/location.model";
import { ImageService } from "../shared/image.service";
import { Image } from "../shared/models/image.model";
import { Group } from "../shared/models/group.model";

export type FilterSet = {
  image: boolean;
  code: boolean;
  name: boolean;
  description: boolean;
  parameters: boolean
  locations: boolean;
  suppliers: boolean;
  parents: boolean;
  product: boolean;
};

export type AssembleDTO = {
  add: number, 
  build: number, 
  locationId: number
}

@Injectable()
export class WorkspaceService {
  initial = true;
  companyDetails = new BehaviorSubject<Company>(null);
  isLoading = new BehaviorSubject<boolean>(false);

  closeAlert = new BehaviorSubject<boolean>(false);
  errorResponse = new BehaviorSubject<HttpErrorResponse>(null);

  itemFilter = new BehaviorSubject<FilterSet>({
    image: true,
    code: true,
    name: true,
    description: true,
    parameters: true,
    locations: true,
    suppliers: true,
    parents: true,
    product: false,
  });

  private hashIncrement: number = 0; // For demo version inmemory images
  private API_PATH = "/api/rest/v1/secret/";

  constructor(
    private http: HttpClient,
    private imageService: ImageService
  ) {}

  get companyId() {
    return this.companyDetails.value?.id;
  }

  getCompany(id: number): void {
    // If demo mode is on, company id is 0
    if(id === 0 || id == undefined) {
      if(this.initial) {
        this.companyDetails.next(environment.DEFAULT_COMPANY as Company);
        this.initial = false;
      }
      this.isLoading.next(false);
      this.closeAlert.next(false);
    } else {
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
  }

  addItem(item: Item): void {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;

      item.id = this.generateId(company.items);

      new Promise(() => {
        setTimeout(() => {
          company.items.push(item);
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.post<Item>(
        environment.API_SERVER + this.API_PATH + "item/" + this.companyId,
        item,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error inserting new item:'));
    }
  }

  updateItem(item: Item): void {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;
      
      const oldItemId = company.items.findIndex(x => x.id === item.id);

      new Promise(() => {
        setTimeout(() => {
          company.items[oldItemId] = item;
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.put<Item>(
        environment.API_SERVER + this.API_PATH + "item/" + item.id,
        item,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error updating existing item:'));
    }
  }

  removeItems(items: number[]): void {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;
      
      const updatedItems = company.items.filter(x => !items.includes(x.id));

      new Promise(() => {
        setTimeout(() => {
          company.items = updatedItems;
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.delete<number[]>(
        environment.API_SERVER + this.API_PATH + "item",
        {
          ...this.getHeaders(),
          params : { "delete": items }
        }
      ).subscribe(this.subscriptionTemplate('Error removing items:'));
    }
  }

  addGalleryImage(image: FormData, companyId: number): void {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;

      const id = this.generateId(company.imageData);
      const hash: string = '' + this.hashIncrement++;
      const file = image.get('image') as File;

      if (file) {
        this.imageService.setImage(
          environment.API_SERVER + this.API_PATH + "image/" + hash, 
          file
        ); 
      }

      const newImage: Image = {
        id: id,
        name: file.name,
        hash: hash,
        type: file.type,
      }

      new Promise(() => {
        setTimeout(() => {
          company.imageData.push(newImage);
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 130);
      });

    } else {
      this.http.post<any>(
        environment.API_SERVER + this.API_PATH + "image/" + companyId,
        image,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error uploading image to Gallery:'));
    }
  }

  removeGalleryImage(hash: string): void {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;
      
      const imageId = company.imageData.find(x => x.hash === hash).id

      this.imageService.removeImage(environment.API_SERVER + this.API_PATH + "image/" + hash);
      const gallery = company.imageData.filter(x => x.hash !== hash);

      for (let i = 0; i < company.items.length; i++) {
        if(company.items[i].image?.id === imageId) {
          company.items[i].image = null;
        }
      }

      new Promise(() => {
        setTimeout(() => {
          company.imageData = gallery;
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.delete<any>(
        environment.API_SERVER + this.API_PATH + "image/" + hash,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error removing gallery image:'));
    }
  }

  addSupplier(supplier: Supplier): void {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;

      supplier.id = this.generateId(company.suppliers);

      new Promise(() => {
        setTimeout(() => {
          company.suppliers.push(supplier);
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.post<Supplier>(
        environment.API_SERVER + this.API_PATH + "supplier/" + this.companyId,
        supplier,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error inserting new Supplier:'));
    }
  }

  updateSupplier(supplier: Supplier): void {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;

      const oldSupplierId = company.suppliers.findIndex(x => x.id === supplier.id);

      for (let i = 0; i < company.items.length; i++) {
        const index = company.items[i].suppliers?.findIndex(x => x.id === oldSupplierId);
        if(index !== -1) {
          company.items[i].suppliers[index] = supplier;
        }
      }

      new Promise(() => {
        setTimeout(() => {
          company.suppliers[oldSupplierId] = supplier;
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.put<Supplier>(
        environment.API_SERVER + this.API_PATH + "supplier/" + this.companyId,
        supplier,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error removing suppliers:'));
    }
  }

  removeSuppliers(suppliers: number[]): void {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;
      
      const newSuppliers = company.suppliers.filter(x => !suppliers.includes(x.id));

      for (let i = 0; i < company.items.length; i++) {
        company.items[i].suppliers = 
          company.items[i].suppliers.filter(x => !suppliers.includes(x.id));
      }

      new Promise(() => {
        setTimeout(() => {
          company.suppliers = newSuppliers;
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.delete<number[]>(
        environment.API_SERVER + this.API_PATH + "supplier/" + this.companyId,
        {
          ...this.getHeaders(),
          params : {"delete": suppliers}
        }
      ).subscribe(this.subscriptionTemplate('Error removing suppliers:'));
    }
  }

  addLocation(location): void {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;

      location.id = this.generateId(company.locations);
      
      new Promise(() => {
        setTimeout(() => {
          company.locations.push(location);
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.post<Location>(
        environment.API_SERVER + this.API_PATH + "location/" + this.companyId,
        location,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error inserting new Location:'));
    }
  }

  updateLocation(location: Location): void {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;

      const oldLocationId = company.locations.findIndex(x => x.id === location.id);

      new Promise(() => {
        setTimeout(() => {
          company.locations[oldLocationId] = location;
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.put<Location>(
        environment.API_SERVER + this.API_PATH + "location/" + this.companyId,
        location,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error updating existing Location:'));
    }
  }

  removeLocations(locations: number[]): void {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;
      
      const newLocations = company.locations.filter(x => !locations.includes(x.id));

      // for (let i = 0; i < company.items.length; i++) {
      //   company.items[i].quantity.forEach(key => {
      //     if (key in locations) {
      //       delete company.items[i].quantity[key];
      //     }
      //   });
      // }

      for (let i = 0; i < company.items.length; i++) {
        const quantity = company.items[i].quantity;
        
        Object.keys(quantity).forEach(key => {
          const numericKey = +key;

          if (locations.includes(numericKey)) {
            delete quantity[numericKey];
          }
        });
      }

      new Promise(() => {
        setTimeout(() => {
          company.locations = newLocations;
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.delete<number[]>(
        environment.API_SERVER + this.API_PATH + "location/" + this.companyId,
        {
          ...this.getHeaders(),
          params : {"delete": locations}
        }
      ).subscribe(this.subscriptionTemplate('Error removing locations:'));
    }
  }

  updateItemSuppliers(itemId: number, supplierIds: number[]) {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;
      
      const itemIndex = company.items.findIndex(x => x.id === itemId);
      let supplierList: Supplier[] = company.suppliers.filter(x => supplierIds.includes(x.id));

      console.log(supplierList)
      
      new Promise(() => {
        setTimeout(() => {
          company.items[itemIndex].suppliers = supplierList;
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 110);
      });
    } else {
      this.http.post<any>(
        environment.API_SERVER + this.API_PATH + "item/suppliers/" + itemId,
        null,
        {
          ...this.getHeaders(),
          params : {"s": supplierIds}
        }
      ).subscribe(this.subscriptionTemplate('Error assigning Suppliers to an Item:'));
    }
  }

  updateItemLocations(itemId: number, locationId: number, quantity: number) {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;
      
      const itemIndex = company.items.findIndex(x => x.id === itemId);

      new Promise(() => {
        setTimeout(() => {
          company.items[itemIndex].quantity[locationId] = quantity;
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 130);
      });
      
    } else {
      this.http.put<any>(
        `${environment.API_SERVER + this.API_PATH}item/location/${itemId}/${locationId}`,
        Number.isNaN(quantity) ? -1 : quantity,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error assigning Suppliers to an Item:'));
    }
  }

  updateItemParents(parents: any, itemId: number) {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;

      const itemIndex = company.items.findIndex(x => x.id === itemId);

      new Promise(() => {
        setTimeout(() => {
          company.items[itemIndex].parents = parents;
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.put<any>(
        `${environment.API_SERVER + this.API_PATH}item/parents/${itemId}`,
        parents,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error assigning Parents to an Item:'));
    }
  }

  assembleItem(body: AssembleDTO, itemId: number) {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;

      const itemIndex = company.items.findIndex(x => x.id === itemId);
      const locationId = company.locations.findIndex(x => x.id === body.locationId);

      company.items[itemIndex].quantity[body.locationId] += body.add + body.build;

      if(body.build !== 0) {
        const keySet: string[] = Object.keys(company.items[itemIndex].parents);
        
        for(let i = 0; i < company.items.length; i++) {
          if(keySet.includes("" + company.items[i].id)) {
            const id = company.items[i].id;
            company.items[i].quantity[body.locationId] -= 
              body.build * company.items[itemIndex].parents[id];
          }
        }
      }

      new Promise(() => {
        setTimeout(() => {
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 80);
      });

    } else {
      this.http.post<AssembleDTO>(
        `${environment.API_SERVER + this.API_PATH}item/assemble/${itemId}`,
        body,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error assembling an Item:'));
    }
  }

  addGroup(body: Group) {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;

      body.id = this.generateId(company.itemGroups);

      new Promise(() => {
        setTimeout(() => {
          company.itemGroups.push(body);
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.post<Group>(
        `${environment.API_SERVER + this.API_PATH}group/${this.companyId}`,
        body,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error inserting new Group:'));
    }
  }

  updateGroup(body: Group) {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;

      const groupIndex = company.itemGroups.findIndex(x => x.id === body.id);

      new Promise(() => {
        setTimeout(() => {
          company.itemGroups[groupIndex].name = body.name;
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.put<Group>(
        `${environment.API_SERVER + this.API_PATH}group/${this.companyId}`,
        body,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error updating existing Group:'));
    }
  }

  itemProductStatus(id: number, status: number) {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;

      const itemIndex = company.items?.findIndex(x => x.id === id);

      new Promise(() => {
        setTimeout(() => {
          company.items[itemIndex].product = status > 0;
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.put<Group>(
        `${environment.API_SERVER + this.API_PATH}item/${id}/status/${status}`,
        null,
        { ...this.getHeaders() }
      ).subscribe(this.subscriptionTemplate('Error updating product status for Item:'));
    }
  }

  removeGroups(groups: number[]): void {
    if(this.companyId == 0) {
      const company: Company = this.companyDetails.value;
      
      const updatedItems = company.itemGroups.filter(x => !groups.includes(x.id));

      new Promise(() => {
        setTimeout(() => {
          company.itemGroups = updatedItems;
          this.initial = true;
          this.companyDetails.next(company);
          this.isLoading.next(false);
          this.closeAlert.next(false);
        }, 100);
      });

    } else {
      this.http.delete<number[]>(
        `${environment.API_SERVER + this.API_PATH}item/${this.companyId}`,
        {
          ...this.getHeaders(),
          params : { "delete": groups }
        }
      ).subscribe(this.subscriptionTemplate('Error removing Groups:'));
    }
  }

  private getLatestUpdates(result: any): void {
    if(result) {
      console.log(result)
    }
    this.getCompany(this.companyId);
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

  private generateId(object: any[]): number {
    if(object?.length > 0) {
      let newId: number = 0;
      for (let i = 0; i < object.length; i++) {
        if(object[i].id > newId) {
          newId = object[i].id;
        }
      }
      return ++newId;
    }
    return 1
  }
}