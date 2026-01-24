import { EstateProductionBonusAndQualifier, ExtractionBonusAndQualifier, MovementBonusAndQualifier } from "./bonus";
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
        type: "extraction-bonus";
        bonus: ExtractionBonusAndQualifier
    }        |
    {
        type: "movement-bonus";
        bonus: MovementBonusAndQualifier
    }