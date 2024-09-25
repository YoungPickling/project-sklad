import { Image } from './image.model';
import { Company } from './company.model';

export class Location {
  constructor(
    public id: number,
    public name: string,
    public image: Image,
    public street_and_number: string,
    public city_or_town: string,
    public country_code: string,
    public postal_code: string,
    public phone_number: string,
    public phone_number_two: string,
    public description: string,
    public owner?: Company
  ) {}
}