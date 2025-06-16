import { addExistingNumericalValues } from "../util/map-functions";
import { MapEntity } from "./map-entity";

export class Estate extends MapEntity{

    readonly type = "estate"

    constructor(public name: string, public producedList: Map<string, number>) {
        super(name, 0)
    }

    override produced(): Map<string, number> {
        const produced = new Map(this.producedList)
        addExistingNumericalValues(produced, new Map(super.produced()))
        return produced
    }
}