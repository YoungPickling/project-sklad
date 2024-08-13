import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { WorkspaceService } from "./workspace.service";
import { TestBed } from "@angular/core/testing";
import { BriefUserModel } from "../frontpage/login/briefUser.model";
import { Company } from "../shared/models/company.model";
import { environment } from "../../environments/environment";
import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Item } from "../shared/models/item.model";
import { Supplier } from "../shared/models/supplier.model";
import { Location } from "../shared/models/location.model";

describe('WorkspaceService', () => {
  const mockToken = 'ey9iJIJhbGciUzUxMiJO.eyJzdWIiOjE3MjIiOiJqb25hczE5ODgiLCJpYXQ1MDkwNDgsImV4cCI6MTcyMjU5NTQ0OH0.kp3Fh5sazMilvnP8kPDSGQKteqyfp_O5-iket2OWRQfO3KinV02iIWFGMzPywq3v1YXlyjFMWxahVA0yKsSnEA';
  const companyPath = "/api/rest/v1/secret/company/1"
  const mockCompany: Company = {
    id: 1,
    name: 'Test Company',
    image: null,
    user: [],
    imageData: [],
    locations: [],
    items: [],
    suppliers: [],
    log: [],
    description: 'A test company',
  };
  const mockItem: Item = { 
    id: 1,
    code: "s",
    name: "s",
    image: null,
    color: 0,
    columns: null,
    parents: null, 
    quantity: null,
    company: mockCompany,
    suppliers: null,
    description: "s"
  };
  const mockLocation: Location = {
    id: 1,
    name: 's',
    image: null,
    street_and_number: 's',
    city_or_town: 's',
    country_code: 's',
    postal_code: 's',
    phone_number: 's',
    phone_number_two: 's',
    description: 's',
    owner: mockCompany
  };
  const mockSupplier: Supplier = {
    ...mockLocation,
    website: 's',
  };
  const mockLocalStorage: BriefUserModel = {
    username: 'testuser',
    role: 'USER',
    token: mockToken,
  };
  const GET = "GET";
  const POST = "POST";
  const PUT = "PUT";
  const DELETE = "DELETE";
  const homeUrl = environment.API_SERVER;
  const GET_COMPANY_URL = homeUrl + companyPath
  const BOILERPLATE = " and update company details";
  
  let service: WorkspaceService;
  let controller: HttpTestingController;

  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkspaceService],
    });

    service = TestBed.inject(WorkspaceService);
    controller = TestBed.inject(HttpTestingController);
    localStorage.setItem('userBriefData', JSON.stringify(mockLocalStorage));

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  })

  afterEach(() => {
    controller.verify()
    localStorage.clear();
  })

  it('creates a service', () => {
    expect(service).toBeTruthy();
  })

  describe('getCompany', () => {
    it('should fetch company details and update the BehaviorSubject', () => {
    
      service.getCompany(mockCompany.id);
      const req = controller.expectOne(GET_COMPANY_URL);
      expect(req.request.method).toBe(GET);
      req.flush(mockCompany);

      expect(service.companyDetails.value).toEqual(mockCompany);
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle an error response', () => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const mockError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        url: GET_COMPANY_URL,
        error: null,
      });

      service.getCompany(1);

      const req = controller.expectOne(GET_COMPANY_URL);
      expect(req.request.method).toBe(GET);
      req.flush(null, mockError);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error getting a Company:', 
        service.errorResponse.value
      );

      service.errorResponse.subscribe(error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.url).toBe(GET_COMPANY_URL);
        expect(error.error).toBeNull();
      });

      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('Item', () => {
    describe('addItem', () => {
      it('should add an item' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);

        // const spy = jest.spyOn(service as any, 'getLatestUpdates');
        
        service.addItem(mockItem);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/item/${mockCompany.id}`
        );
        expect(req1.request.method).toBe(POST);
        req1.flush(mockItem);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });

    describe('updateItems', () => {
      it('should update an item' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);

        // const spy = jest.spyOn(service as any, 'getLatestUpdates');
        
        service.updateItem(mockItem);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/item/${mockCompany.id}`
        );
        expect(req1.request.method).toBe(PUT);
        req1.flush(mockItem);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });

    describe('removeItems', () => {
      it('should remove an item' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);
        const mockItemList: number[] = [1,2];

        // const spy = jest.spyOn(service as any, 'getLatestUpdates');
        
        service.removeItems(mockItemList);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/item?delete=1&delete=2`
        );
        expect(req1.request.method).toBe(DELETE);
        req1.flush(mockItemList);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });

    describe('updateItemSuppliers', () => {
      it('should remove an item' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);
        const mockList: number[] = [1,2];
        
        service.updateItemSuppliers(mockItem.id, mockList);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/item/suppliers/1?s=1&s=2`
        );
        expect(req1.request.method).toBe(POST);
        req1.flush(mockList);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });

    describe('updateItemLocations', () => {
      it('should remove an item' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);
        
        service.updateItemLocations(mockItem.id, mockLocation.id, 1);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/item/location/${mockItem.id}/${mockLocation.id}`
        );
        expect(req1.request.method).toBe(PUT);
        req1.flush(1);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });

    describe('updateItemParents', () => {
      it('should remove an item' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);
        
        service.updateItemParents(mockItem.id, mockLocation.id);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/item/parents/${mockItem.id}`
        );
        expect(req1.request.method).toBe(PUT);
        req1.flush(1);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });

  });

  describe('GalleryImage', () => {
    describe('addGalleryImage', () => {
      it('should add an image to the gallery' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);
        const mockImage = new FormData();
        const mockItemList: number[] = [1,2];
        const anything = {yes: "success"}
        
        service.addGalleryImage(mockImage, mockCompany.id);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/image/${mockCompany.id}`
        );
        expect(req1.request.method).toBe(POST);
        req1.flush(anything);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });

    describe('removeGalleryImage', () => {
      it('should remove a gallery image' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);
        const hash = "hash";
        
        service.removeGalleryImage(hash);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/image/${hash}`
        );
        expect(req1.request.method).toBe(DELETE);
        req1.flush(hash);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Supplier', () => {
    describe('addSupplier', () => {
      it('should add a supplier' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);

        service.addSupplier(mockSupplier);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/supplier/${mockCompany.id}`
        );
        expect(req1.request.method).toBe(POST);
        req1.flush(mockSupplier);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });

    describe('updateSupplier', () => {
      it('should update a supplier' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);

        service.updateSupplier(mockSupplier);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/supplier/${mockCompany.id}`
        );
        expect(req1.request.method).toBe(PUT);
        req1.flush(mockSupplier);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });

    describe('removeSuppliers', () => {
      it('should remove suppliers' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);
        const mockItemList: number[] = [1,2];

        service.removeSuppliers(mockItemList);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/supplier/${mockCompany.id}?delete=1&delete=2`
        );
        expect(req1.request.method).toBe(DELETE);
        req1.flush(mockSupplier);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Location', () => {
    describe('addLocation', () => {
      it('should add a location' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);

        service.addLocation(mockLocation);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/location/${mockCompany.id}`
        );
        expect(req1.request.method).toBe(POST);
        req1.flush(mockLocation);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });

    describe('updateLocation', () => {
      it('should update location' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);

        service.updateLocation(mockLocation);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/location/${mockCompany.id}`
        );
        expect(req1.request.method).toBe(PUT);
        req1.flush(mockLocation);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });

    describe('removeLocations', () => {
      it('should remove locations' + BOILERPLATE, () => {
        service.companyDetails.next(mockCompany);
        const mockList: number[] = [1,2];

        service.removeLocations(mockList);

        const req1 = controller.expectOne(
          `${homeUrl}/api/rest/v1/secret/location/${mockCompany.id}?delete=1&delete=2`
        );
        expect(req1.request.method).toBe(DELETE);
        req1.flush(mockLocation);

        const req2 = controller.expectOne(GET_COMPANY_URL);
        expect(req2.request.method).toBe(GET);
        req2.flush(mockCompany);

        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });
  });
});