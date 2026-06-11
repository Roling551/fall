import { computed, Signal, signal } from "@angular/core";
import { addExistingNumericalValues } from "../util/map-functions";
import { SignalsGroup } from "../util/signals-group";
import { EstateProductionBonusAndQualifier, MovementBonusAndQualifier, TileBonus, tileBonusToTextParts } from "./bonus";
import { MapEntity } from "./map-entity";
import { TurnActor } from "./turn-actor";
import { Tile } from "./tile/tile";
import { Resource, resourcesToTextParts } from "./resource";
import { createForceSignal } from "../util/force-signal";
import { Coordinate } from "./coordinate";
import { ActionCardInfo } from "./action-card-info";
import { Benefit } from "./benefit";
import { EstateInfoInput } from "../services/cards-operations.service";
import { TextPart } from "./text-part";
import { Extraction } from "./extraction";

export class Estate extends MapEntity implements TurnActor{
    private isDisabled = signal(false)
    public tileBonus
    public movementBonus
    affectedCoordinates
    readonly type
    effectsDescriptions: Signal<TextPart[][]>

    constructor(
        public tile: Tile, 
        public name: string, 
        public runCost: Map<Resource, number>,
        affectedCoordinates: Coordinate[],
        public additionalInfo: EstateInfoInput,
        public costPaid: Map<Resource, number>,
        public maxDistance: number,
        private mapInteractionAction_?: (tile: Tile)=>void,
        private mapGatheringAction_?: (tile: Tile)=>void,
        public producedResources?: Map<Resource, number>,
        tileBonus?: TileBonus,
        movementBonus?: number,
        public actionCardGetAfterDestroy?: ActionCardInfo,
        public picture?: String,
        type?: "estate" | "upgrade",
    ) {
        super(name, 0)
        this.tileBonus = createForceSignal(tileBonus)
        this.movementBonus = createForceSignal(movementBonus)
        this.affectedCoordinates = affectedCoordinates.map(x=>x.addCoordinates(tile.coordinate).getKey())
        this.type = type || "estate"
        this.effectsDescriptions = Estate.getEffectsDescriptionsFunction(this.additionalInfo)
    }

    getProducedResources(): Map<Resource, number> | undefined {
        return this.producedResources
    }

    benefits = computed<Benefit[]>(() => {
        const benefits:Benefit[] = []
        const tileBonus = this.tileBonus.get()
        if (tileBonus) {
            benefits.push({
                type: "tile-bonus",
                bonus: {
                    name: "tile-bonus:"+this.tile.coordinate.getKey(),
                    bonus: tileBonus,
                    qualifier: (tile: Tile)=> {
                        return this.affectedCoordinates.includes(tile.coordinate.getKey())
                    }
                }
            })
        }
        if(this.movementBonus.get()) {
            benefits.push({
                type: "movement-bonus",
                bonus: {
                    name: this.tile.coordinate.getKey(),
                    bonus: this.movementBonus.get()!,
                    qualifier: (tile: Tile)=> {
                        return this.affectedCoordinates.includes(tile.coordinate.getKey())
                    }
                }
            })
        }
        return benefits
    })  
    mapInteractionAction(): void {
        if(this.disabled()) {
            return
        }
        this.mapInteractionAction_?.(this.tile)
    }
    mapGatheringAction(): void {
        if(this.disabled()) {
            return
        }
        this.mapGatheringAction_?.(this.tile)
    }

    disabled = computed(()=>{
        return this.isDisabled()
    })

    getRequiredResources(): Map<Resource, number> {
        return new Map(this.runCost)
    }
    disable() {
        this.isDisabled.set(true)
    }
    enable() {
        this.isDisabled.set(false)
    }
    switchEnabled() {
        this.isDisabled.update(x=>!x)
    }

    override extractionAction(extraction: Extraction) {
        return {}
    }

    override canAttemptExtractionAction(extraction: Extraction): boolean {
        return false
    }

    static getEffectsDescriptionsFunction(additionalInfo: EstateInfoInput) {
        return computed(()=>{
            const descriptions: TextPart[][] = []
            if(additionalInfo.extraction) {
                descriptions.push(["apply:", ...additionalInfo.extraction.getTextParts()])
            }
            if(additionalInfo.tileBonus) {
                descriptions.push(["bonus:", ...tileBonusToTextParts(additionalInfo.tileBonus)])
            }
            if(additionalInfo.producedResources) {
                descriptions.push((["produces:", ...resourcesToTextParts(additionalInfo.producedResources)]))
            }
            if(additionalInfo.movementBonus) {
                descriptions.push(["move:+" + additionalInfo.movementBonus])
            }
            return descriptions
        })
    }
}