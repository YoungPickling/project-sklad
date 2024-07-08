import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, of, tap } from "rxjs";

interface CachedImage {
  url: string;
  blob: Blob;
}

@Injectable({providedIn: 'root'})
 export class ImageService {
  // private _cachedImages: CachedImage[] = [];
  private _cachedImages: Map<string, string> = new Map();

  constructor(private http: HttpClient) {}

  // getImage(url: string): Observable<Blob | string> {
  //   const index = this._cachedImages.findIndex(image => image.url === url);
  //   console.log(url)
  //   // console.log(index);
  //   if (index > -1) {
  //     // console.log(this._cacheUrls);
  //     // console.log(this._cachedImages);
  //     const image = this._cachedImages[index];
  //     return of(URL.createObjectURL(image.blob));
  //   }
  //     console.log("no?")
  //     return this.http.get(url, { responseType: 'blob' }).pipe(
  //       tap(blob => this.checkAndCacheImage(url, blob as Blob))
  //   );
  // }

  // getImage(url: string): Observable<string> {
  //   const cachedImage = this._cachedImages.find(image => image.url === url);

  //   if (cachedImage) {
  //     // Return the cached image as an observable
  //     return of(URL.createObjectURL(cachedImage.blob));
  //   } else {
  //     // Fetch the image from the server and cache it
  //     return this.http.get(url, { responseType: 'blob' }).pipe(
  //       tap(blob => this.cacheImage(url, blob as Blob)),
  //       // Convert the blob to a URL and return it
  //       map(blob => URL.createObjectURL(blob))
  //     );
  //   }
  // }

  // checkAndCacheImage(url: string, blob: Blob) {
  //   // if (this._cacheUrls.indexOf(url)) { // gives errors
  //     this._cachedImages.push({url, blob});
  //   // }
  // }

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

  // private cacheImage(url: string, blob: Blob) {
  //   this._cachedImages.push({ url, blob });
  // }
}