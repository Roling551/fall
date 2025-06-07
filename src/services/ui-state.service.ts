import { Injectable, signal, Type, ViewContainerRef } from "@angular/core";
import { forceSignal } from "../util/force-signal";
import { KeyValuePair } from "../models/key-value-pair";
import { Coordiante } from "../models/coordinate";
import { Tile } from "../models/tile";
import { ActionsListComponent } from "../feature/actions-list/actions-list.component";

@Injectable({
  providedIn: 'root'
})
export class UIStateService {
  public mapAction = signal(this.defaultMapFunction)

  private viewContainerRef!: ViewContainerRef;

  setContainerRef(vcRef: ViewContainerRef) {
    this.viewContainerRef = vcRef;
  }

  setAction(component: Type<any>, inputs?: any, mapAction?: any) {
    if(mapAction) {
      this.mapAction.set(mapAction)
    } else {
      this.mapAction.set(this.defaultMapFunction)
    }
    this.viewContainerRef.clear();
    if(inputs) {
      console.log(inputs)
      const compRef = this.viewContainerRef.createComponent(component, inputs);
      Object.assign(compRef.instance, inputs);
      compRef.changeDetectorRef.detectChanges();
    }
    else {
      this.viewContainerRef.createComponent(component);
    }
  }

  defaultMapFunction(tile: KeyValuePair<Coordiante, Tile>) {
    console.log(tile.value.terrainType)
  }

  clearAction() {
    this.setAction(ActionsListComponent)
  }
}