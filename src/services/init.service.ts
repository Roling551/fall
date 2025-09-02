import { Injectable, Signal } from "@angular/core";
import { Extraction } from "../models/extraction";
import { WorldStateService } from "./world-state/world-state.service";
import { ExtractionSite } from "../models/extraction-site";
import { BenefitsService } from "./benefits.service";
import { createForceSignal } from "../util/force-signal";
import { Benefit } from "../models/benefit";
import { possibleExtractions } from "../models/possible-extractions";
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
        this.benefitsService.initialBenefits.get().set(
          "forest-gathering", 
          {
            type:"unlock-extraction",
            extractionName:"forest-gathering",
            getExtraction: possibleExtractions.get("forest-gathering")!
          },
        )
        this.benefitsService.initialBenefits.get().set(
          "forest-warship",
          {
            type:"unlock-extraction",
            extractionName:"forest-warship",
            getExtraction: possibleExtractions.get("forest-warship")!
          }
        )
        this.worldStateService.tiles.get("1_1")?.value.mapEntity.set(new ExtractionSite("forest", [["berries", 5]]))
        this.worldStateService.tiles.get("1_2")?.value.mapEntity.set(new ExtractionSite("forest", [["berries", 5]]))
        this.worldStateService.tiles.get("2_1")?.value.mapEntity.set(new ExtractionSite("forest", [["berries", 5]]))

        this.uiStateService.setBaseTileInfo("resourcesInfo", {
            template: ResourcesInfoComponent,
            doRender: (tile: KeyValuePair<Coordinate, Tile>) => true,
        })
    }
}