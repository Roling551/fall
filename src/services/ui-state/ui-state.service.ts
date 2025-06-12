import { Injectable, signal, Type, ViewContainerRef } from "@angular/core";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { KeyValuePair } from "../../models/key-value-pair";
import { Coordiante } from "../../models/coordinate";
import { Tile } from "../../models/tile";
import { ActionsListComponent } from "../../feature/actions-list/actions-list.component";
import { getAddTileToCityAction, getCityUI, getCreateCityUI } from "./common-ui-settings";
import { WorldStateService } from "../world-state.service";

export type UISettings = {
    component: Type<any>;
    inputs?: any;
    additionalInfo?: any;
    mapAction?: any;
    tileInfo?: Type<any>;
    doRenderTileInfoFunction?: (tile: KeyValuePair<Coordiante, Tile>) => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UIStateService {

  private viewContainerRef!: ViewContainerRef;

  private _mapAction = createForceSignal(this.getDefaultMapFunction(this))
  private _tileInfo = createForceSignal<null|Type<any>>(null);
  private _doRenderTileInfoFunction = createForceSignal<(tile: KeyValuePair<Coordiante, Tile>) => boolean>((t)=>false);
  private _additionalInfo = createForceSignal<any>(null);

  public mapAction = this._mapAction.get;
  public tileInfo = this._tileInfo.get
  public doRenderTileInfoFunction = this._doRenderTileInfoFunction.get
  public additionalInfo = this._additionalInfo.get

  constructor(public worldStateService: WorldStateService) {}

  setContainerRef(vcRef: ViewContainerRef) {
    this.viewContainerRef = vcRef;
  }

  setUI(ui:UISettings) {
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
      this._mapAction.set(this.getDefaultMapFunction(this))
    }
    this._mapAction.forceUpdate()
    this.viewContainerRef.clear();

    this._additionalInfo.set(ui.additionalInfo)
    if(ui.inputs) {
      const compRef = this.viewContainerRef.createComponent(ui.component, ui.inputs);
      Object.assign(compRef.instance, ui.inputs);
      compRef.changeDetectorRef.detectChanges();
    }
    else {
      this.viewContainerRef.createComponent(ui.component);
    }
  }

  setMapAction(mapAction: any, updateAdditionalInfo: any) {
    this._additionalInfo.set({...this._additionalInfo.get(), ...updateAdditionalInfo})
    this._mapAction.set(mapAction)
  }

  private getDefaultMapFunction(service: UIStateService) {
    return (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>) => {
      if(tile.get().value.mapEntity) {
        this.setUI_.city(tile)
      }
    }
  }

  clearAction() {
    this.setUI({component:ActionsListComponent})
  }

  public setUI_ = {
    city: (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>) => this.setUI(getCityUI(tile, this.worldStateService)),
    createCity: () => this.setUI(getCreateCityUI(this.worldStateService))
  }

  public setMapAction_ = {
    addTileToCity: () => this.setMapAction(getAddTileToCityAction(this._additionalInfo.get()["cityTile"]), {currentAction: "addTileToCity"})
  }
}