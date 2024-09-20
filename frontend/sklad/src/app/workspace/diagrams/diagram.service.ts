import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface NodeSelectParams {
  modifyAmount: number;
  minModifyAmount: number | null;
  assembleAmount: number;
  maxAssembleAmount: number | null;
  minAssembleAmount: number | null;
  itemParents: number[] | null;
}

export const EMPTY_PARAMS = {
  modifyAmount: 0, 
  minModifyAmount: 0, 
  assembleAmount: 0, 
  maxAssembleAmount: null, 
  minAssembleAmount: null,
  itemParents: []
}

@Injectable({providedIn: 'root'})
export class DiagramService {
  editItem = new BehaviorSubject<number | null>(null);

  params = new BehaviorSubject<NodeSelectParams>(EMPTY_PARAMS);

  // modifyAmount = new BehaviorSubject<number>(0);
  // assembleAmount = new BehaviorSubject<number>(0);
  // maxAssembleAmount = new BehaviorSubject<number | null>(null);
  // minAssembleAmount = new BehaviorSubject<number | null>(null);
}