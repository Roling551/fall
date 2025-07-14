import { Injectable, Signal } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { Estate } from "../models/estate";
import { Extraction } from "../models/extraction";
import { WorldStateService } from "./world-state.service";

@Injectable({
  providedIn: 'root'
})
export class AvaliableService {

  constructor(public worldStateService: WorldStateService) {}

  estates_ = createForceSignal<Map<string, (()=>Estate)>>(new Map())
  estates = this.estates_.get
  
  addAvaliabeEstate(name: string, estateFunction:()=>Estate) {
      this.estates_.get().set(name, estateFunction)
      this.estates_.forceUpdate()
  }

  extractions_ = createForceSignal(new Map<string, ()=>Extraction>())
  extractions = this.extractions_.get

  addAvaliableExtraction(name: string, extractionFucntion:()=>Extraction) {
    this.extractions_.get().set(name, extractionFucntion)
    this.extractions_.forceUpdate()
  }
}