import { Injectable } from "@angular/core";
import { Estate } from "../models/estate";
import { WorldStateService } from "./world-state/world-state.service";
import { Tile } from "../models/tile";

@Injectable({
  providedIn: 'root'
})
export class EstateFactoryService {

    constructor(worldStateService: WorldStateService) {

    }

    getCreateEstateFunction() {
        return (tile: Tile) => new Estate(tile, "farm")
    }
}