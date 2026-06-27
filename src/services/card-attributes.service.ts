import { computed, inject, Injectable, Injector, signal, Signal } from "@angular/core";
import { Extraction } from "../models/extraction";
import { TextPart } from "../models/text-part";
import { Coordinate } from "../models/coordinate";
import { CurrentLevelService } from "./current-level.service";
import { SimpleTile } from "../models/tile/simple-tile";
import { getPlayersEstate } from "../models/tile/tile-util";
import { SignalChangesEmitter } from "../util/set-changes";
import { SignalsGroup } from "../util/signals-group";
import { Resource } from "../models/resource";

export type AttributesEffectInputs = {
    location: Coordinate | null,
}

export type CardAttribute = {
    effect: AttributeEffect,
    multiplier: AttributeMultiplier
}

export type AttributeEffect = {
    type: "Extraction";
    bonus: Extraction;
}

export type AttributeEffectType = AttributeEffect["type"]

export type AttributeEffectBonus = Extraction

export type AttributeMultiplier =
    "Extractions"

@Injectable({
  providedIn: 'root'
})
export class CardAttributesService {
    private injector = inject(Injector);
    constructor(private currentLevelService: CurrentLevelService) {}

    private getAttributeMultiplier(attribute: CardAttribute, inputs: Signal<AttributesEffectInputs>): number {
        let bonus = 0
        switch(attribute.multiplier) {
            case "Extractions":
                const location = inputs().location
                if(!location) {
                    return 0
                }
                for(const neighbour of this.currentLevelService.level.get()!.map.getNeighborTiles(location)) {
                    const estate = getPlayersEstate(neighbour[1].value)
                    if(estate && !estate.disabled() && estate.additionalInfo.extraction) {
                        bonus += 1
                    }
                }
                return bonus
        }
    }

    private getSignalGroupOutput<T extends AttributeEffectBonus>(
        attributes: Signal<CardAttribute[]>, 
        inputs: Signal<AttributesEffectInputs>,
        attributeEffectType: AttributeEffectType,
        getZeroValue: ()=>T): Signal<T>
    {
        const attributesList = computed(()=> {
            let result = new Map<string, CardAttribute>();
            
            for(const attribute of attributes()) {
                result.set(attribute.multiplier, attribute)
            }
            return result
        })
        const attributesChangesEmitter = new SignalChangesEmitter<any, CardAttribute>(attributesList, this.injector);
        const signalGroup =  new SignalsGroup(
            attributesChangesEmitter,
            computed(()=>(key: string, item: CardAttribute)=>{
                return item.effect.type === attributeEffectType
            }),
            (key: string, item: CardAttribute)=>{
                return (item.effect.bonus as T).multiply(this.getAttributeMultiplier(item, inputs)) as T
            },
            (x:T,y:T)=>x.add(y) as T,
            ()=>(getZeroValue())
        )
        return signalGroup.output
    }

    getAttributesExtractionEffects(attributes: Signal<CardAttribute[]>, inputs: Signal<AttributesEffectInputs>): Signal<Extraction> {
        return this.getSignalGroupOutput(attributes, inputs, "Extraction", ()=>new Extraction(0))
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