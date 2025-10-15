import { computed, Signal, signal } from "@angular/core";
import { addExistingNumericalValues } from "../util/map-functions";
import { SignalsGroup } from "../util/signals-group";
import { EstateProductionBonus, MovementBonus, SkillMapActionSkillBonus } from "./bonus";
import { MapEntity } from "./map-entity";
import { TurnActor } from "./turn-actor";
import { Tile } from "./tile/tile";
import { Resource } from "./resource";
import { Skill } from "./skill";
import { createForceSignal } from "../util/force-signal";
import { Coordinate } from "./coordinate";

export class Estate extends MapEntity implements TurnActor{
    readonly type = "estate"
    private forcefullyDisabled = signal(false)
    public skillMapActionSkillBonus
    public movementBonus
    affectedCoordinates

    constructor(
        public tile: Tile, 
        public name: string, 
        public requiredResources: Map<Resource, number>,
        affectedCoordinates: Coordinate[], 
        public action?: (tile: Tile)=>void,
        skillMapActionSkillBonus?: Map<Skill, number>,
        movementBonus?: number,
    ) {
        super(name, 0)
        this.skillMapActionSkillBonus = createForceSignal(skillMapActionSkillBonus)
        this.movementBonus = createForceSignal(movementBonus)
        this.affectedCoordinates = affectedCoordinates.map(x=>x.addCoordinates(tile.coordinate).getKey())
    }
   

    public turnAction() {
        if(this.forcefullyDisabled()) {
            return
        }
        this.action?.(this.tile)
    }

    getRequiredResources(): Map<Resource, number> {
        return new Map(this.requiredResources)
    }
    disable() {
        this.forcefullyDisabled.set(true)
    }
    enable() {
        this.forcefullyDisabled.set(false)
    }
    getSkillMapActionSkillBonus = computed<SkillMapActionSkillBonus|undefined>(() => {
        if (this.skillMapActionSkillBonus) {
            return {
                name: this.tile.coordinate.getKey(),
                bonus: new Map(this.skillMapActionSkillBonus.get()),
                qualifier: (tile: Tile)=> {
                    return this.affectedCoordinates.includes(tile.coordinate.getKey())
                }
            } 
        } else {
            return undefined
        }
    })

    getMovementBonus = computed<MovementBonus|undefined>(()=>{
        const movementBonus = this.movementBonus.get()
        if (movementBonus) {
            return {
                name: this.tile.coordinate.getKey(),
                bonus: movementBonus,
                qualifier: (tile: Tile)=> {
                    return this.affectedCoordinates.includes(tile.coordinate.getKey())
                }
            } 
        } else {
            return undefined
        }
    })

    override skillAction(skills: Map<Skill,number>) {
        return {}
    }

    override canAttemptSkillAction(skills: Map<Skill, number>): boolean {
        return false
    }
}