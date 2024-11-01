import { Image } from './image.model';
import { ItemColumn } from './item-column.model';
import { Company } from './company.model';
import { Supplier } from './supplier.model';
import { Group } from './group.model';

export class Item {
  constructor(
    public id: number,
    public code?: string,
    public name?: string,
    public image?: Image,
    public color?: number,
    public columns?: ItemColumn[],
    public parents?: Map<number, number> | any, // key: item id, value: quantity
    public quantity?: Map<number, number> | any, // key: location id, value: quantity
    public company?: Company,
    public suppliers?: Supplier[],
    public product?: boolean,
    public description?: string,
    public itemGroups?: Group[]
  ) {}
}