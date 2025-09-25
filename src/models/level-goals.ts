import { Resource } from "./resource";

export type LevelGoal = { type: "resources", resources: Map<Resource, number>}