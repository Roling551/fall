import { Injectable } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { ExtractionBonus } from "../models/extraction";
import { ExtractionBonusAndQualifier } from "../models/bonus";
import { Benefit } from "../models/benefit";

@Injectable({
  providedIn: 'root'
})
export class TurnBenefitsService {

    counter = 0

    benefits = createForceSignal<Map<string, Benefit>>(new Map())

    nextTurn() {
        this.benefits.set(new Map())
    }

    addBonus(benefit: Benefit) {
        this.benefits.get().set("turnBenefit_" + name + "_" + this.counter, benefit)
        this.counter += 1
    }
}