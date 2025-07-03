import { Injectable, signal, Type, ViewContainerRef } from "@angular/core";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { KeyValuePair } from "../../models/key-value-pair";
import { Coordiante } from "../../models/coordinate";
import { Tile } from "../../models/tile";
import { ActionsListComponent } from "../../feature/actions-list/actions-list.component";
import { getAddTileToCityAction, getCreateCityUI, getCreateEstateAction, getMoveUnitsAction, getRemoveCityUI, getRemoveEstateAction, getTileUI } from "./common-ui-settings";
import { WorldStateService } from "../world-state.service";
import { Estate } from "../../models/estate";
import { BonusesService } from "../bonuses.service";
import { getBattleMode, getMainMode } from "./common-ui-mode-settings";
import { Unit } from "../../models/unit";

export type UIModeSettings = {
  headerComponent: Type<any>
  defaultSideComponent?: Type<any>;
}

export type UISettings = {
  sideComponent?: Type<any>;
  sideComponentInputs?: any;
  additionalInfo?: any;
  mapAction?: any;
  cancelButtonAction?: any;
  tileInfo?: Type<any>;
  doRenderTileInfoFunction?: (tile: KeyValuePair<Coordiante, Tile>) => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UIStateService {

  private viewSideContainerRef!: ViewContainerRef;
  private viewHeaderContainerRef!: ViewContainerRef;

  private _ui?: UISettings
  private _uiMode?: UIModeSettings

  private _mapAction = createForceSignal(this.getDefaultMapFunction(this))
  private _cancelButtonAction = createForceSignal(this.getDefaultCancelButtonAction())
  private _tileInfo = createForceSignal<null|Type<any>>(null);
  private _doRenderTileInfoFunction = createForceSignal<(tile: KeyValuePair<Coordiante, Tile>) => boolean>((t)=>false);
  private _additionalInfo = createForceSignal<any>(null);

  public mapAction = this._mapAction.get;
  public cancelButtonAction = this._cancelButtonAction.get
  public tileInfo = this._tileInfo.get
  public doRenderTileInfoFunction = this._doRenderTileInfoFunction.get
  public additionalInfo = this._additionalInfo.get

  constructor(public worldStateService: WorldStateService, public bonusesService: BonusesService) {}

  setSideContainerRef(vcRef: ViewContainerRef) {
    this.viewSideContainerRef = vcRef;
  }

  setHeaderContainerRef(vcRef: ViewContainerRef) {
    this.viewHeaderContainerRef = vcRef;
  }

  setUI(ui:UISettings) {
    this._ui = ui

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

    if(ui.cancelButtonAction) {
      this._cancelButtonAction.set(ui.cancelButtonAction)
    } else {
      this._cancelButtonAction.set(this.getDefaultCancelButtonAction())
    }
    this._cancelButtonAction.forceUpdate()

    this.viewSideContainerRef.clear();

    this._additionalInfo.set(ui.additionalInfo)

    if(ui.sideComponentInputs) {
      const compRef = this.viewSideContainerRef.createComponent(ui.sideComponent!, ui.sideComponentInputs);
      Object.assign(compRef.instance, ui.sideComponentInputs);
      compRef.changeDetectorRef.detectChanges();
    }
    else {
      this.viewSideContainerRef.createComponent(ui.sideComponent!);
    }
  }

  setUIMode(uiModeSettings: UIModeSettings) {
    this.cancel();
    this._uiMode = uiModeSettings
    this.viewSideContainerRef.clear();
    if(uiModeSettings.defaultSideComponent){
      this.viewSideContainerRef.createComponent(uiModeSettings.defaultSideComponent);
    }
    this.viewHeaderContainerRef.clear();
    this.viewHeaderContainerRef.createComponent(uiModeSettings.headerComponent);
  }

  setMapAction(ui:UISettings, goBack = true) {
    this._additionalInfo.set({...this._additionalInfo.get(), ...ui.additionalInfo})
    this._mapAction.set(ui.mapAction)
    if(goBack) {
      this._cancelButtonAction.set(()=>{
        if(ui.cancelButtonAction) {
          ui.cancelButtonAction()
        }
        this.setUI(this._ui!)}
      )
    } else {
      this._cancelButtonAction.set(ui.cancelButtonAction)
    }
  }

  private getDefaultMapFunction(service: UIStateService) {
    return (tile: KeyValuePair<Coordiante, Tile>) => {
      this.setUI_.tile(tile)
    }
  }

  public cancel() {
    if(this.cancelButtonAction && this.cancelButtonAction()) {
      this.cancelButtonAction()()
    }
  }

  public getDefaultCancelButtonAction() {
    return () => {
      if(this._uiMode && this._uiMode!.defaultSideComponent) {
        this.setUI({sideComponent:this._uiMode!.defaultSideComponent})
      }
    }
  }

  public setUI_ = {
    tile: (tile: KeyValuePair<Coordiante, Tile>, selectedUnits?: Set<Unit>) => this.setUI(getTileUI(tile, this.worldStateService, selectedUnits)),
    createCity: () => this.setUI(getCreateCityUI(this.worldStateService)),
    removeCity: () => this.setUI(getRemoveCityUI(this.worldStateService)),
  }

  public setMapAction_ = {
    addTileToCity: () => {
      this.setMapAction(getAddTileToCityAction(this._additionalInfo.get()["tile"]))},
    createEstate: (getBuilding: ()=>Estate, buildingName: string) => {
      this.setMapAction(getCreateEstateAction(this.bonusesService, this._additionalInfo.get()["tile"], getBuilding, buildingName))},
    removeEstate: () => {
      this.setMapAction(getRemoveEstateAction(this._additionalInfo.get()["tile"]))},
    moveUnits: (previousTile: KeyValuePair<Coordiante, Tile>, units: Set<Unit>) => {
      this.setMapAction(getMoveUnitsAction(this, previousTile, units))
    }
  }

  public setUIMode_ = {
    main: () => {
      this.setUIMode(getMainMode())
    },
    battle: () => {
      this.setUIMode(getBattleMode())
    }
  }
}