import { computed, Signal } from "@angular/core";
import { createForceSignal } from "../../util/force-signal";
import { Coordinate } from "../coordinate";
import { MapEntity } from "../map-entity";
import { Obstacles } from "../obstacles";
import { BaseTile } from "./base-tile";
import { Estate } from "../estate";

export class SimpleTile extends BaseTile {
    playersMapEntity = createForceSignal<MapEntity|undefined>(undefined)
    upgrade = createForceSignal<MapEntity|undefined>(undefined)
    environmentMapEntities = createForceSignal<MapEntity[]>([])

    constructor(
        coordinate: Coordinate,
        terrainType: string,
        obstacles: Obstacles = new Obstacles()
    ) {
        super(coordinate, terrainType, obstacles)
    }

    override getMapEntities(): Signal<MapEntity[]> {
        return computed(()=>{
            const entities = []
            const e1 = this.playersMapEntity.get()
            if(e1) {
                entities.push(e1)
            }
            const e2 = this.upgrade.get()
            if(e2) {
                entities.push(e2)
            }
            for(const e3 of this.environmentMapEntities.get()) {
                entities.push(e3)
            }
            return entities
        })
    }

    override addMapEntity(mapEntity: MapEntity): boolean {
        if(mapEntity.type == "estate" || mapEntity.type == "station") {
            if(!!this.playersMapEntity.get()) {
                return false
            }
            this.playersMapEntity.set(mapEntity)
        } else if(mapEntity.type == "upgrade") {
            if(!!this.upgrade.get()) {
                return false
            }
            this.upgrade.set(mapEntity)
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

    removePlayersMapEntity() {
        const entity = this.playersMapEntity.get()
        if(!entity) {
            return undefined
        } else {
            this.playersMapEntity.set(undefined)
            if(entity instanceof Estate) {
                return entity.actionCardGetAfterDestroy
            } else {
                return undefined
            }
        }
    }
}