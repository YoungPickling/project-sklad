import { Image } from './image.model';
import { Company } from './company.model';

export class Location {
  constructor(
    public id: number,
    public name: string,
    public image: Image,
    public streetAndNumber: string,
    public cityOrTown: string,
    public countryCode: string,
    public postalCode: string,
    public phoneNumber: string,
    public phoneNumberTwo: string,
    public description: string,
    public owner: Company
  ) {}
}