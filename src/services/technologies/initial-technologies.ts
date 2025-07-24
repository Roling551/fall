import { Estate } from "../../models/estate";
import { Technology } from "../../models/technology";


export const initialTechnologies:Technology[] = [
    new Technology("Writing", new Map(), {avaliable: true}),
    new Technology("Masonry", new Map()),
    new Technology("Farming", new Map([
        [
            "unlock_farm",
            {
                type: "unlock-estate",
                estateName: "farm",
                getEstate: () => new Estate("farm", new Map([["food",2], ["workers-need", 1]]))
            }
        ]
    ])),
    new Technology("Irrigation", new Map([
        [
            "farm_bonus",
            {
                type: "estate-production-bonus",
                bonus: {
                    type: "estate-production",
                    name: "Irrigation",
                    qualifier: (estate: Estate)=>estate.name==="farm",
                    bonus: (estate: Estate)=>new Map([["food",1]])
                }
            }
        ]
    ])),
    new Technology("Mining", new Map([
        [
            "unlock-tower",
                    {
                name: "unlock-tower",
                type: "unlock-estate",
                estateName: "tower",
                getEstate: () => new Estate("tower", new Map([["authority",5], ["workers-need", 1]]))
            }
        ]
    ]), {width: 2}),
    new Technology("Towers", new Map([
        [
            "unlock-mine",
            {
                type: "unlock-estate",
                estateName: "mine",
                getEstate: () => new Estate("mine", new Map([["gold",1], ["workers-need", 1]]))
            }
        ]
    ])),
]

export const initiaTechnologiesParenthood: [string, string][] = [
    ["Writing", "Farming"],
    ["Farming", "Irrigation"],
    ["Writing", "Masonry"],
    ["Masonry", "Mining"],
    ["Masonry", "Towers"],
]

export const topTechnologyName = "Writing"