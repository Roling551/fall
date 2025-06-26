import { Injectable } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { Estate } from "../models/estate";

@Injectable({
  providedIn: 'root'
})
export class AvaliableService {
    estates_ = createForceSignal<Map<string, (()=>Estate)>>(new Map())
    estates = this.estates_.get
    addAvaliabeEstate(name: string, estateFunction:()=>Estate) {
        this.estates_.get().set(name, estateFunction)
        this.estates_.forceUpdate()
    }
}