import { Company } from "./company.model";

export class Image {
  constructor(
    public id: number,
    public name: string,
    public hash: string,
    public type: string,
    public size: number,
    public compressedSize: number,
    public ownedByCompany: Company,
  ) {}
}
