import { Item } from './item.model';

export class ItemColumn {
  constructor(
    public name: string,
    public value?: string,
    public color?: number,
    public width?: number,
    public id?: number,
    public ofTable?: Item
  ) {}
}