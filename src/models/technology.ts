import { signal } from "@angular/core";
import { Building } from "./building"
import { Estate } from "./estate"
import { EstateProductionBonus } from "./bonus";

export type TechnologyBenefit =
    {
        type: "unlock-estate";
        estateName: string;
        getEstate: () => Estate 
    } 
        |
    {
        type: "unlock-building";
        buidingName: string; 
        getBuilding: () => Building 
    }
        |
    {
        type: "estate-production-bonus";
        bonus: EstateProductionBonus
    };

export class Technology {
    public unlocked = signal(false);
    public avaliable = signal(false);
    constructor(public name: string, public benefits: TechnologyBenefit[], avaliable=false) {
        this.avaliable.set(avaliable);
    }
}