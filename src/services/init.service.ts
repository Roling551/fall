import { Injectable, Signal } from "@angular/core";
import { Extraction } from "../models/extraction";
import { WorldStateService } from "./world-state/world-state.service";
import { ExtractionSite } from "../models/extraction-site";
import { BenefitsService } from "./benefits.service";
import { createForceSignal } from "../util/force-signal";
import { Benefit } from "../models/benefit";
import { possibleExtractions } from "../models/possible-extractions";

@Injectable({
  providedIn: 'root'
})
export class InitService {

    constructor(public worldStateService: WorldStateService) {}

    benefits = createForceSignal(new Map<string, Benefit>)

    init() {
        this.benefits.get().set(
          "forest-gathering", 
          {
            type:"unlock-extraction",
            extractionName:"forest-gathering",
            getExtraction: possibleExtractions.get("forest-gathering")!
          },
        )
        this.benefits.get().set(
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
    }
}