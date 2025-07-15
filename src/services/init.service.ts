import { Injectable, Signal } from "@angular/core";
import { AvaliableService } from "./avaliable.service";
import { Extraction } from "../models/extraction";
import { WorldStateService } from "./world-state.service";
import { ExtractionSite } from "../models/extraction-site";

@Injectable({
  providedIn: 'root'
})
export class InitService {

    constructor(public avaliableSerivce: AvaliableService, public worldStateService: WorldStateService) {}

    init() {
        this.avaliableSerivce.addAvaliableExtraction("gathering", ()=>new Extraction(new Set(["berries"]), new Map([["food",1]])))
        this.worldStateService.tiles.get("1_1")?.value.mapEntity.set(new ExtractionSite("forest", [["berries", 5]]))
    }
}