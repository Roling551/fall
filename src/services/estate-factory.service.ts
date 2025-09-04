import { Injectable } from "@angular/core";
import { Estate } from "../models/estate";
import { WorldStateService } from "./world-state/world-state.service";
import { Tile } from "../models/tile";
import { addToMapValue, withdrawFromMapValue } from "../util/map-functions";
import { Resource } from "../models/resource";
import { withdrawFromObjectsValue } from "../util/object-numerical-functions";
import { Coordinate } from "../models/coordinate";

export interface CreateEstateInfo {
    getEstate: (tile: Tile) => Estate,
    affectedCoordinate: Coordinate[]
}

@Injectable({
  providedIn: 'root'
})
export class EstateFactoryService {

    constructor(private worldStateService: WorldStateService) {}

    getCreateEstateInfo() {
        return {
            getEstate: (tile_: Tile) => new Estate(tile_, "farm", this.getSimpleExtractionAction("oil", 3)),
            affectedCoordinate: [new Coordinate(0,0)]
        }
    }

    private getSimpleExtractionAction(resource: Resource, amount: number) {
        return (tile: Tile)=>{
            let amountLeft = amount
            for(const source of tile.resourceSources.get()) {
                if(amountLeft <= 0) {
                    break;
                }
                if(source.type === resource) {
                    const avaliableAmount = withdrawFromObjectsValue(source, "amount", amountLeft)
                    addToMapValue(this.worldStateService.resources.get(), resource, avaliableAmount)
                    this.worldStateService.resources.forceUpdate()
                    amountLeft -= avaliableAmount
                }
            }
            tile.resourceSources.forceUpdate()
        }
    }
}