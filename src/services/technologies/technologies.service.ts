import { Injectable } from "@angular/core";
import { createForceSignal } from "../../util/force-signal";
import { Technology } from "../../models/technology";
import { AvaliableService } from "../avaliable.service";
import { Estate } from "../../models/estate";
import { createTreeFromPairs } from "../../models/cell";
import { initialTechnologies, initiaTechnologiesParenthood, topTechnologyName } from "./initial-technologies";

@Injectable({
  providedIn: 'root'
})
export class TechnologiesService {

    constructor(private avaliableService: AvaliableService) {}

    technologies_ = createForceSignal(createTreeFromPairs(topTechnologyName, initialTechnologies, initiaTechnologiesParenthood, (technology: Technology) => technology.name))
    technologies = this.technologies_.get

    public unlock(technology: Technology) {
        technology.unlocked.set(true)
        for(const benefit of technology.benefits) {
            if(benefit.type === "unlock-estate") {
                this.avaliableService.addAvaliabeEstate(benefit.estateName, benefit.getEstate)
            }
        }
    }
}