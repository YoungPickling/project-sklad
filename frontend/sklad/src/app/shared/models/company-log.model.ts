import { Company } from "./company.model";

export class CompanyLog {
  constructor(
    public id: number,
    public userId: number,
    public firstname: string,
    public lastname: string,
    public username: string,
    public company: Company,
    public action: string,
    public registrationDate: Date
  ) {}
}