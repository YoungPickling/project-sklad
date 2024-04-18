import { Image } from './image.model';
import { ItemColumn } from './item-column.model';
import { Company } from './company.model';
import { Supplier } from './supplier.model';

export class Item {
  constructor(
    public id: number,
    public code: string,
    public name: string,
    public image: Image,
    public color: number,
    public columns: ItemColumn[],
    public children: Item[],
    public parents: Item[],
    public quantity: Map<number, number>, // Adjust the type if necessary
    public company: Company,
    public supplier: Supplier,
    public description: string
  ) {}
}