import { Injectable } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { createTree } from "../models/cell";
import { Technology } from "../models/technology";
import { AvaliableService } from "./avaliable.service";
import { Estate } from "../models/estate";

@Injectable({
  providedIn: 'root'
})
export class TechnologiesService {

    constructor(private avaliableService: AvaliableService) {}

    initialTechnologies = {
        data: new Technology("Base", []),
        children: [
            {
                data: new Technology("Unlock farm", [
                {
                    type: "unlock-estate",
                    estateName: "farm",
                    getEstate: () => new Estate("farm", new Map([["food",2], ["food-need", 1]]))
                }
                ]),
                children: [
                    {
                        data: new Technology("Unlock mine", [
                        {
                            type: "unlock-estate",
                            estateName: "tower",
                            getEstate: () => new Estate("tower", new Map([["authority",5], ["food-need", 1]]))
                        }
                    ])},
                    {
                        data: new Technology("Unlock tower", [
                        {
                            type: "unlock-estate",
                            estateName: "mine",
                            getEstate: () => new Estate("mine", new Map([["gold",1], ["food-need", 1]]))
                        }
                    ])},
                ]
            },
            {data: new Technology("Base", [])},
            {data: new Technology("Base", [])},
        ]
    }
    technologies_ = createForceSignal(createTree(this.initialTechnologies))
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