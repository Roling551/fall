import { Injectable } from "@angular/core";
import { TechnologiesService } from "./technologies/technologies.service";
import { Benefit } from "../models/benefit";
import { AvaliableService } from "./avaliable.service";
import { BonusesService } from "./bonuses.service";

@Injectable({
  providedIn: 'root'
})
export class BenefitsService {
    constructor(
        private technologiesService: TechnologiesService, 
        private avaliableService: AvaliableService, 
        private bonusesService: BonusesService) 
    {
        this.technologiesService.addTechnology.subscribe((benefit: Benefit)=>{
            if(benefit.type === "unlock-estate") {
                this.avaliableService.addAvaliabeEstate(benefit.estateName, benefit.getEstate)
            } else if(benefit.type === "estate-production-bonus") {
                this.bonusesService.estateProductionBonuses.add(benefit.bonus, benefit.bonus)
            }
        })
    }


}