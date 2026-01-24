import { computed, Injectable, Signal } from "@angular/core";
import { TechnologiesService } from "./technologies/technologies.service";
import { Benefit } from "../models/benefit";
import { SignalChangesEmitter } from "../util/set-changes";
import { Estate } from "../models/estate";
import { EstateProductionBonusAndQualifier, ExtractionBonusAndQualifier, MovementBonusAndQualifier } from "../models/bonus";
import { SignalsGroup } from "../util/signals-group";
import { addNumericalValuesFunctional } from "../util/map-functions";
import { InitService } from "./init.service";
import { createForceSignal } from "../util/force-signal";
import { CurrentLevelService } from "./current-level.service";
import { Tile } from "../models/tile/tile";
import { Skill } from "../models/skill";
import { TurnActorsService } from "./turn-actors.service";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { TurnBenefitsService } from "./turn-benefits.service";
import { Extraction } from "../models/extraction";

type BenefitOfType<T extends Benefit["type"]> = Extract<Benefit, { type: T }>;

@Injectable({
  providedIn: 'root'
})
export class BenefitsService {

    initialBenefits = createForceSignal(new Map<string, Benefit>)

    getBenefitsOfType<T extends Benefit["type"]>(
        type: T
    ): Signal<BenefitOfType<T>[]> {
        return computed(()=>{
            const result:BenefitOfType<T>[] = [];
            const level = this.levelService.level.get()
            if(level) {
                for(const [key, benefit] of level.benefits()) {
                    if(benefit.type === type) {
                        result.push(benefit as BenefitOfType<T>)
                    }
                }
            }
            for(const [key, benefit] of this.technologiesService.benefits.get()) {
                if(benefit.type === type) {
                    result.push(benefit as BenefitOfType<T>)
                }
            }
            for(const [key, benefit] of this.initialBenefits.get()) {
                if(benefit.type === type) {
                    result.push(benefit as BenefitOfType<T>)
                }
            }
            for(const turnActors of this.turnActorService.actors.get()) {
                for(const benefit of turnActors.benefits()) {
                    if(benefit.type === type) {
                        result.push(benefit as BenefitOfType<T>)
                    }
                }
            }
            for(const benefit of this.turnBenefitsService.benefits.get()) {
                result.push(benefit[1] as BenefitOfType<T>)
            }
            return result
        })
    }

    private avaliableEstatesBenefits = this.getBenefitsOfType("unlock-estate")
    avaliableEstates = computed(() => {
        const result = new Map<string, (()=>Estate)>();
        for(const benefit of this.avaliableEstatesBenefits()) {
            result.set(benefit.estateName, benefit.getEstate)
        }
        return result
    })

    listenForExtractionBonuses
    listenForMovementBonuses

    constructor(
        private technologiesService: TechnologiesService,
        private levelService: CurrentLevelService,
        private turnActorService: TurnActorsService,
        private actionsCardsService: ActionsCardsService,
        private turnBenefitsService: TurnBenefitsService,
    ) {
        const listenForExtractionBonusesBenefits = this.getBenefitsOfType("extraction-bonus")
        const listenForExtractionBonusesList = computed(()=> {
            let result = new Map<string, ExtractionBonusAndQualifier>();
            
            for(const benefit of listenForExtractionBonusesBenefits()) {
                result.set(benefit.bonus.name || "", benefit.bonus)
            }
            return result
        })

        const extractionBonuses = new SignalChangesEmitter<any, ExtractionBonusAndQualifier>(listenForExtractionBonusesList);
        this.listenForExtractionBonuses = (tile: Tile) => {
            return new SignalsGroup(
                extractionBonuses,
                (key: string, item: ExtractionBonusAndQualifier)=>{
                    return (!item.qualifier) || item.qualifier(tile)
                },
                (key: string, item: ExtractionBonusAndQualifier)=>item.bonus,
                Extraction.addFunctional,
                ()=>new Extraction(0)
            )
        }

        const movementBonusesBenefits = this.getBenefitsOfType("movement-bonus")
        const movementBonusesList = computed(()=> {
            let result = new Map<string, MovementBonusAndQualifier>();
            for(const turnActors of turnActorService.actors.get()) {
                for(const benefit of movementBonusesBenefits()) {
                    result.set(benefit.bonus.name, benefit.bonus)
                }
            }
            return result
        })
        const movementBonuses = new SignalChangesEmitter<any, MovementBonusAndQualifier>(movementBonusesList);
        this.listenForMovementBonuses = (tile: Tile) => {
            return new SignalsGroup<string, MovementBonusAndQualifier, number>(
                movementBonuses,
                (key: string, item: MovementBonusAndQualifier)=>{
                    return item.qualifier(tile)
                },
                (key: string, item: MovementBonusAndQualifier)=>item.bonus,
                (x,y)=>x+y,
                ()=>0
            )
        }
    }
}