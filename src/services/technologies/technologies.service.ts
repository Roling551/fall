import { Injectable } from "@angular/core";
import { createForceSignal } from "../../util/force-signal";
import { Technology } from "../../models/technology";
import { AvaliableService } from "../avaliable.service";
import { Estate } from "../../models/estate";
import { Cell, createTreeFromPairs } from "../../models/cell";
import { initialTechnologies, initiaTechnologiesParenthood, topTechnologyName } from "./initial-technologies";
import { BonusesService } from "../bonuses.service";
import { Benefit } from "../../models/benefit";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TechnologiesService {

    constructor(private avaliableService: AvaliableService, private bonusesService: BonusesService) {}

    technologies_ = createForceSignal(createTreeFromPairs(topTechnologyName, initialTechnologies, initiaTechnologiesParenthood, (technology: Technology) => technology.name))
    technologies = this.technologies_.get

    addTechnology = new Subject<Benefit>()

    public unlock(cell: Cell<Technology>) {
        const technology = cell.value
        technology.unlocked.set(true)
        for(const childCell of cell.children) {
            childCell.value.avaliable.set(true)
        }
        for(const benefit of technology.benefits) {
            this.addTechnology.next(benefit)
        }
    }
}