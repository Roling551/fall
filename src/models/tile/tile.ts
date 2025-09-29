import { effect, signal, untracked } from "@angular/core";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { MapEntity } from "../map-entity";
import { Unit } from "../unit";
import { Resource } from "../resource";
import { Coordinate } from "../coordinate";
import { Obstacles } from "../obstacles";
import { ResourceSource } from "../resource-source";
import { ResourcesSources } from "../resources-sources";


export class Tile {

    terrainType
    mapEntity = createForceSignal<MapEntity|undefined>(undefined)
    units = createForceSignal(new Set<Unit>())

    obstacles = createForceSignal<Obstacles>(new Obstacles())

    public resourcesSources: ResourcesSources = new ResourcesSources()

    constructor(
        public coordinate: Coordinate,
        terrainType: string,
        obstacles: Obstacles = new Obstacles()
    ) {
        this.terrainType = signal(terrainType)
        this.obstacles.set(obstacles)
    }

    toJSON() {
        return {
            coordinate: this.coordinate,
            terrainType: this.terrainType(),
            resourcesSources: this.resourcesSources
        }
    }

    static fromJSON(json: any) {
        const tile = new Tile(Coordinate.fromJSON(json.coordinate), json.terrainType)
        tile.resourcesSources = ResourcesSources.fromJSON(json.resourcesSources)
        return tile
    }
}