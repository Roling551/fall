import { Injectable, Signal } from "@angular/core";
import { WorldStateService } from "./world-state/world-state.service";
import { BenefitsService } from "./benefits.service";
import { createForceSignal } from "../util/force-signal";
import { Benefit } from "../models/benefit";
import { UIStateService } from "./ui-state/ui-state.service";
import { ResourcesInfoComponent } from "../feature/resources-info/resources-info.component";
import { Coordinate } from "../models/coordinate";
import { Tile } from "../models/tile";
import { KeyValuePair } from "../models/key-value-pair";

@Injectable({
  providedIn: 'root'
})
export class InitService {

    constructor(public worldStateService: WorldStateService, public benefitsService: BenefitsService, public uiStateService: UIStateService) {}

    init() {
        this.uiStateService.setBaseTileInfo("resourcesInfo", {
            template: ResourcesInfoComponent,
            doRender: (tile: KeyValuePair<Coordinate, Tile>) => true,
        })
    }
}