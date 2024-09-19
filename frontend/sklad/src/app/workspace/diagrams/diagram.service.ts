import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: 'root'})
export class DiagramService {
  editItem = new BehaviorSubject<number | null>(null);
  modifyAmount = new BehaviorSubject<number>(0);
  assembleAmount = new BehaviorSubject<number>(0);
  maxAssembleAmount = new BehaviorSubject<number | null>(null);
  minAssembleAmount = new BehaviorSubject<number | null>(null);
}