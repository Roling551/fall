import { computed, Signal, signal } from "@angular/core";
import { addExistingNumericalValues } from "../util/map-functions";
import { SignalsGroup } from "../util/signals-group";
import { EstateProductionBonus, MovementBonus, SkillMapActionSkillBonus } from "./bonus";
import { MapEntity } from "./map-entity";
import { TurnActor } from "./turn-actor";
import { Tile } from "./tile/tile";
import { Resource } from "./resource";
import { Skill, skillsToString } from "./skill";
import { createForceSignal } from "../util/force-signal";
import { Coordinate } from "./coordinate";
import { ActionCardInfo } from "./action-card-info";
import { Benefit } from "./benefit";
import { EstateCardInputs } from "../services/action-cards/action-card-info-factory.service";

export class Estate extends MapEntity implements TurnActor{
    private forcefullyDisabled = signal(false)
    public skillMapActionSkillBonus
    public movementBonus
    affectedCoordinates
    readonly type

    constructor(
        public tile: Tile, 
        public name: string, 
        public runCost: Map<Resource, number>,
        affectedCoordinates: Coordinate[],
        private additionalInfo: EstateCardInputs,
        public costPaid: Map<Resource, number>,
        public action?: (tile: Tile)=>void,
        skillMapActionSkillBonus?: Map<Skill, number>,
        movementBonus?: number,
        public actionCardGetAfterDestroy?: ActionCardInfo,
        type?: "estate" | "upgrade",
    ) {
        super(name, 0)
        this.skillMapActionSkillBonus = createForceSignal(skillMapActionSkillBonus)
        this.movementBonus = createForceSignal(movementBonus)
        this.affectedCoordinates = affectedCoordinates.map(x=>x.addCoordinates(tile.coordinate).getKey())
        this.type = type || "estate"
    }
    benefits = computed<Benefit[]>(() => {
        const benefits:Benefit[] = []
        if (this.skillMapActionSkillBonus) {
            benefits.push({
                type: "skill-map-action-skill-bonus",
                bonus: {
                    name: this.tile.coordinate.getKey(),
                    bonus: new Map(this.skillMapActionSkillBonus.get()),
                    qualifier: (tile: Tile)=> {
                        return this.affectedCoordinates.includes(tile.coordinate.getKey())
                    }
                }
            })
        }
        if(this.movementBonus.get()) {
            benefits.push({
                type: "movement-bonus",
                bonus: {
                    name: this.tile.coordinate.getKey(),
                    bonus: this.movementBonus.get()!,
                    qualifier: (tile: Tile)=> {
                        return this.affectedCoordinates.includes(tile.coordinate.getKey())
                    }
                }
            })
        }
        return benefits
    })  

    public turnAction() {
        if(this.forcefullyDisabled()) {
            return
        }
        this.action?.(this.tile)
    }

    getRequiredResources(): Map<Resource, number> {
        return new Map(this.runCost)
    }
    disable() {
        this.forcefullyDisabled.set(true)
    }
    enable() {
        this.forcefullyDisabled.set(false)
    }

    override skillAction(skills: Map<Skill,number>) {
        return {}
    }

    override canAttemptSkillAction(skills: Map<Skill, number>): boolean {
        return false
    }

    effectsDescriptions = computed(()=>{
        const descriptions: string[] = []
        if(this.additionalInfo.skillApplied) {
            descriptions.push("apply:" + skillsToString(this.additionalInfo.skillApplied))
        }
        if(this.additionalInfo.skillMapActionSkillBonus) {
            descriptions.push("bonus:" + skillsToString(this.additionalInfo.skillMapActionSkillBonus))
        }
        if(this.additionalInfo.movementBonus) {
            descriptions.push("move:+" + this.additionalInfo.movementBonus)
        }
        return descriptions
    })
}