import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { AuthService, LoginResponseData, RegisterData } from "./auth.service";
import { environment } from "../../../environments/environment";
import { HttpErrorResponse } from "@angular/common/http";
import { BriefUserModel } from "./briefUser.model";
import { User } from "../../shared/models/user.model";

describe('AuthService', () => {
  const mockUserDetails: User = {
    id: 1,
    username: 'testuser',
    firstname: 'first',
    lastname: 'last',
    email: 'testuser@example.lt',
    role: 'USER',
  };
  
  const registerData: RegisterData = {
    firstname: 'first',
    lastname: 'last',
    username: 'testuser',
    email: 'testuser@example.lt',
    password: 'password123',
  };
  const expectedResponse: LoginResponseData = {
    role: "USER",
    access_token: "token"
  };

  let service: AuthService;
  let controller: HttpTestingController;

  const GET = "GET";
  const POST = "POST";
  const homeUrl = environment.API_SERVER;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify()
    localStorage.clear();
  });

  it('creates a service', () => {
    expect(service).toBeTruthy();
  });

  describe('signup', () => {
    it('should send a POST request to register a new user and handle authentication', (done) => {
      service.signup(registerData).subscribe((response) => {
        expect(response).toEqual(mockUserDetails);
        expect(service.user.value.role).toBe(expectedResponse.role);
        expect(service.user.value.token).toBe(expectedResponse.access_token);
        done();
      });

      const signupReq = controller.expectOne(`${homeUrl}/api/rest/v1/secret/auth/register`);
      expect(signupReq.request.method).toBe(POST);
      signupReq.flush(expectedResponse);

      const userDetailsReq = controller.expectOne(`${homeUrl}/api/rest/v1/secret/user/me`);
      expect(userDetailsReq.request.method).toBe(GET);
      userDetailsReq.flush(mockUserDetails);
    });
  });

  describe('login', () => {
    const username = 'testuser';
    const password = 'password123';

    it('should send a POST request and handle the authentication', (done) => {
      service.login(username, password).subscribe((response) => {
        expect(response).toEqual(mockUserDetails);
        expect(service.user.value.role).toBe(expectedResponse.role);
        expect(service.user.value.token).toBe(expectedResponse.access_token);
        done();
      });

      const loginReq = controller.expectOne(`${homeUrl}/api/rest/v1/secret/auth/login`);
      expect(loginReq.request.method).toBe(POST);
      loginReq.flush(expectedResponse);

      const userDetailsReq = controller.expectOne(`${homeUrl}/api/rest/v1/secret/user/me`);
      expect(userDetailsReq.request.method).toBe(GET);
      userDetailsReq.flush(mockUserDetails);
    });

    it('should handle error responses', (done) => {
      const mockError = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });

      service.login(username, password).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = controller.expectOne(`${homeUrl}/api/rest/v1/secret/auth/login`);
      req.flush(null, mockError);
    });
  });

  describe('getUserDetails', () => {
    it('should send a GET request to retrieve user details', (done) => {
      service.getUserDetails('token').subscribe((user) => {
        expect(user).toEqual(mockUserDetails);
        done();
      });

      const req = controller.expectOne(`${homeUrl}/api/rest/v1/secret/user/me`);
      expect(req.request.method).toBe(GET);
      req.flush(mockUserDetails);
    });

    it('should handle error responses', (done) => {
      const mockError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
      });

      service.getUserDetails('token').subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = controller.expectOne(`${homeUrl}/api/rest/v1/secret/user/me`);
      req.flush(null, mockError);
    });
  });

  describe('logout', () => {
    it('should clear user data and userDetails', () => {
      service.logout();
      expect(service.user.value).toBeNull();
      expect(service.userDetails.value).toBeNull();
      expect(localStorage.getItem('userData')).toBeNull();
      expect(localStorage.getItem('userBriefData')).toBeNull();
    });
  });

  describe('autoLogin', () => {
    beforeEach(() => {
      localStorage.clear();
    });
  
    it('should load user data from localStorage and update the service state', () => {
      // Arrange: Set up the fake user data in localStorage
      const mockUserBriefData: BriefUserModel = {
        username: 'testuser',
        role: 'USER',
        token: 'token',
      };
  
      localStorage.setItem('userBriefData', JSON.stringify(mockUserBriefData));
  
      // Mock getUserDetails to return the mockUserDetails
      const getUserDetailsSpy = jest.spyOn(service, 'getUserDetails').mockReturnValue({
        subscribe: ({ next }: { next: (value: any) => void }) => {
          next(mockUserDetails);
        },
      } as any);
  
      // Act: Call autoLogin
      service.autoLogin();
  
      // Assert: Verify that user data was loaded and service state was updated
      expect(service.user.value).toEqual(mockUserBriefData);
      expect(getUserDetailsSpy).toHaveBeenCalledWith('token');
      expect(service.userDetails.value).toEqual(mockUserDetails);
    });
  
    it('should not update the service state if no user data is found in localStorage', () => {
      
      // Act: Call autoLogin without setting anything in localStorage
      service.autoLogin();
  
      // Assert: Verify that user data was not updated
      expect(service.user.value).toBeNull();
      expect(service.userDetails.value).toBeNull();
    });
  
    it('should log out the user if getUserDetails fails', () => {
      // Arrange: Set up the fake user data in localStorage
      const mockUserBriefData: BriefUserModel = {
        username: 'testuser',
        role: 'USER',
        token: 'token',
      };

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      localStorage.setItem('userBriefData', JSON.stringify(mockUserBriefData));
  
      // Mock getUserDetails to throw an error
      jest.spyOn(service, 'getUserDetails').mockReturnValue({
        subscribe: (callbacks: any) => {
          callbacks.error('Error fetching user details');
        },
      } as any);
      
      const logoutSpy = jest.spyOn(service, 'logout');
  
      // Act: Call autoLogin
      service.autoLogin();
  
      // Assert: Verify that logout was called
      expect(logoutSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

});