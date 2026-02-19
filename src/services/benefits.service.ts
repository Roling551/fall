import { computed, Injectable, signal, Signal } from "@angular/core";
import { TechnologiesService } from "./technologies/technologies.service";
import { Benefit } from "../models/benefit";
import { SignalChangesEmitter } from "../util/set-changes";
import { Estate } from "../models/estate";
import { addTileBonuses, MovementBonusAndQualifier, TileBonus, TileBonusAndQualifier } from "../models/bonus";
import { SignalsGroup } from "../util/signals-group";
import { createForceSignal } from "../util/force-signal";
import { CurrentLevelService } from "./current-level.service";
import { Tile } from "../models/tile/tile";
import { TurnActorsService } from "./turn-actors.service";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { TurnBenefitsService } from "./turn-benefits.service";

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

    listenForTileBonuses
    listenForMovementBonuses

    constructor(
        private technologiesService: TechnologiesService,
        private levelService: CurrentLevelService,
        private turnActorService: TurnActorsService,
        private turnBenefitsService: TurnBenefitsService,
    ) {
        const listenForTileBonusesBenefits = this.getBenefitsOfType("tile-bonus")
        const listenForTileBonusesList = computed(()=> {
            let result = new Map<string, TileBonusAndQualifier>();
            
            for(const benefit of listenForTileBonusesBenefits()) {
                result.set(benefit.bonus.name || "", benefit.bonus)
            }
            return result
        })

        const extractionBonuses = new SignalChangesEmitter<any, TileBonusAndQualifier>(listenForTileBonusesList);
        this.listenForTileBonuses = (tile: Signal<Tile|undefined>) => {
            return new SignalsGroup(
                extractionBonuses,
                computed(()=>(key: string, item: TileBonusAndQualifier)=>{
                    const t = tile()
                    return (!item.qualifier) || (!!t && item.qualifier(t))
                }),
                (key: string, item: TileBonusAndQualifier)=>item.bonus,
                addTileBonuses,
                ()=>({} as TileBonus)
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
                computed(()=>(key: string, item: MovementBonusAndQualifier)=>{
                    return item.qualifier(tile)
                }),
                (key: string, item: MovementBonusAndQualifier)=>item.bonus,
                (x,y)=>x+y,
                ()=>0
            )
        }
    }
}