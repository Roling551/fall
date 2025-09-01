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