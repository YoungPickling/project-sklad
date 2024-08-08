import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { WorkspaceService } from "./workspace.service";
import { TestBed } from "@angular/core/testing";
import { BriefUserModel } from "../frontpage/login/briefUser.model";
import { Company } from "../shared/models/company.model";
import { environment } from "../../environments/environment";
import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Item } from "../shared/models/item.model";

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
  const homeUrl = environment.API_SERVER;
  
  let service: WorkspaceService;
  let httpTestingController: HttpTestingController;

  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkspaceService],
    });

    service = TestBed.inject(WorkspaceService);
    httpTestingController = TestBed.inject(HttpTestingController);

    const mockLocalStorage: BriefUserModel = {
      username: 'testuser',
      role: 'USER',
      token: mockToken,
    };

    localStorage.setItem('userBriefData', JSON.stringify(mockLocalStorage));

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  })

  afterEach(() => {
    httpTestingController.verify()
    localStorage.clear();
  })

  it('creates a service', () => {
    expect(service).toBeTruthy();
  })

  describe('getCompany', () => {
    it('should fetch company details and update the BehaviorSubject', () => {
    
      service.getCompany(1);
      const req = httpTestingController.expectOne(homeUrl + companyPath);
      expect(req.request.method).toBe('GET');
      req.flush(mockCompany);

      expect(service.companyDetails.value).toEqual(mockCompany);
      expect(consoleLogSpy).toHaveBeenCalled()
    });

    it('should handle an error response', () => {
      const mockError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        url: homeUrl + companyPath,
        error: null,
      });

      service.getCompany(1);

      const req = httpTestingController.expectOne(homeUrl + companyPath);
      expect(req.request.method).toBe('GET');
      req.flush(null, mockError);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error getting a Company:', 
        service.errorResponse.value
      );

      service.errorResponse.subscribe(error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.url).toBe(homeUrl + companyPath);
        expect(error.error).toBeNull();
      });

      expect(consoleLogSpy).toHaveBeenCalled()
    });
  });

  describe('addItem', () => {
    it('should add an item and update company details', () => {
      service.companyDetails.next(mockCompany);

      const spy = jest.spyOn(service as any, 'getLatestUpdates');
      
      service.addItem(mockItem);

      const req1 = httpTestingController.expectOne(`${homeUrl}/api/rest/v1/secret/item/${mockCompany.id}`);
      expect(req1.request.method).toBe('POST');
      req1.flush(mockItem);

      const req2 = httpTestingController.expectOne(homeUrl + companyPath);
      expect(req2.request.method).toBe('GET');
      req2.flush(mockCompany);

      expect(consoleLogSpy).toHaveBeenCalled()
    });
  });

})