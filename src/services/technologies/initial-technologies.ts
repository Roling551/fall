import { Estate } from "../../models/estate";
import { Technology } from "../../models/technology";


export const initialTechnologies:Technology[] = [
    new Technology("Writing", []),
    new Technology("Masonry", []),
    new Technology("Farming", [
        {
            type: "unlock-estate",
            estateName: "farm",
            getEstate: () => new Estate("farm", new Map([["food",2], ["food-need", 1]]))
        },
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
    ["Writing", "Masonry"],
    ["Masonry", "Mining"],
    ["Masonry", "Towers"],
]

export const topTechnologyName = "Writing"