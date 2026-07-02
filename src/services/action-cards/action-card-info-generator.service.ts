import { Injectable } from "@angular/core";
import { Extraction } from "../../models/extraction";
import { ActionCardInfoFactoryService, CardInput } from "./action-card-info-factory.service";
import { AttributeEffect, AttributeEffectBonus, AttributeMultiplier, CardAttributesService } from "../card-attributes.service";
import { ActionCardInfo } from "../../models/action-card-info";
import { randomNumber } from "../../util/random-functions";


export type CardBase = {
    base: CardInput,
    attributeEffectBonus: AttributeEffect
}

export type CardExtension = {
    name: string,
    attributeMultiplier: AttributeMultiplier,
    compabilityCondition?: (base: CardBase) => boolean
}

const baseList: CardBase[] = [
    {
        base: {
            name: "tick",
            type: "Estate",
            skillRequired: new Map(),
            operation: {
                name: "buildEstate",
                estateInfo: {
                    name: "tick",
                    estateTexture: "tick-on-map",
                    extraction: new Extraction(2),
                    runCost: new Map([["oil", 1]])
                }
            }
        },
        attributeEffectBonus: {
            type: "Extraction",
            bonus: new Extraction(1)
        },
    },
    {
        base: {
            name: "pin",
            type: "Estate",
            skillRequired: new Map(),
            operation: {
                name: "buildEstate",
                estateInfo: {
                    name: "Pin",
                    estateTexture: "pin-on-map",
                    extraction: new Extraction(4),
                    runCost: new Map([["oil", 2]])
                }
            }
        },
        attributeEffectBonus: {
            type: "Extraction",
            bonus: new Extraction(2)
        },
    }
]

const extensionList: CardExtension[] = [
    {
        name: "Dancing",
        attributeMultiplier: "Extractions",
    },
    {
        name: "Precise",
        attributeMultiplier: "NoEstates"
    }
]

@Injectable({
  providedIn: 'root'
})
export class ActionCardInfoGeneratorService {
    constructor(private factory: ActionCardInfoFactoryService) {

    }

    getActionCardInfo(): ActionCardInfo {
        while(true) {
            const base = baseList[randomNumber(baseList.length)]
            const extension = extensionList[randomNumber(baseList.length)]
            if(!extension.compabilityCondition || extension.compabilityCondition(base)) {
                return this.factory.createCard(this.joinBaseAndExtension(base, extension))
            }
        }
    }

    private joinBaseAndExtension(base: CardBase, extension: CardExtension): CardInput  {
        return {
            ...base.base,
            name: extension.name + "-" + base.base.name,
            attributes: [{
                effect: base.attributeEffectBonus,
                multiplier: extension.attributeMultiplier,
            }]
        }
    }
}