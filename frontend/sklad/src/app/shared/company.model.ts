import { Image } from './image.model';
import { User } from './user.model';
import { Location } from './location.model';
import { Item } from './item.model';
import { Supplier } from './supplier.model';
import { CompanyLog } from './company-log.model';

export class Company {
  constructor(
    public id: number,
    public name: string, 
    public image: Image,
    public user: User[],
    public imageData: Image[],
    public locations: Location[],
    public items: Item[],
    public suppliers: Supplier[],
    public log: CompanyLog[],
    public description: string
  ) {}
}