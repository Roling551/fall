import { Benefit } from "./benefit";
import { Estate } from "./estate";
import { Extraction } from "./extraction";

export const possibleExtractions = new Map<string, () => Extraction>([
    [
        "forest-gathering",
        ()=>new Extraction(new Set(["berries"]), new Map([["food",1]]), new Map())
    ],
    [
        "forest-warship",
        ()=>new Extraction(new Set(["berries"]), new Map([]), new Map([["farm-bonus", {
            type: "estate-production-bonus",
            bonus: {
                type: "estate-production",
                name: "farm-bonus",
                qualifier: (estate: Estate)=>estate.name==="farm",
                bonus: (estate: Estate)=>new Map([["food",1]])
            }
        }]]))
    ]
])