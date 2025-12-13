export const ResourceKeys = [
  "water",
  "oil",
  "scrap",
  "electricity",
  "computation",
] as const;

export type Resource = typeof ResourceKeys[number];

export function getResourceSymbol(resource: Resource) {
    switch(resource) {
        case "water":
            return "w";
        case "oil":
            return "o";
        case "scrap":
            return "s";
        case "electricity":
            return "z"
        case "computation":
            return "c"
    }
}

export function resourcesToString(resources: Map<Resource, number>) {
    return [...resources.entries()].map(x=>getResourceSymbol(x[0])+"-"+x[1]).join(', ')
}

export function isResourcePermanent(resource: Resource) {
    switch(resource) {
        case "water":
            return true;
        case "oil":
            return true;
        case "scrap":
            return true;
        case "electricity":
            return false;
        case "computation":
            return false;
    }
}