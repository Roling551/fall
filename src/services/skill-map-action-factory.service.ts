import { computed, Injectable, signal } from "@angular/core";
import { Skill } from "../models/skill";
import { Coordinate } from "../models/coordinate";
import { Tile } from "../models/tile/tile";
import { ResourcesService } from "./resources.service";
import { addExistingNumericalValues, addNumericalValuesFunctional } from "../util/map-functions";
import { CurrentLevelService } from "./current-level.service";
import { BenefitsService } from "./benefits.service";
import { Extraction } from "../models/extraction";
import { ActionAttribute, ActionAttributesService } from "./action-attributes.service";

export interface CreateExtractionInfo {
    extraction: Extraction
    times: number
}

export interface CreateGatheringActionInfo {

}

@Injectable({
  providedIn: 'root'
})
export class SkillMapActionFactoryService {
    
    map
    constructor(
        private resourcesService: ResourcesService,
        private currentLevelService: CurrentLevelService,
        private benefitsService: BenefitsService,
        private attributesService: ActionAttributesService,
    ) {
        this.map = computed(()=>this.currentLevelService.level.get()?.map)
    }

    public createMapInteractionAction(createActionInfo: CreateExtractionInfo, affectedCoordinates: Coordinate[], attributes: Map<ActionAttribute, number>=new Map()) {
        const times = createActionInfo.times || 1
        return (tile: Tile)=>{
            const attributesEffects = this.attributesService.getAttributesEffects(attributes, {location: tile.coordinate})
            const extraction = 
                Extraction.addFunctional(
                    Extraction.addFunctional(
                        createActionInfo.extraction, 
                        this.benefitsService.listenForTileBonuses(signal(tile)).output().extraction), 
                        attributesEffects.extractionBonus)

            const map = this.map()
            if(!map) {
                return
            }
            for(let i = 0; i<times; i++) {
                const tiles = affectedCoordinates
                    .map(c=>map.getTile(tile.coordinate.addCoordinates(c)))
                    .filter(t=>!!t)
                    .map(t=>t.value)
                for(const t of tiles) {
                    if(t.canAttemptExtractionAction(extraction)) {
                        const actionResult = t.extractionAction(extraction)
                        if(actionResult.resourcesGained) {
                            tile.changeExtractedResources(actionResult.resourcesGained)
                        }
                    }
                }
            }
        }
    }

    public createMapGatheringAction(createActionInfo: CreateGatheringActionInfo, affectedCoordinates: Coordinate[]) {
        return (tile: Tile)=>{
            const map = this.map()
            if(!map) {
                return
            }
            const tiles = affectedCoordinates
                .map(c=>map.getTile(tile.coordinate.addCoordinates(c)))
                .filter(t=>!!t)
                .map(t=>t.value)
            for(const t of tiles) {
                this.resourcesService.addResources(t.getExtractedResources())
                t.clearExtractedResources()
            }
        }
    }
}