import { MapEntity } from "./map-entity";

export class Estate extends MapEntity{

    readonly type = "estate"

    constructor(public name: string, public produced: Map<string, number>) {
        super(name, 0)
    }
}