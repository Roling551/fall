import { Injectable } from "@angular/core";
import { SkillMapActionSkillBonus } from "../models/bonus";
import { createForceSignal } from "../util/force-signal";

@Injectable({
  providedIn: 'root'
})
export class TurnBenefitsService {

    counter = 0

    constructor() {}

    skillMapActionSkillBonuses = createForceSignal(new Map<string, SkillMapActionSkillBonus>())

    nextTurn() {
        this.skillMapActionSkillBonuses.set(new Map())
    }

    addBonus(name: string, bonus: SkillMapActionSkillBonus) {
        this.skillMapActionSkillBonuses.get().set("turnBenefit_" + name + "_" + this.counter, bonus)
        this.skillMapActionSkillBonuses.forceUpdate()
        this.counter += 1
    }
}