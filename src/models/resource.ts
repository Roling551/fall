import { TextPart } from "./text-part";

export const ResourceKeys = [
  "water",
  "oil",
  "scrap",
  "plastic",
  "electricity",
  "computation",
  "artifacts",
] as const;

export type Resource = typeof ResourceKeys[number];

export function resourcesToTextParts(resources: Map<Resource, number>): TextPart[] {
    return [...resources.entries()].flatMap(x=>[x[1].toString(),{type:"emoticon",emoticon:x[0],hoverInfo: [x[0]]}," "])
}

export function isResourcePermanent(resource: Resource) {
    switch(resource) {
        case "electricity":
            return false;
        case "computation":
            return false;
        default:
            return true;
    }
}