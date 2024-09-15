import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Image } from '../models/image.model';
import { environment } from '../../../environments/environment';
import { ImageCacheDirective } from '../directives/image.directive';
import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '../models/item.model';
import Utils from '../utils.service';
import { MatIconModule } from '@angular/material/icon';
import { TreeNode } from '../../workspace/diagrams/tree/tree.component';

export enum AlertPresets {
  addCompany,
  editCompany,
  addGalleryImage,
  showGalleryImage,
  removeItemImage,
  updateItemImage,
  addSupplier,
  addLocation,
  addParents
}

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    ImageCacheDirective,
    MatIconModule
  ],
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, AfterViewInit {
  @Input() isLoading: boolean;
  @Input() preset: AlertPresets;
  @Input() message: string; // deprecated
  @Input() error: HttpErrorResponse;
  @Input() title: string;
  @Input() tempId: number;
  @Input() forEdit: {id?: number, name: string, description: string};
  @Output() close = new EventEmitter<void>();
  @Output() addCompany = new EventEmitter<{name: string, description: string}>();
  @Output() editCompany = new EventEmitter<{name: string, description: string}>();
  @Output() addGalleryImage = new EventEmitter<{ image: File }>();
  @Output() addSupplier = new EventEmitter<{
    name: string, 
    street_and_number: string, 
    city_or_town: string, 
    country: string, 
    postal_code: string, 
    phone_number: string, 
    hone_number_two: string, 
    website?: string, 
    description: string
  }>();
  @Output() addLocation = new EventEmitter<{
    name: string, 
    street_and_number: string, 
    city_or_town: string, 
    country: string, 
    postal_code: string, 
    phone_number: string, 
    hone_number_two: string,
    description: string
  }>();

  @Input() itemSelected: number;
  @Input() parentsMap: Map<number,number>;
  @Output() setParents = new EventEmitter<any>();
  
  @Output() deleteImage = new EventEmitter<void>();
  @Output() confirmDeleteImage = new EventEmitter<void>();
  @Output() removeItemImage = new EventEmitter<number>();
  @Output() setItemImage = new EventEmitter<number>();

  @Input() imageData: Image;
  @Input() imageList: Image[];
  checkedImageId = -1;
  
  @Input() confirmWindow: boolean = false;
  @Input() confirmMessage: string;
  confirmField = '';
  @Output() confirmWindowClose = new EventEmitter<void>();

  @Input() items: Item[];

  ItemAmountMap: Map<number, number>;

  selectedItemChildren: number[] = [];

  link = environment.API_SERVER + "/api/rest/v1/secret/";

  private lastMessage: string;
  private formGroup: FormGroup;

  countries = new Map<string, string>([
    ["AD", "Andorra"],
    ["AE", "United Arab Emirates"],
    ["AF", "Afghanistan"],
    ["AG", "Antigua & Barbuda"],
    ["AI", "Anguilla"],
    ["AL", "Albania"],
    ["AM", "Armenia"],
    ["AN", "Netherlands Antilles"],
    ["AO", "Angola"],
    ["AQ", "Antarctica"],
    ["AR", "Argentina"],
    ["AS", "American Samoa"],
    ["AT", "Austria"],
    ["AU", "Australia"],
    ["AW", "Aruba"],
    ["AX", "Aland Islands"],
    ["AZ", "Azerbaijan"],
    ["BA", "Bosnia & Herzegovina"],
    ["BB", "Barbados"],
    ["BD", "Bangladesh"],
    ["BE", "Belgium"],
    ["BF", "Burkina Faso"],
    ["BG", "Bulgaria"],
    ["BH", "Bahrain"],
    ["BI", "Burundi"],
    ["BJ", "Benin"],
    ["BL", "St. Barthelemy"],
    ["BM", "Bermuda"],
    ["BN", "Bruneia Darussalam"],
    ["BO", "Bolivia"],
    ["BQ", "Bonaire"],
    ["BQ", "Saba"],
    ["BQ", "St. Eustatius"],
    ["BR", "Brazil"],
    ["BS", "Bahamas"],
    ["BT", "Bhutan"],
    ["BV", "Bouvet Island"],
    ["BW", "Botswana"],
    ["BY", "Belarus"],
    ["BZ", "Belize"],
    ["CA", "Canada"],
    ["CC", "Cocos (Keeling) Islands"],
    ["CD", "Democratic Republic of Congo"],
    ["CF", "Central African Republic"],
    ["CG", "Congo"],
    ["CH", "Switzerland"],
    ["CI", "Cote DIvoire"],
    ["CK", "Cook Islands"],
    ["CL", "Chile"],
    ["CM", "Cameroon"],
    ["CN", "China Mainland"],
    ["CO", "Colombia"],
    ["CR", "Costa Rica"],
    ["CS", "Serbia & Montenegro"],
    ["RS", "Serbia"],
    ["ME", "Montenegro"],
    ["CU", "Cuba"],
    ["CV", "Cape Verde"],
    ["CW", "Curacao"],
    ["CX", "Christmas Islands"],
    ["CY", "Cyprus"],
    ["CZ", "Czech Republic"],
    ["DE", "Germany"],
    ["DJ", "Djibouti"],
    ["DK", "Denmark"],
    ["DM", "Dominica"],
    ["DO", "Dominican Republic"],
    ["DZ", "Algeria"],
    ["EC", "Ecuador"],
    ["EE", "Estonia"],
    ["EG", "Egypt"],
    ["EH", "Western Sahara"],
    ["ER", "Eritrea"],
    ["ES", "Spain"],
    ["ET", "Ethiopia"],
    ["FI", "Finland"],
    ["FJ", "Fiji"],
    ["FK", "Falkland Island (Malvinas)"],
    ["FM", "Micronesia (Federated States of)"],
    ["FO", "Faroe Islands"],
    ["FR", "France"],
    ["GA", "Gabon"],
    ["GB", "United Kingdom"],
    ["GD", "Grenada"],
    ["GE", "Georgia"],
    ["GF", "French Guiana"],
    ["GG", "Guernsey"],
    ["GH", "Ghana"],
    ["GI", "Gibraltar"],
    ["GL", "Greenland"],
    ["GM", "Gambia"],
    ["GN", "Guinea"],
    ["GP", "Guadeloupe"],
    ["GQ", "Equatorial Guinea"],
    ["GR", "Greece"],
    ["GS", "South Georgia & South Sandwich Is."],
    ["GT", "Guatemala"],
    ["GU", "Guam"],
    ["GW", "Guinea-Bissau"],
    ["GY", "Guyana"],
    ["HK", "Hong Kong SAR, China"],
    ["HM", "Heard Island & McDonald Islands"],
    ["HN", "Honduras"],
    ["HR", "Croatia"],
    ["HT", "Haiti"],
    ["HU", "Hungary"],
    ["ID", "Indonesia"],
    ["IE", "Ireland"],
    ["IL", "Israel"],
    ["IM", "Isle of Man"],
    ["IN", "India"],
    ["IO", "British Indian Ocean Territory"],
    ["IQ", "Iraq"],
    ["IR", "Iran (Islamic Republic of)"],
    ["IS", "Iceland"],
    ["IT", "Italy"],
    ["JE", "Jersey"],
    ["JM", "Jamaica"],
    ["JO", "Jordan"],
    ["JP", "Japan"],
    ["KE", "Kenya"],
    ["KG", "Kyrgyzstan"],
    ["KH", "Cambodia"],
    ["KI", "Kiribati"],
    ["KM", "Comoros"],
    ["KN", "Saint Kitts & Nevis"],
    ["KP", "Korea, Democratic Peoples Republic"],
    ["KR", "Korea, Republic of"],
    ["KV", "Kosovo"],
    ["KW", "Kuwait"],
    ["KY", "Cayman Islands"],
    ["KZ", "Kazakhstan"],
    ["LA", "Lao Peoples Democratic Republic"],
    ["LB", "Lebanon"],
    ["LC", "Saint Lucia"],
    ["LI", "Liechtenstein"],
    ["LK", "Sri Lanka"],
    ["LR", "Liberia"],
    ["LS", "Lesotho"],
    ["LT", "Lithuania"],
    ["LU", "Luxembourg"],
    ["LV", "Latvia"],
    ["LY", "Libyan Arab Jamahiriya"],
    ["MA", "Morocco"],
    ["MC", "Monaco"],
    ["MD", "Moldova, Republic of"],
    ["ME", "Montenegro"],
    ["MG", "Madagascar"],
    ["MH", "Marshall Islands"],
    ["MK", "Former Yugoslavia Republic of Macedonia (FYROM)"],
    ["ML", "Mali"],
    ["MM", "Myanmar"],
    ["MN", "Mongolia"],
    ["MO", "Macau SAR, China"],
    ["MP", "Northern Mariana Islands"],
    ["MQ", "Martinique"],
    ["MR", "Mauritania"],
    ["MS", "Montserrat"],
    ["MT", "Malta"],
    ["MU", "Mauritius"],
    ["MV", "Maldives"],
    ["MW", "Malawi"],
    ["MX", "Mexico"],
    ["MY", "Malaysia"],
    ["MZ", "Mozambique"],
    ["NA", "Namibia"],
    ["NC", "New Caledonia"],
    ["NE", "Niger"],
    ["NF", "Norfolk Island"],
    ["NG", "Nigeria"],
    ["NI", "Nicaragua"],
    ["NL", "Netherlands"],
    ["NO", "Norway"],
    ["NP", "Nepal"],
    ["NR", "Nauru"],
    ["NU", "Niue"],
    ["NZ", "New Zealand"],
    ["OM", "Oman"],
    ["PA", "Panama"],
    ["PE", "Peru"],
    ["PF", "French Polynesia"],
    ["PG", "Papua New Guinea"],
    ["PH", "Philippines"],
    ["PK", "Pakistan"],
    ["PL", "Poland"],
    ["PM", "Saint Pierre & Miquelon"],
    ["PN", "Pitcairn"],
    ["PR", "Puerto Rico"],
    ["PS", "Occupied Palestinian Territory"],
    ["PT", "Portugal"],
    ["PW", "Palau"],
    ["PY", "Paraguay"],
    ["QA", "Qatar"],
    ["RE", "Reunion"],
    ["RO", "Romania"],
    ["RS", "Serbia"],
    ["RU", "Russian Federation"],
    ["RW", "Rwanda"],
    ["SA", "Saudi Arabia"],
    ["SB", "Solomon Islands"],
    ["SC", "Seychelles"],
    ["SD", "Sudan"],
    ["SE", "Sweden"],
    ["SG", "Singapore"],
    ["SH", "Saint Helena"],
    ["SI", "Slovenia"],
    ["SJ", "Svalbard & Jan Mayen"],
    ["SK", "Slovakia"],
    ["SL", "Sierra Leone"],
    ["SM", "San Marino"],
    ["SN", "Senegal"],
    ["SO", "Somalia"],
    ["SR", "Suriname"],
    ["ST", "Sao Tome & Principe"],
    ["SV", "El Salvador"],
    ["SX", "St. Maarten"],
    ["SX", "St. Martin (French)"],
    ["SY", "Syrian Arab Republic"],
    ["SZ", "Swaziland"],
    ["TC", "Turks & Caicos Islands"],
    ["TD", "Chad"],
    ["TF", "French Southern Territories"],
    ["TG", "Togo"],
    ["TH", "Thailand"],
    ["TJ", "Tajikistan"],
    ["TK", "Tokelau"],
    ["TL", "Timor-Leste"],
    ["TM", "Turkmenistan"],
    ["TN", "Tunisia"],
    ["TO", "Tonga"],
    ["TP", "East Timor"],
    ["TR", "Turkey"],
    ["TT", "Trinidad & Tobago"],
    ["TV", "Tuvalu"],
    ["TW", "Taiwan, China"],
    ["TZ", "Tanzania, United Republic of"],
    ["UA", "Ukraine"],
    ["UG", "Uganda"],
    ["US", "United States"],
    ["UY", "Uruguay"],
    ["UZ", "Uzbekistan"],
    ["VA", "Vatican City State (Holy See)"],
    ["VC", "Saint Vincent & The Grenadines"],
    ["VE", "Venezuela"],
    ["VG", "Virgin Islands (British)"],
    ["VI", "Virgin Islands (U.S.)"],
    ["VI", "St. Croix"],
    ["VN", "Viet Nam"],
    ["VU", "Vanuatu"],
    ["WF", "Wallis & Futuna Islands"],
    ["WS", "Samoa"],
    ["YE", "Yemen"],
    ["YT", "Mayotte"],
    ["ZA", "South Africa"],
    ["ZM", "Zambia"],
    ["ZW", "Zimbabwe"],
  ]);

  ngOnInit() {
    this.lastMessage = this.message;

    this.ngAfterViewInit()

    // if(this.preset === 'addCompany' || this.preset === 'editCompany') {
    if(this.preset === AlertPresets.addCompany || this.preset === AlertPresets.editCompany) {
      this.formGroup = new FormGroup({
        // 'companyData': new FormGroup({
          'name': new FormControl(null, [Validators.required]),
          'description': new FormControl(null, [Validators.required])
        // })
      });
      // if (this.preset === 'editCompany' && this.forEdit) {
      if (this.preset === AlertPresets.editCompany && this.forEdit) {
        this.formGroup.patchValue(this.forEdit);
      }
    } else if (this.preset === AlertPresets.addGalleryImage) {
      this.formGroup = new FormGroup({
        'image': new FormControl(null, [Validators.required])
      });
    } else if (this.preset === AlertPresets.addSupplier) {
      this.formGroup = new FormGroup({
        'name': new FormControl(null, [Validators.required]),
        'street_and_number': new FormControl(null),
        'city_or_town': new FormControl(null),
        'country_code': new FormControl("LT"),
        'postal_code': new FormControl(null),
        'phone_number': new FormControl(null),
        'phone_number_two': new FormControl(null),
        'website': new FormControl(null),
        'description': new FormControl(null)
      });
    }  else if (this.preset === AlertPresets.addLocation) {
      this.formGroup = new FormGroup({
        'name': new FormControl(null, [Validators.required]),
        'street_and_number': new FormControl(null),
        'city_or_town': new FormControl(null),
        'country_code': new FormControl("LT"),
        'postal_code': new FormControl(null),
        'phone_number': new FormControl(null),
        'phone_number_two': new FormControl(null),
        'description': new FormControl(null)
      });
    }
  }

  ngAfterViewInit() {
    /*
    if(this.items) {
      this.ItemAmountMap = new Map<number, number>();
   
      if(this.parentsMap) {
        this.items.forEach(x => {
          if(this.parentsMap[x.id])
            this.ItemAmountMap.set(x.id, this.parentsMap[x.id]);
          else
            this.ItemAmountMap.set(x.id, 0);
        });
      } else {
        this.items.forEach(x => this.ItemAmountMap.set(x.id, 0));
      }
      this.ItemAmountMap.delete(this.itemSelected);
    }
    */

    if(this.items) {
      this.ItemAmountMap = new Map<number, number>();

      if(this.parentsMap) {
        this.items.forEach(x => {
          if(this.parentsMap[x.id])
            this.ItemAmountMap.set(x.id, this.parentsMap[x.id]);
          else
            this.ItemAmountMap.set(x.id, 0);
        });
      } else {
        this.items.forEach(x => this.ItemAmountMap.set(x.id, 0));
      }

      this.selectedItemChildren = [this.itemSelected];
      let iterate: boolean;
      let iterateTimes = 20;

      do {
        if(iterateTimes < 1) {
          console.error("Stockoverflow")
          break;
        }
          
        iterate = false;

        for(let item of this.items.filter((x) => !this.selectedItemChildren.includes(x.id))) {
          Object.entries(item.parents)?.forEach((map) => 
            {
              if(this.selectedItemChildren.includes(+map[0])) {
                this.selectedItemChildren.push(item.id);
                iterate = true;
                iterateTimes--;
              }
            }
          );
        }
      } while(iterate)
      this.ItemAmountMap.delete(this.itemSelected);
    }
  }

  allowEditParrent(id: number): boolean {
    // if(id === this.itemSelected) {
    //   return false
    // }
    return !this.selectedItemChildren.includes(id);
  }

  inputValidation(s: string) {
    return !this.formGroup.get(s).valid && this.formGroup.get(s).touched;
  }

  checkInvalid(s: string, fieldName: string) {
    return this.formGroup.get(fieldName).errors[s];
  }

  onSubmit() {
    switch(this.preset) { 
      case AlertPresets.addCompany: { 
        this.addCompany.emit(this.formGroup.value); 
        break; 
      } 
      case AlertPresets.editCompany: { 
        this.editCompany.emit(this.formGroup.value);
        break; 
      } 
      case AlertPresets.addGalleryImage: { 
        const imageFile = this.formGroup.get('image').value;
        this.addGalleryImage.emit({ image: imageFile }); 
        break; 
      } 
      case AlertPresets.addSupplier: { 
        this.addSupplier.emit(this.formGroup.value);
        break;  
      } 
      case AlertPresets.addLocation: { 
        this.addLocation.emit(this.formGroup.value);
        break;  
      } 
    } 
  }

  onCloseError() {
    this.lastMessage = this.message;
  }

  onClose() {
    this.close.emit();
  }

  isAddCompay() {
    return this.preset == AlertPresets.addCompany;
  }

  isEditCompay() {
    return this.preset == AlertPresets.editCompany;
  }

  isAddImage() {
    return this.preset == AlertPresets.addGalleryImage;
  }

  isShowImage() {
    return this.preset == AlertPresets.showGalleryImage;
  }
  
  isRemoveItemImage() {
    return this.preset == AlertPresets.removeItemImage;
  }

  isUpdateItemImage() {
    return this.preset == AlertPresets.updateItemImage;
  }

  isAddSupplier() {
    return this.preset == AlertPresets.addSupplier;
  }

  isAddLocation() {
    return this.preset == AlertPresets.addLocation;
  }

  isAddParent() {
    return this.preset == AlertPresets.addParents;
  }

  uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.formGroup.patchValue({ image: file });
      this.formGroup.get('image').updateValueAndValidity();
    }
  }

  onDeleteImage() {
    this.deleteImage.emit();
  }
  
  onConfirmDeleteImage() {
    this.confirmDeleteImage.emit();
  }

  onRemoveItemImage() {
    this.isLoading = true;
    this.removeItemImage.emit();
  }

  getQuantity(itemId: number): number {
    return this.ItemAmountMap.get(itemId) || 0;
  }

  setQuantity(itemId: number, value: number): void {
    this.ItemAmountMap.set(itemId, value);
  }

  onSetParents() {
    for (let [key, value] of this.ItemAmountMap.entries()) {
      if (value === 0 || value === null)
        this.ItemAmountMap.delete(key);
    }

    const plainObject = {};
    this.ItemAmountMap.forEach((value, key) => {
      plainObject[key] = value;
    });
    
    console.log(plainObject);
    this.setParents.emit(plainObject);
  }

  onFilter(): Image[] {
    return this.imageList.filter(image => image.name.toLowerCase().indexOf(this.confirmField.trim().toLowerCase()) !== -1 );
  }

  colorByOrder(i: number): string {
    return Utils.colorByOrder(i);
  }

  onSetItemImage() {
    this.isLoading = true;
    this.setItemImage.emit(this.checkedImageId);
    this.checkedImageId = -1;
  }
}
