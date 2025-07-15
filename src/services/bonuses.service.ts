import { Injectable } from "@angular/core";
import { SetChangesEmitter } from "../util/set-changes";
import { Estate } from "../models/estate";
import { SignalsGroup } from "../util/signals-group";
import { addExistingNumericalValues, addNumericalValuesFunctional } from "../util/map-functions";
import { EstateProductionBonus } from "../models/bonus";

@Injectable({
  providedIn: 'root'
})
export class BonusesService {
    estateProductionBonuses = new SetChangesEmitter<any, EstateProductionBonus>();
    listenForEstateProductionBonuses(estate: Estate) {
        return new SignalsGroup(
            this.estateProductionBonuses,
            (item: EstateProductionBonus)=>item.qualifier(estate),
            (item: EstateProductionBonus)=>item.bonus(estate),
            addNumericalValuesFunctional,
            ()=>new Map<string, number>()
        )
    }
}