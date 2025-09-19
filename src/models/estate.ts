import { computed } from "@angular/core";
import { addExistingNumericalValues } from "../util/map-functions";
import { SignalsGroup } from "../util/signals-group";
import { EstateProductionBonus } from "./bonus";
import { MapEntity } from "./map-entity";
import { TurnActor } from "./turn-actor";
import { Tile } from "./tile";
import { Resource } from "./resource";

export class Estate extends MapEntity implements TurnActor{

    readonly type = "estate"
    private forcefullyDisabled = false

    constructor(public tile: Tile, public name: string, public action: (tile: Tile)=>void, public requiredResources: Map<Resource, number>) {
        super(name, 0)
    }

    public turnAction() {
        if(this.forcefullyDisabled) {
            return
        }
        this.action(this.tile)
    }

    getRequiredResources(): Map<Resource, number> {
        return new Map(this.requiredResources)
    }
    disable() {
        this.forcefullyDisabled = true
    }
    enable() {
        this.forcefullyDisabled = false
    }
}