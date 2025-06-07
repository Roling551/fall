import { MapEntity } from "./map-entity";


export class Tile {

    constructor(
        public terrainType: string,
        public mapEntity?: MapEntity
    ) {}

}