import { Injectable } from "@angular/core";
import { Extraction } from "../models/extraction";
import { TextPart } from "../models/text-part";
import { Coordinate } from "../models/coordinate";
import { CurrentLevelService } from "./current-level.service";
import { SimpleTile } from "../models/tile/simple-tile";
import { getPlayersEstate } from "../models/tile/tile-util";

export type Attribute = "synchronized"

export type OtherAttributesEffectInputs = {
    location: Coordinate,
}

export type AttributesEffect = {
    extractionBonus: Extraction
}

function addAttributesEffects(a1: AttributesEffect, a2: AttributesEffect): AttributesEffect {
    return {
        extractionBonus: Extraction.addFunctional(a1.extractionBonus, a2.extractionBonus)
    }
}

@Injectable({
  providedIn: 'root'
})
export class AttributesService {
    constructor(private currentLevelService: CurrentLevelService) {}

    getAttributeEffects(attribute: [Attribute, number], inputs: OtherAttributesEffectInputs): AttributesEffect {
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

    getAttributesEffects(attributes: Map<Attribute, number>, inputs: OtherAttributesEffectInputs): AttributesEffect {
        let effect: AttributesEffect = {
            extractionBonus: new Extraction(0),
        }
        for(const attribute of attributes) {
            effect = addAttributesEffects(effect, this.getAttributeEffects(attribute, inputs))
        }
        return effect
    }

    getAttributeDescribtion(attribute: [Attribute, number]): TextPart[][] {
        switch(attribute[0]) {
            case "synchronized":
                return [["Synchronized-", attribute[1].toString()]]
        }
    }

    getAttributesDescribtions(attributes: Map<Attribute, number>): TextPart[][] {
        let describtions: TextPart[][] = []
        for(const attribute of attributes) {
            describtions = [...describtions, ...this.getAttributeDescribtion(attribute)]
        }
        return describtions
    }
}