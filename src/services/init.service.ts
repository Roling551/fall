import { Injectable, Signal } from "@angular/core";
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

    constructor(public benefitsService: BenefitsService, public uiStateService: UIStateService) {}

    init() {
        this.uiStateService.setBaseTileInfo("resourcesInfo", {
            template: ResourcesInfoComponent,
            doRender: (tile: KeyValuePair<Coordinate, Tile>) => true,
        })
    }
}