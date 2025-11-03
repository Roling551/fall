import { EstateProductionBonus, MovementBonus, SkillMapActionSkillBonus } from "./bonus";
import { Building } from "./building";
import { Estate } from "./estate";

export type Benefit =
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
    }
        |
    {
        type: "skill-map-action-skill-bonus";
        bonus: SkillMapActionSkillBonus
    }        |
    {
        type: "movement-bonus";
        bonus: MovementBonus
    }