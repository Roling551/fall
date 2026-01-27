import { TextPart } from "./text-part";

export const ResourceKeys = [
  "water",
  "oil",
  "scrap",
  "plastic",
  "electricity",
  "computation",
] as const;

export type Resource = typeof ResourceKeys[number];

export function resourcesToTextParts(resources: Map<Resource, number>): TextPart[] {
    return [...resources.entries()].flatMap(x=>[x[1].toString(),{type:"emoticon",emoticon:x[0]}," "])
}

export function isResourcePermanent(resource: Resource) {
    switch(resource) {
        case "water":
            return true;
        case "oil":
            return true;
        case "scrap":
            return true;
        case "plastic":
            return true;
        case "electricity":
            return false;
        case "computation":
            return false;
    }
}