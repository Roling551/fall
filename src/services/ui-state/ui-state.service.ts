import { computed, effect, Injectable, signal, Type, untracked, ViewContainerRef } from "@angular/core";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { KeyValuePair } from "../../models/key-value-pair";
import { Coordiante } from "../../models/coordinate";
import { Tile } from "../../models/tile";
import { ActionsListComponent } from "../../feature/actions-list/actions-list.component";
import { getAddExtractionAction, getAddTileToCityAction, getCreateCityUI, getCreateEstateAction, getMoveUnitsAction, getMoveUnitsBattleAction, getRemoveCityUI, getRemoveEstateAction, getTileUI } from "./common-ui-settings";
import { WorldStateService } from "../world-state.service";
import { Estate } from "../../models/estate";
import { BonusesService } from "../bonuses.service";
import { getBattleMode, getMainMode } from "./common-ui-mode-settings";
import { Unit } from "../../models/unit";
import { BattleService } from "../battle.service";
import { Extraction } from "../../models/extraction";
import { BenefitsService } from "../benefits.service";

export type UIModeName = "main" | "battle"

export type UIModeSettings = {
  name: UIModeName
  headerComponent: Type<any>;
  defaultSideComponent?: Type<any>;
}

export type UISettings = {
  sideComponent?: Type<any>;
  sideComponentInputs?: any;
  additionalInfo?: any;
  mapAction?: (tile: KeyValuePair<Coordiante, Tile>)=>void;
  cancelButtonAction?: any;
  tileInfo?: Type<any>;
  tileInfoInput?: any;
  doRenderTileInfoFunction?: (tile: KeyValuePair<Coordiante, Tile>) => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UIStateService {

  private viewSideContainerRef!: ViewContainerRef;
  private viewHeaderContainerRef!: ViewContainerRef;

  public _ui?: UISettings
  private _uiMode?: UIModeSettings
  private _previousUis: UISettings[] = []

  private _mapAction = createForceSignal(this.getDefaultMapFunction(this))
  private _cancelButtonAction = createForceSignal(()=>{})
  private _tileInfo = createForceSignal<undefined|Type<any>>(undefined);
  private _tileInfoInput = createForceSignal<Record<string, any>>({});
  private _doRenderTileInfoFunction = createForceSignal<(tile: KeyValuePair<Coordiante, Tile>) => boolean>((t)=>false);
  private _additionalInfo = createForceSignal<any>(null);

  public mapAction = this._mapAction.get;
  public cancelButtonAction = this._cancelButtonAction.get
  public tileInfo = this._tileInfo.get
  public tileInfoInput = this._tileInfoInput.get
  public doRenderTileInfoFunction = this._doRenderTileInfoFunction.get
  public additionalInfo = this._additionalInfo.get

  public uiModeName = signal<UIModeName>("main")

  constructor(
    public worldStateService: WorldStateService,
    public bonusesService: BonusesService,
    public benefitsService: BenefitsService,
    public battleService: BattleService
  ) {}

  setSideContainerRef(vcRef: ViewContainerRef) {
    this.viewSideContainerRef = vcRef;
  }

  setHeaderContainerRef(vcRef: ViewContainerRef) {
    this.viewHeaderContainerRef = vcRef;
  }

  setUI(ui:UISettings, override=false) {
    
    if(override) {
      this._previousUis = []
    } else if(this._ui) {
      this._previousUis.push(this._ui)
    }

    this._ui = ui

    if(override) {
      this._setUIOverride(this._ui)
    } else {
      this._setUIUpdate(this._ui)
    }
  }

  _setUIOverride(ui:UISettings) {

    this._additionalInfo.set(ui.additionalInfo)
    this._doRenderTileInfoFunction.set(ui.doRenderTileInfoFunction || ((t)=>false))
    this._doRenderTileInfoFunction.forceUpdate()

    this._tileInfo.set(ui.tileInfo)
    this._tileInfo.forceUpdate()

    this._mapAction.set(ui.mapAction || this.getDefaultMapFunction(this))
    this._mapAction.forceUpdate()

    this._cancelButtonAction.set(ui.cancelButtonAction || (()=>{}))
    this._cancelButtonAction.forceUpdate()

    this._tileInfoInput.set(ui.tileInfoInput || {})
    this._tileInfoInput.forceUpdate()

    if(ui.sideComponentInputs) {
      this.viewSideContainerRef.clear();
      const compRef = this.viewSideContainerRef.createComponent(ui.sideComponent!, ui.sideComponentInputs);
      Object.assign(compRef.instance, ui.sideComponentInputs);
      compRef.changeDetectorRef.detectChanges();
    }
    else {
      this.viewSideContainerRef.clear();
      this.viewSideContainerRef.createComponent(ui.sideComponent!);
    }
  }

  _setUIUpdate(ui:UISettings) {

    this._additionalInfo.set({...this._additionalInfo.get(), ...ui.additionalInfo})
    if(ui.doRenderTileInfoFunction) {
      this._doRenderTileInfoFunction.set(ui.doRenderTileInfoFunction)
      this._doRenderTileInfoFunction.forceUpdate()
    }

    if(ui.tileInfo) {
      this._tileInfo.set(ui.tileInfo)
      this._tileInfo.forceUpdate()
    }

    this._mapAction.set(ui.mapAction || this.getDefaultMapFunction(this))
    this._mapAction.forceUpdate()

    this._cancelButtonAction.set(ui.cancelButtonAction || (()=>{}))
    this._cancelButtonAction.forceUpdate()

    if(ui.tileInfoInput) {
      this._tileInfoInput.set(ui.tileInfoInput)
    }
    this._tileInfoInput.forceUpdate()

    if(ui.sideComponentInputs) {
      this.viewSideContainerRef.clear();
      const compRef = this.viewSideContainerRef.createComponent(ui.sideComponent!, ui.sideComponentInputs);
      Object.assign(compRef.instance, ui.sideComponentInputs);
      compRef.changeDetectorRef.detectChanges();
    }
  }

  setUIMode(uiModeSettings: UIModeSettings) {
    this.cancel();
    this._uiMode = uiModeSettings
    this.uiModeName.set(uiModeSettings.name)
    this.viewSideContainerRef.clear();
    if(uiModeSettings.defaultSideComponent){
      this.viewSideContainerRef.createComponent(uiModeSettings.defaultSideComponent);
    }
    this.viewHeaderContainerRef.clear();
    this.viewHeaderContainerRef.createComponent(uiModeSettings.headerComponent);
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
    if(this._previousUis.length == 0) {
      this.defaultCancelButtonAction()
      return
    }
    const previousUi = this._previousUis.pop()!
    this._ui = previousUi
    this._setUIOverride(previousUi)
  }

  public defaultCancelButtonAction() {
    if(this._uiMode && this._uiMode!.defaultSideComponent) {
      this.setUI({sideComponent:this._uiMode!.defaultSideComponent}, true)
    }
  }

  public setUI_ = {
    tile: (tile: KeyValuePair<Coordiante, Tile>, selectedUnits?: Set<Unit>) => this.setUI(getTileUI(tile, this.worldStateService, selectedUnits), true),
    createCity: () => this.setUI(getCreateCityUI(this.worldStateService), true),
    removeCity: () => this.setUI(getRemoveCityUI(this.worldStateService), true),
  }

  public setMapAction_ = {
    addTileToCity: () => {
      this.setUI(getAddTileToCityAction(this._additionalInfo.get()["tile"]))},
    createEstate: (getBuilding: ()=>Estate, buildingName: string) => {
      this.setUI(getCreateEstateAction(this.benefitsService, this._additionalInfo.get()["tile"], getBuilding, buildingName))},
    removeEstate: () => {
      this.setUI(getRemoveEstateAction(this._additionalInfo.get()["tile"]))},
    addExtraction: (extraction: Extraction) => {
      this.setUI(getAddExtractionAction(this._additionalInfo.get()["tile"], extraction))},
    moveUnits: (selectedUnitsSignal: ForceSignal<Set<Unit>>) => {
      this.setUI(getMoveUnitsAction(this, this.battleService, this._additionalInfo.get()["tile"], selectedUnitsSignal))},
    moveUnitsBattle: (selectedUnitsSignal: ForceSignal<Set<Unit>>) => {
      this.setUI(getMoveUnitsBattleAction(this, this.worldStateService, this.battleService, this._additionalInfo.get()["tile"], selectedUnitsSignal))
    }
  }

  public setUIMode_ = {
    main: (options: {setup: boolean} = {setup:false}) => {
      if(!options.setup) {
        this.battleService.endBattle()
        this.worldStateService.nextTurn()
      }
      this.setUIMode(getMainMode())
    },
    battle: () => {
      this.battleService.startBattle()
      this.setUIMode(getBattleMode())
    }
  }
}