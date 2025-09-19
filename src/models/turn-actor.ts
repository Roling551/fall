import { Resource } from "./resource"

export interface TurnActor {
    turnAction(): void
    getRequiredResources(): Map<Resource, number>
    disable: ()=>void
    enable: ()=>void
}