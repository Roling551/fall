import { computed, Injectable } from "@angular/core";
import { TechnologiesService } from "./technologies/technologies.service";
import { Benefit } from "../models/benefit";
import { BonusesService } from "./bonuses.service";
import { SignalChangesEmitter } from "../util/set-changes";
import { Estate } from "../models/estate";
import { Extraction } from "../models/extraction";
import { EstateProductionBonus } from "../models/bonus";
import { SignalsGroup } from "../util/signals-group";
import { addNumericalValuesFunctional } from "../util/map-functions";
import { InitService } from "./init.service";
import { WorldStateService } from "./world-state/world-state.service";
import { createForceSignal } from "../util/force-signal";

@Injectable({
  providedIn: 'root'
})
export class BenefitsService {

    initialBenefits = createForceSignal(new Map<string, Benefit>)

    avaliableEstates = computed(() => {
        const result = new Map<string, (()=>Estate)>();
        for(const [key, benefit] of this.technologiesService.benefits.get()) {
            if(benefit.type === "unlock-estate") {
                result.set(benefit.estateName, benefit.getEstate)
            }
        }
        for(const [key, benefit] of this.initialBenefits.get()) {
            if(benefit.type === "unlock-estate") {
                result.set(benefit.estateName, benefit.getEstate)
            }
        }
        for(const [key, benefit] of this.worldStateService.benefits()) {
            if(benefit.type === "unlock-estate") {
                result.set(benefit.estateName, benefit.getEstate)
            }
        }
        return result
    })

    avaliableExtractions = computed(() => {
        const result = new Map<string, (()=>Extraction)>();
        for(const [key, benefit] of this.technologiesService.benefits.get()) {
            if(benefit.type === "unlock-extraction") {
                result.set(benefit.extractionName, benefit.getExtraction)
            }
        }
        for(const [key, benefit] of this.initialBenefits.get()) {
            if(benefit.type === "unlock-extraction") {
                result.set(benefit.extractionName, benefit.getExtraction)
            }
        }
        for(const [key, benefit] of this.worldStateService.benefits()) {
            if(benefit.type === "unlock-extraction") {
                result.set(benefit.extractionName, benefit.getExtraction)
            }
        }
        return result
    })
    estateBonuses
    estateProductionBonuses
    listenForEstateProductionBonuses
    constructor(
        private technologiesService: TechnologiesService,
        private worldStateService: WorldStateService
    ) 
    {
        this.estateBonuses = computed(()=> {
            const result = new Map<string, EstateProductionBonus>();
            for(const [key, benefit] of this.technologiesService.benefits.get()) {
                if(benefit.type === "estate-production-bonus") {
                    result.set(key, benefit.bonus)
                }
            }
            for(const [key, benefit] of this.initialBenefits.get()) {
                if(benefit.type === "estate-production-bonus") {
                    result.set(key, benefit.bonus)
                }
            }
            for(const [key, benefit] of this.worldStateService.benefits()) {
                if(benefit.type === "estate-production-bonus") {
                    result.set(key, benefit.bonus)
                }
            }
            return result
        })

        this.estateProductionBonuses = new SignalChangesEmitter<any, EstateProductionBonus>(this.estateBonuses);
        this.listenForEstateProductionBonuses = (estate: Estate) => {
            return new SignalsGroup(
                this.estateProductionBonuses,
                (key: string, item: EstateProductionBonus)=>{
                    return item.qualifier(estate)
                },
                (key: string, item: EstateProductionBonus)=>item.bonus(estate),
                addNumericalValuesFunctional,
                ()=>new Map<string, number>()
            )
        }
    }
}