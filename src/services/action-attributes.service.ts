import { Injectable } from "@angular/core";
import { Extraction } from "../models/extraction";
import { TextPart } from "../models/text-part";
import { Coordinate } from "../models/coordinate";
import { CurrentLevelService } from "./current-level.service";
import { SimpleTile } from "../models/tile/simple-tile";
import { getPlayersEstate } from "../models/tile/tile-util";

export type ActionAttribute = "synchronized"

export type ActionAttributesEffectInputs = {
    location: Coordinate,
}

export type ActionAttributesEffect = {
    extractionBonus: Extraction
}

function addActionAttributesEffects(a1: ActionAttributesEffect, a2: ActionAttributesEffect): ActionAttributesEffect {
    return {
        extractionBonus: Extraction.addFunctional(a1.extractionBonus, a2.extractionBonus)
    }
}

@Injectable({
  providedIn: 'root'
})
export class ActionAttributesService {
    constructor(private currentLevelService: CurrentLevelService) {}

    getAttributeEffects(attribute: [ActionAttribute, number], inputs: ActionAttributesEffectInputs): ActionAttributesEffect {
        switch(attribute[0]) {
            case "synchronized":
                let bonus = 0
                for(const neighbour of this.currentLevelService.level.get()!.map.getNeighborTiles(inputs.location)) {
                    const estate = getPlayersEstate(neighbour[1].value)
                    if(estate && !estate.disabled() && estate.additionalInfo.extraction) {
                        bonus += attribute[1]
                    }
                }
                return {
                    extractionBonus: new Extraction(bonus)
                }
        }
    }

    getAttributesEffects(attributes: Map<ActionAttribute, number>, inputs: ActionAttributesEffectInputs): ActionAttributesEffect {
        let effect: ActionAttributesEffect = {
            extractionBonus: new Extraction(0),
        }
        for(const attribute of attributes) {
            effect = addActionAttributesEffects(effect, this.getAttributeEffects(attribute, inputs))
        }
        return effect
    }

    getAttributeDescribtion(attribute: [ActionAttribute, number]): TextPart[][] {
        switch(attribute[0]) {
            case "synchronized":
                return [["Synchronized-", attribute[1].toString()]]
        }
    }

    getAttributesDescribtions(attributes: Map<ActionAttribute, number>): TextPart[][] {
        let describtions: TextPart[][] = []
        for(const attribute of attributes) {
            describtions = [...describtions, ...this.getAttributeDescribtion(attribute)]
        }
        return describtions
    }
}