import { EstateProductionBonusAndQualifier, MovementBonusAndQualifier, TileBonusAndQualifier } from "./bonus";
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
        bonus: EstateProductionBonusAndQualifier
    }
        |
    {
        type: "tile-bonus";
        bonus: TileBonusAndQualifier
    }
        |
    {
        type: "movement-bonus";
        bonus: MovementBonusAndQualifier
    }