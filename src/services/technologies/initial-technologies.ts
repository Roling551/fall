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

    new TechnologySelection("Example_selection", new Set(
        [
            avaliableTechnologies.get("tech1")!,
            avaliableTechnologies.get("tech2")!,
        ])
    )
].map(x=>getTechnologyTreeItem(x)).filter(x=>!!x)

export const initiaTechnologiesParenthood: [string, string][] = [
    ["Writing", "Masonry"],
    ["Writing", "Example_selection"],
]

export const topTechnologyName = "Writing"