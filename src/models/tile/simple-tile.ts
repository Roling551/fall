import { computed, Signal } from "@angular/core";
import { createForceSignal } from "../../util/force-signal";
import { Coordinate } from "../coordinate";
import { MapEntity } from "../map-entity";
import { Obstacles } from "../obstacles";
import { BaseTile } from "./base-tile";

export class SimpleTile extends BaseTile {
    playersMapEntity = createForceSignal<MapEntity|undefined>(undefined)
    environmentMapEntities = createForceSignal<MapEntity[]>([])

    constructor(
        coordinate: Coordinate,
        terrainType: string,
        obstacles: Obstacles = new Obstacles()
    ) {
        super(coordinate, terrainType, obstacles)
    }

    override addMapEntity(mapEntity: MapEntity): boolean {
        if(!!this.playersMapEntity.get()) {
            return false
        }
        if(mapEntity.type == "estate" || mapEntity.type == "station") {
            this.playersMapEntity.set(mapEntity)
        } else {
            this.environmentMapEntities.get().push(mapEntity)
            this.environmentMapEntities.forceUpdate()
        }
        return true
    }
    override removeMapEntity(): boolean {
        this.playersMapEntity.set(undefined)
        return true
    }
    override canAddEntity(): boolean {
        return !this.playersMapEntity.get()
    }

    override mapEntities = computed(()=>{
        const playersMapEntity = this.playersMapEntity.get()
        return [
             ...(playersMapEntity ? [playersMapEntity] : []),
            ...this.environmentMapEntities.get()
        ]
    });
}