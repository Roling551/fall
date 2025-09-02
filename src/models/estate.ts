import { computed } from "@angular/core";
import { addExistingNumericalValues } from "../util/map-functions";
import { SignalsGroup } from "../util/signals-group";
import { EstateProductionBonus } from "./bonus";
import { MapEntity } from "./map-entity";
import { TurnActor } from "./turn-actor";

export class Estate extends MapEntity implements TurnActor{

    readonly type = "estate"

    constructor(public name: string, public producedList: Map<string, number>) {
        super(name, 0)
    }

    override produced = computed(()=> {
        const produced = new Map(this.producedList)
        addExistingNumericalValues(produced, new Map(super.baseProduced()))
        return produced
    })

    public turnAction() {
        console.log("turn action: " + this.name)
    }
}