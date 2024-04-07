import { Item } from './item.model';

export class ItemColumn {
  constructor(
    public id: number,
    public name: string,
    public ofTable: Item,
    public value: string,
    public color: number,
    public width: number
  ) {}
}