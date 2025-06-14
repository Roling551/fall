export type mapEntityType = "city" | "genericMapEntity"

export abstract class MapEntity {
    abstract readonly type: mapEntityType
    constructor(public textureName: string){};
}