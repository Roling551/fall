import { Estate } from "../../models/estate";
import { Technology } from "../../models/technology";
import { TechnologySelection } from "../../models/technology-selection";
import { getTechnologyTreeItem, TechnologyTreeItem } from "../../models/technology-tree-item";

const avaliableTechnologies = new Map<string, Technology>([
    ["tech1", new Technology("Tech 1", new Map())],
    ["tech2", new Technology("Tech 2", new Map())]
])

export const initialTechnologies:TechnologyTreeItem[] = [
    new Technology("Writing", new Map()),
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
                estateName: "mine",
                getEstate: () => new Estate("mine", new Map([["gold",1], ["workers-need", 1]]))
            }
        ]
    ])),
    new Technology("Towers", new Map([
        [
            "unlock-mine",
            {
                type: "unlock-estate",
                estateName: "tower",
                getEstate: () => new Estate("tower", new Map([["authority",5], ["workers-need", 1]]))
            }
        ]
    ])),
    new TechnologySelection("Example_selection", new Set(
        [
            avaliableTechnologies.get("tech1")!,
            avaliableTechnologies.get("tech2")!,
        ])
    )
].map(x=>getTechnologyTreeItem(x)).filter(x=>!!x)

export const initiaTechnologiesParenthood: [string, string][] = [
    ["Writing", "Farming"],
    ["Farming", "Irrigation"],
    ["Writing", "Masonry"],
    ["Masonry", "Towers"],
    ["Writing", "Example_selection"],
    ["Example_selection", "Mining"],
]

export const topTechnologyName = "Writing"