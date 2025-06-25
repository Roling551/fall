import { signal } from "@angular/core";
import { Building } from "./building"
import { Estate } from "./estate"

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
    };

export class Technology {
    public unlocked = signal(false);
    constructor(public name: string, public benefits: TechnologyBenefit[]) {}
}