import { computed, Injectable } from "@angular/core";
import { TechnologiesService } from "./technologies/technologies.service";
import { Benefit } from "../models/benefit";
import { SignalChangesEmitter } from "../util/set-changes";
import { Estate } from "../models/estate";
import { EstateProductionBonus, MovementBonus, SkillMapActionSkillBonus } from "../models/bonus";
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
        const level = this.levelService.level.get()
        if(level) {
            for(const [key, benefit] of level.benefits()) {
                if(benefit.type === "unlock-estate") {
                    result.set(benefit.estateName, benefit.getEstate)
                }
            }
        }
        return result
    })

    listenForSkillMapActionSkillBonuses
    listenForMovementBonuses

    constructor(
        private technologiesService: TechnologiesService,
        private levelService: CurrentLevelService,
        private turnActorService: TurnActorsService,
        private actionsCardsService: ActionsCardsService,
        private turnBenefitsService: TurnBenefitsService,
    ) {
        const skillMapActionSkillBonusesList = computed(()=> {
            let result = new Map<string, SkillMapActionSkillBonus>();
            for(const [key, benefit] of this.technologiesService.benefits.get()) {
                if(benefit.type === "skill-map-action-skill-bonus") {
                    result.set(key, benefit.bonus)
                }
            }
            for(const [key, benefit] of this.initialBenefits.get()) {
                if(benefit.type === "skill-map-action-skill-bonus") {
                    result.set(key, benefit.bonus)
                }
            }
            const level = levelService.level.get()
            if(level) {
                for(const [key, benefit] of level.benefits()) {
                    if(benefit.type === "skill-map-action-skill-bonus") {
                        result.set(key, benefit.bonus)
                    }
                }
            }
            for(const turnActors of turnActorService.actors.get()) {
                for(const bonus of turnActors.benefits()) {
                    if(bonus.type === "skill-map-action-skill-bonus") {
                        result.set(bonus.bonus.name || "", bonus.bonus)
                    }
                }
            }
            result = new Map([...result, ...this.turnBenefitsService.skillMapActionSkillBonuses.get()])
            return result
        })

        const skillMapActionSkillBonuses = new SignalChangesEmitter<any, SkillMapActionSkillBonus>(skillMapActionSkillBonusesList);
        this.listenForSkillMapActionSkillBonuses = (tile: Tile) => {
            return new SignalsGroup(
                skillMapActionSkillBonuses,
                (key: string, item: SkillMapActionSkillBonus)=>{
                    return (!item.qualifier) || item.qualifier(tile)
                },
                (key: string, item: SkillMapActionSkillBonus)=>item.bonus,
                addNumericalValuesFunctional,
                ()=>new Map<Skill, number>()
            )
        }

        const movementBonusesList = computed(()=> {
            let result = new Map<string, MovementBonus>();
            for(const turnActors of turnActorService.actors.get()) {
                for(const bonus of turnActors.benefits()) {
                    if(bonus.type == "movement-bonus")
                    result.set(bonus.bonus.name, bonus.bonus)
                }
            }
            return result
        })
        const movementBonuses = new SignalChangesEmitter<any, MovementBonus>(movementBonusesList);
        this.listenForMovementBonuses = (tile: Tile) => {
            return new SignalsGroup<string, MovementBonus, number>(
                movementBonuses,
                (key: string, item: MovementBonus)=>{
                    return item.qualifier(tile)
                },
                (key: string, item: MovementBonus)=>item.bonus,
                (x,y)=>x+y,
                ()=>0
            )
        }
    }
}