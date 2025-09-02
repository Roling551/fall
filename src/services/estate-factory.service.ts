import { Injectable } from "@angular/core";
import { Estate } from "../models/estate";
import { WorldStateService } from "./world-state/world-state.service";

@Injectable({
  providedIn: 'root'
})
export class EstateFactoryService {

    constructor(worldStateService: WorldStateService) {

    }

    getCreateEstateFunction() {
        return () => new Estate("farm")
    }
}