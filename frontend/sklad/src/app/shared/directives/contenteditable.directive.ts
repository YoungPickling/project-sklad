import { Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from "@angular/core";


@Directive({
  standalone: true,
	selector: '[inputValue]'
})
export class ContentEditableModel implements OnChanges {
	@Input('inputValue') model: string;
  @Output('inputValueChange') update = new EventEmitter<string>();

	constructor(
    private elRef: ElementRef
  ) {
    this.elRef.nativeElement.spellcheck=false;
  }

  @HostListener('input', ['$event.target.innerText'])
  onInput(text: string) {
    this.update.emit(text);
  }

  @HostListener('blur')
  onBlur() {
    this.update.emit(this.elRef.nativeElement.innerText);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] && changes['model'].currentValue !== this.elRef.nativeElement.innerText) {
      this.elRef.nativeElement.innerText = this.model || '';
    }
  }
}