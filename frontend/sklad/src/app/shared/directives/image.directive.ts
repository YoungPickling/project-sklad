import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ImageService } from '../image.service';
import { Observable } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[cacheSrc]'
})
export class ImageCacheDirective implements OnInit {
  @Input('cacheSrc') imageUrl: string;

  constructor(private el: ElementRef, private imageService: ImageService) {}

  ngOnInit() {
    if (this.imageUrl) {
      // this.imageService.cacheUrls = [this.imageUrl];
      const imageObservable: Observable<string> = this.imageService.getImage(this.imageUrl);
      
      imageObservable.subscribe({
        next: (res: string) => {
          // console.log(res);
          // this.el.nativeElement.src = this.imageUrl;
          if (this.el.nativeElement.tagName.toLowerCase() === 'img') {
            this.el.nativeElement.src = res;
            // this.el.nativeElement.src = this.imageUrl;
          } else if (this.el.nativeElement.tagName.toLowerCase() === 'div') {
            this.el.nativeElement.style.backgroundImage = `url(${res})`;
            // this.el.nativeElement.style.backgroundImage = `url(${this.imageUrl})`;
          } else {
            console.warn('Element is neither img nor div');
          }
        },
        error: (err: any) => {
          console.error('Image load error:', err);
        }
      });
    }
  }
}