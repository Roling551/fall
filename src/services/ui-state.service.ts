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
  private _mapAction = forceSignal(this.defaultMapFunction)
  private viewContainerRef!: ViewContainerRef;
  private _tileInfo = forceSignal<null|Type<any>>(null);
  private _doRenderTileInfoFunction = forceSignal<(tile: KeyValuePair<Coordiante, Tile>) => boolean>((t)=>false);

  public mapAction = this._mapAction.readonly;
  public tileInfo = this._tileInfo.readonly
  public doRenderTileInfoFunction = this._doRenderTileInfoFunction.readonly

  setContainerRef(vcRef: ViewContainerRef) {
    this.viewContainerRef = vcRef;
  }

  setUI(ui:{
      component: Type<any>; 
      inputs?: any; 
      mapAction?: any, 
      tileInfo?: Type<any>,
      doRenderTileInfoFunction?: (tile: KeyValuePair<Coordiante, Tile>) => boolean,
  }) {
    if(ui.doRenderTileInfoFunction) {
      this._doRenderTileInfoFunction.set(ui.doRenderTileInfoFunction)
    } else {
      this._doRenderTileInfoFunction.set((t)=>false)
    }
    this._doRenderTileInfoFunction.forceUpdate()

    if(ui.tileInfo) {
      this._tileInfo.set(ui.tileInfo)
    } else {
      this._tileInfo.set(null)
    }
    this._tileInfo.forceUpdate()

    if(ui.mapAction) {
      this._mapAction.set(ui.mapAction)
    } else {
      this._mapAction.set(this.defaultMapFunction)
    }
    this._mapAction.forceUpdate()
    this.viewContainerRef.clear();
    if(ui.inputs) {
      const compRef = this.viewContainerRef.createComponent(ui.component, ui.inputs);
      Object.assign(compRef.instance, ui.inputs);
      compRef.changeDetectorRef.detectChanges();
    }
    else {
      this.viewContainerRef.createComponent(ui.component);
    }
  }

  defaultMapFunction(tile: KeyValuePair<Coordiante, Tile>) {
    console.log(tile.value.terrainType)
  }

  clearAction() {
    this.setUI({component:ActionsListComponent})
  }
}