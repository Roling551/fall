import { computed } from "@angular/core";
import { addExistingNumericalValues } from "../util/map-functions";
import { SignalsGroup } from "../util/signals-group";
import { EstateProductionBonus } from "./bonus";
import { MapEntity } from "./map-entity";
import { TurnActor } from "./turn-actor";
import { Tile } from "./tile";

export class Estate extends MapEntity implements TurnActor{

    readonly type = "estate"

    constructor(public tile: Tile, public name: string, public action: (tile: Tile)=>void) {
        super(name, 0)
    }

    public turnAction() {
        this.action(this.tile)
    }
}