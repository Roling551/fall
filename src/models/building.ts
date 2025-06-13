import { MapEntity } from "./map-entity";

export class Building extends MapEntity{
    constructor(public name: string) {
        super("building", name)
    }
}