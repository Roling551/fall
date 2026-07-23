import { computed, Injectable, signal } from "@angular/core";
import { Coordinate } from "../models/coordinate";
import { Tile } from "../models/tile/tile";
import { ResourcesService } from "./resources.service";
import { addExistingNumericalValues, addNumericalValuesFunctional } from "../util/map-functions";
import { CurrentLevelService } from "./current-level.service";
import { BenefitsService } from "./benefits.service";
import { Extraction } from "../models/extraction";
import { CardAttribute, CardAttributesService } from "./card-attributes.service";

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
        private attributesService: CardAttributesService,
    ) {
        this.map = computed(()=>this.currentLevelService.level.get()?.map)
    }

    public createMapInteractionAction(createActionInfo: CreateExtractionInfo, affectedCoordinates: Coordinate[], attributes: CardAttribute[]=[]) {
        const times = createActionInfo.times || 1
        const coordinateSignal = signal<Coordinate|null>(null)
        const attributeInputs = computed(()=>({location: coordinateSignal()}))
        const attributesEffects = this.attributesService.getAttributesExtractionEffects(signal(attributes), attributeInputs)
        return (tile: Tile)=>{
            coordinateSignal.set(tile.coordinate)
            const extraction = 
                Extraction.addFunctional(
                    Extraction.addFunctional(
                        createActionInfo.extraction, 
                        this.benefitsService.listenForTileBonuses(signal(tile)).output().extraction), 
                        attributesEffects())

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