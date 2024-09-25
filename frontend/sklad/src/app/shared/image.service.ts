import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, of } from "rxjs";

interface CachedImage {
  url: string;
  blob: Blob;
}

@Injectable({providedIn: 'root'})
 export class ImageService {
  // private _cachedImages: CachedImage[] = [];
  private _cachedImages: Map<string, string> = new Map();

  constructor(private http: HttpClient) {}

  getImage(url: string): Observable<string> {
    const cachedUrl = this._cachedImages.get(url);

    if (cachedUrl) {
      // Return the cached object URL as an observable
      return of(cachedUrl);
    } else {
      // Fetch the image from the server and cache it
      return this.http.get(url, { responseType: 'blob' }).pipe(
        map(blob => {
          const objectUrl = URL.createObjectURL(blob);
          this._cachedImages.set(url, objectUrl);
          return objectUrl;
        })
      );
    }
  }

  setImage(url: string, blob: File | Blob): void {
    const objectUrl = URL.createObjectURL(blob);
    this._cachedImages.set(url, objectUrl);
  }

  removeImage(url: string): boolean {
    return this._cachedImages.delete(url)
  }

  // private cacheImage(url: string, blob: Blob) {
  //   this._cachedImages.push({ url, blob });
  // }
}