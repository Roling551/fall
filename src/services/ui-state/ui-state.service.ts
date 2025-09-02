import { computed, effect, Injectable, signal, Type, untracked, ViewContainerRef } from "@angular/core";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { KeyValuePair } from "../../models/key-value-pair";
import { Coordinate } from "../../models/coordinate";
import { Tile } from "../../models/tile";
import { ActionsListComponent } from "../../feature/actions-list/actions-list.component";
import { getAddExtractionAction, getAddTileToCityAction, getCreateCityUI, getCreateEstateAction, getMoveUnitsAction, getMoveUnitsBattleAction, getRemoveCityUI, getRemoveEstateAction, getTileUI } from "./common-ui-settings";
import { WorldStateService } from "../world-state/world-state.service";
import { Estate } from "../../models/estate";
import { BonusesService } from "../bonuses.service";
import { getBattleMode, getMainMode } from "./common-ui-mode-settings";
import { Unit } from "../../models/unit";
import { BattleService } from "../battle.service";
import { Extraction } from "../../models/extraction";
import { BenefitsService } from "../benefits.service";
import { skip } from "rxjs";
import { TurnActorsService } from "../turn-actors.service";

export type UIModeName = "main" | "battle"

export type UIModeSettings = {
  name: UIModeName
  headerComponent: Type<any>;
  defaultSideComponent?: Type<any>;
}

export type UIData = {
  sideComponent?: Type<any>;
  sideComponentInputs?: any;
  additionalInfo?: any;
  mapAction?: (tile: KeyValuePair<Coordinate, Tile>)=>void;
  cancelButtonAction?: any;
  tileInfos?: Map<string, TileInfo>;
}

export type UISettings = {
  override?: boolean;
  skipBack?: boolean;
  cantIterrupt?: boolean;
  cantInterruptException?: UIData[]
}

export type TileInfo = {
    template: Type<any>,
    input?: any,
    doRender: (tile: KeyValuePair<Coordinate, Tile>) => boolean,
}

const defaultUISettings: UISettings = {
  override: false,
  skipBack: false,
  cantIterrupt: false,
  cantInterruptException: []
}

@Injectable({
  providedIn: 'root'
})
export class UIStateService {

  private viewSideContainerRef!: ViewContainerRef;
  private viewHeaderContainerRef!: ViewContainerRef;

  public _ui?: UIData
  public _uiSettings: UISettings = {...defaultUISettings}
  private _uiMode?: UIModeSettings
  private _previousUis: UIData[] = []

  private _mapAction = createForceSignal(this.getDefaultMapFunction(this))
  private _cancelButtonAction = createForceSignal(()=>{})
  private _tileInfos = createForceSignal<Map<string, TileInfo>>(new Map());
  private _additionalInfo = createForceSignal<any>(null);

  private _baseTileInfo = createForceSignal<Map<string, TileInfo>>(new Map());

  public mapAction = this._mapAction.get;
  public cancelButtonAction = this._cancelButtonAction.get
  public tileInfos = this._tileInfos.get
  public additionalInfo = this._additionalInfo.get

  public uiModeName = signal<UIModeName>("main")

  constructor(
    public worldStateService: WorldStateService,
    public bonusesService: BonusesService,
    public benefitsService: BenefitsService,
    public battleService: BattleService,
    public turnActorsService: TurnActorsService,
  ) {}

  setSideContainerRef(vcRef: ViewContainerRef) {
    this.viewSideContainerRef = vcRef;
  }

  setHeaderContainerRef(vcRef: ViewContainerRef) {
    this.viewHeaderContainerRef = vcRef;
  }

  setUI(ui:UIData, uiSettings: UISettings = {...defaultUISettings}) {
    if(this._uiSettings.cantIterrupt && !this._uiSettings.cantInterruptException?.includes(ui)) {
        return false
    }
    this._uiSettings = uiSettings
    const {override, skipBack} = {...defaultUISettings, ...uiSettings}

    const newUi = (override || !this._ui) ? ui : {...this._ui, ...ui}

    if(override) {
      this._previousUis = []
    } else {
      if(!skipBack) {
        this._previousUis.push(this._ui!)
      } else {
        this._previousUis[this._previousUis.length-1] = newUi
      }
    }

    if(override) {
      this._setUIOverride(ui)
    } else {
      this._setUIUpdate(ui)
    }
    this._ui = newUi
    return true
  }

  _setUIOverride(ui:UIData) {

    this._additionalInfo.set(ui.additionalInfo)

    this._tileInfos.set(new Map([...(ui.tileInfos || []), ...this._baseTileInfo.get()]))
    this._tileInfos.forceUpdate()

    this._mapAction.set(ui.mapAction || this.getDefaultMapFunction(this))
    this._mapAction.forceUpdate()

    this._cancelButtonAction.set(ui.cancelButtonAction || (()=>{}))
    this._cancelButtonAction.forceUpdate()

    if(!ui.sideComponent) {
      this.viewSideContainerRef.clear();
    } else if(ui.sideComponentInputs) {
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

  _setUIUpdate(ui:UIData) {

    this._additionalInfo.set({...this._additionalInfo.get(), ...ui.additionalInfo})

    if(ui.tileInfos) {
      this._tileInfos.set(new Map([...(this._ui?.tileInfos || []), ...ui.tileInfos]))
      this._tileInfos.forceUpdate()
    }

    this._mapAction.set(ui.mapAction || this.getDefaultMapFunction(this))
    this._mapAction.forceUpdate()

    this._cancelButtonAction.set(ui.cancelButtonAction || (()=>{}))
    this._cancelButtonAction.forceUpdate()

    if(ui.sideComponent) {
      if(ui.sideComponentInputs) {
        this.viewSideContainerRef.clear();
        const compRef = this.viewSideContainerRef.createComponent(ui.sideComponent!, ui.sideComponentInputs);
        Object.assign(compRef.instance, ui.sideComponentInputs);
        compRef.changeDetectorRef.detectChanges();
      }
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
    return (tile: KeyValuePair<Coordinate, Tile>) => {
      this.setUI_.tile(tile)
    }
  }

  public cancel() {
    this._uiSettings = defaultUISettings
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
      this.setUI({sideComponent:this._uiMode!.defaultSideComponent}, {override:true})
    }
  }

  public setUI_ = {
    tile: (tile: KeyValuePair<Coordinate, Tile>, selectedUnits?: Set<Unit>) => this.setUI(getTileUI(tile, this.worldStateService, selectedUnits), {override:true}),
    createCity: () => this.setUI(getCreateCityUI(this.worldStateService), {override:true}),
    removeCity: () => this.setUI(getRemoveCityUI(this.worldStateService), {override:true}),
  }

  public setMapAction_ = {
    addTileToCity: () => {
      this.setUI(getAddTileToCityAction(this._additionalInfo.get()["tile"]))},
    createEstate: (getBuilding: ()=>Estate, buildingName: string) => {
      this.setUI(getCreateEstateAction(this.turnActorsService, this._additionalInfo.get()["tile"], getBuilding, buildingName))},
    removeEstate: () => {
      this.setUI(getRemoveEstateAction(this._additionalInfo.get()["tile"]))},
    addExtraction: (extraction: Extraction) => {
      this.setUI(getAddExtractionAction(this._additionalInfo.get()["tile"], extraction))},
    moveUnits: (selectedUnitsSignal: ForceSignal<Set<Unit>>) => {
      this.setUI(getMoveUnitsAction(this, this.battleService, this._additionalInfo.get()["tile"], selectedUnitsSignal))},
    moveUnitsBattle: (selectedUnitsSignal: ForceSignal<Set<Unit>>) => {
      this.setUI(getMoveUnitsBattleAction(this, this.worldStateService, this.battleService, this._additionalInfo.get()["tile"], selectedUnitsSignal))},
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

  public setBaseTileInfo(name: string, tileInfo: TileInfo) {
    this._baseTileInfo.get().set(name, tileInfo)
    this._baseTileInfo.forceUpdate()
  }
}