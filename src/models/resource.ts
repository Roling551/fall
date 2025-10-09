export type Resource = "water" | "oil" | "scrap"

export function getResourceSymbol(resource: Resource) {
    switch(resource) {
        case "water":
            return "w";
        case "oil":
            return "o";
        case "scrap":
            return "s";
    }
}

export function resourcesToString(resources: Map<Resource, number>) {
    return [...resources.entries()].map(x=>getResourceSymbol(x[0])+"-"+x[1]).join(', ')
}