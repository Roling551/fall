import { Injectable } from "@angular/core";
import { Extraction } from "../models/extraction";
import { TextPart } from "../models/text-part";
import { Coordinate } from "../models/coordinate";
import { CurrentLevelService } from "./current-level.service";
import { SimpleTile } from "../models/tile/simple-tile";
import { getPlayersEstate } from "../models/tile/tile-util";

export type AttributesEffectInputs = {
    location: Coordinate,
}

export type CardAttribute = {
    effect: AttributeEffect,
    multiplier: AttributeMultiplier
}

export type AttributeEffect = {
    type: "Extraction",
    bonus: Extraction
}

export type AttributeMultiplier =
    "Extractions"

@Injectable({
  providedIn: 'root'
})
export class CardAttributesService {
    constructor(private currentLevelService: CurrentLevelService) {}

    private getAttributeMultiplier(attribute: CardAttribute, inputs: AttributesEffectInputs): number {
        let bonus = 0
        switch(attribute.multiplier) {
            case "Extractions":
                for(const neighbour of this.currentLevelService.level.get()!.map.getNeighborTiles(inputs.location)) {
                    const estate = getPlayersEstate(neighbour[1].value)
                    if(estate && !estate.disabled() && estate.additionalInfo.extraction) {
                        bonus += 1
                    }
                }
                return bonus
        }
    }

    getAttributesExtractionEffects(attributes: CardAttribute[], inputs: AttributesEffectInputs): Extraction {
        let effect = new Extraction(0)
        for(const attribute of attributes) {
            if(attribute.effect.type === "Extraction") {
                effect = Extraction.addFunctional(effect, Extraction.multiplyFunctional(attribute.effect.bonus, this.getAttributeMultiplier(attribute, inputs)))
            }
        }
        return effect
    }

    getAttributeDescribtion(attribute: CardAttribute): TextPart[] {
        let describtion: TextPart[] = []
        switch(attribute.multiplier) {
            case "Extractions":
                describtion = describtion.concat(["For each neighbouring extractor "])
        }
        switch(attribute.effect.type) {
            case "Extraction":
                describtion = describtion.concat(["gain ", ...attribute.effect.bonus.getTextParts()])
        }
        return describtion
    }

    getAttributesDescribtions(attributes: CardAttribute[]): TextPart[][] {
        let describtions: TextPart[][] = []
        for(const attribute of attributes) {
            describtions = [...describtions, this.getAttributeDescribtion(attribute)]
        }
        return describtions
    }
}