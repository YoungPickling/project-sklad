import { TestBed } from "@angular/core/testing";
import { ImageService } from "./image.service"
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import 'jest';

describe('ImageService', () => {
  let imageService: ImageService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImageService],
    });

    imageService = TestBed.inject(ImageService);
    //create an instance of HttpTestingController that will intercept and assert HTTP requests
    httpTestingController = TestBed.inject(HttpTestingController);

    // Mock URL.createObjectURL globally
    global.URL.createObjectURL = jest.fn().mockImplementation((blob: Blob) => {
      return 'mockObjectUrl:' + blob.size; // or some other unique mock URL string
    });
  })

  afterEach(() => {
    httpTestingController.verify();
    jest.clearAllMocks();
  });

  it('creates a service', () => {
    expect(imageService).toBeTruthy();
  });

  it('should return cached image URL if it exists', (done) => {
    const url = 'https://example.com/image.jpg';
    const blob = new Blob(['image data'], { type: 'image/jpeg' });
    const objectUrl = URL.createObjectURL(blob);
    imageService['_cachedImages'].set(url, objectUrl);

    imageService.getImage(url).subscribe(result => {
      expect(result).toBe(objectUrl);
      done();
    });
  });

  it('should fetch and cache image if it does not exist in cache', (done) => {
    const url = 'https://example.com/image.jpg';
    const blob = new Blob(['image data'], { type: 'image/jpeg' });
    const objectUrl = URL.createObjectURL(blob);

    imageService.getImage(url).subscribe(result => {
      expect(result).toBe(objectUrl);
      expect(imageService['_cachedImages'].get(url)).toBe(objectUrl);
      done();
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(blob);
  });
})