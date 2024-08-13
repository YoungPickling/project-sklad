import { Image } from './image.model';
import { Company } from './company.model';

export class User {
  constructor(
    public id: number,
    public firstname: string,
    public lastname: string,
    public username: string,
    public image?: Image,
    public company?: Company[],
    public email?: string,
    public role?: string,
    public registrationDate?: string
  ) {}
}