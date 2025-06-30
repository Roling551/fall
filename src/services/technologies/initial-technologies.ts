import { Estate } from "../../models/estate";
import { Technology } from "../../models/technology";


export const initialTechnologies:Technology[] = [
    new Technology("Writing", [], true),
    new Technology("Masonry", []),
    new Technology("Farming", [
        {
            type: "unlock-estate",
            estateName: "farm",
            getEstate: () => new Estate("farm", new Map([["food",2], ["food-need", 1]]))
        },
    ]),
    new Technology("Irrigation", [
        {
            type: "estate-production-bonus",
            bonus: {
                type: "estate-production",
                name: "Irrigation",
                qualifier: (estate: Estate)=>estate.name==="farm",
                bonus: (estate: Estate)=>new Map([["food",1]])
            }
        }
    ]),
    new Technology("Mining", [
        {
            type: "unlock-estate",
            estateName: "tower",
            getEstate: () => new Estate("tower", new Map([["authority",5], ["food-need", 1]]))
        }
    ]),
    new Technology("Towers", [
        {
            type: "unlock-estate",
            estateName: "mine",
            getEstate: () => new Estate("mine", new Map([["gold",1], ["food-need", 1]]))
        }
    ]),
]

export const initiaTechnologiesParenthood: [string, string][] = [
    ["Writing", "Farming"],
    ["Farming", "Irrigation"],
    ["Writing", "Masonry"],
    ["Masonry", "Mining"],
    ["Masonry", "Towers"],
]

export const topTechnologyName = "Writing"