import { MapEntity } from "./map-entity";

export class GenericMapEntity extends MapEntity{
    constructor(public name: string) {
        super("genericMapEntity", name)
    }
}