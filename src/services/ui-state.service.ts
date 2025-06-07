import { Injectable, signal, Type, ViewContainerRef } from "@angular/core";
import { forceSignal } from "../util/force-signal";
import { KeyValuePair } from "../models/key-value-pair";
import { Coordiante } from "../models/coordinate";
import { Tile } from "../models/tile";

@Injectable({
  providedIn: 'root'
})
export class UIStateService {
  public mapTileAction = signal(this.defaultMapFunction)

  private viewContainerRef!: ViewContainerRef;

  setContainerRef(vcRef: ViewContainerRef) {
    this.viewContainerRef = vcRef;
  }

  renderComponent(component: Type<any>) {
    this.viewContainerRef.clear();
    this.viewContainerRef.createComponent(component);
  }

  defaultMapFunction(tile: KeyValuePair<Coordiante, Tile>) {
    console.log(tile.value.terrainType)
  }

  clearMapFunction() {
    this.mapTileAction.set(this.defaultMapFunction)
  }
}