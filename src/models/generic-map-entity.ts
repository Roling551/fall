import { MapEntity } from "./map-entity";

export class GenericMapEntity extends MapEntity{

    readonly type = "genericMapEntity"

    constructor(public name: string, public produced: Map<string, number>) {
        super(name, 0)
    }
}