import { computed } from "@angular/core";
import { addExistingNumericalValues } from "../util/map-functions";
import { SignalsGroup } from "../util/signals-group";
import { EstateProductionBonus } from "./bonus";
import { MapEntity } from "./map-entity";

export class Estate extends MapEntity{

    readonly type = "estate"

    public bonus?: SignalsGroup<any, EstateProductionBonus, Map<any, number>>

    constructor(public name: string, public producedList: Map<string, number>) {
        super(name, 0)
    }

    override produced = computed(()=> {
        const produced = new Map(this.producedList)
        addExistingNumericalValues(produced, new Map(super.baseProduced()))
        if(this.bonus) {
            addExistingNumericalValues(produced, this.bonus.output())
        }
        return produced
    })
}