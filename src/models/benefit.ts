import { EstateProductionBonus } from "./bonus";
import { Building } from "./building";
import { Estate } from "./estate";
import { Extraction } from "./extraction";

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
        type: "unlock-extraction";
        extractionName: string;
        getExtraction: () => Extraction 
    }
        |
    {
        type: "estate-production-bonus";
        bonus: EstateProductionBonus
    };