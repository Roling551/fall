import { computed, Signal, signal } from "@angular/core";
import { addExistingNumericalValues } from "../util/map-functions";
import { SignalsGroup } from "../util/signals-group";
import { EstateProductionBonusAndQualifier, MovementBonusAndQualifier } from "./bonus";
import { MapEntity } from "./map-entity";
import { TurnActor } from "./turn-actor";
import { Tile } from "./tile/tile";
import { Resource } from "./resource";
import { createForceSignal } from "../util/force-signal";
import { Coordinate } from "./coordinate";
import { ActionCardInfo } from "./action-card-info";
import { Benefit } from "./benefit";
import { EstateCardInputs } from "../services/action-cards/action-card-info-factory.service";
import { TextPart } from "./text-part";
import { Extraction } from "./extraction";

export class Estate extends MapEntity implements TurnActor{
    private forcefullyDisabled = signal(false)
    private manuallyDisabled = signal(false)
    public extractionBonus
    public movementBonus
    affectedCoordinates
    readonly type

    constructor(
        public tile: Tile, 
        public name: string, 
        public runCost: Map<Resource, number>,
        affectedCoordinates: Coordinate[],
        private additionalInfo: EstateCardInputs,
        public costPaid: Map<Resource, number>,
        public maxDistance: number,
        private mapInteractionAction_?: (tile: Tile)=>void,
        private mapGatheringAction_?: (tile: Tile)=>void,
        public producedResources?: Map<Resource, number>,
        extractionBonus?: Extraction,
        movementBonus?: number,
        public actionCardGetAfterDestroy?: ActionCardInfo,
        public picture?: String,
        type?: "estate" | "upgrade",
    ) {
        super(name, 0)
        this.extractionBonus = createForceSignal(extractionBonus)
        this.movementBonus = createForceSignal(movementBonus)
        this.affectedCoordinates = affectedCoordinates.map(x=>x.addCoordinates(tile.coordinate).getKey())
        this.type = type || "estate"
    }

    getProducedResources(): Map<Resource, number> | undefined {
        return this.producedResources
    }

    benefits = computed<Benefit[]>(() => {
        const benefits:Benefit[] = []
        const bonus = this.extractionBonus.get()
        if (bonus) {
            benefits.push({
                type: "extraction-bonus",
                bonus: {
                    name: "extraction-bonus:"+this.tile.coordinate.getKey(),
                    bonus,
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
        return this.forcefullyDisabled() || this.manuallyDisabled()
    })

    getRequiredResources(): Map<Resource, number> {
        return new Map(this.runCost)
    }
    disable() {
        this.forcefullyDisabled.set(true)
    }
    enable() {
        this.forcefullyDisabled.set(false)
    }
    manuallySwitchEnabled() {
        this.manuallyDisabled.update(x=>!x)
    }

    override extractionAction(extraction: Extraction) {
        return {}
    }

    override canAttemptExtractionAction(extraction: Extraction): boolean {
        return false
    }

    effectsDescriptions = computed(()=>{
        const descriptions: TextPart[][] = []
        if(this.additionalInfo.extraction) {
            descriptions.push(["apply:" + this.additionalInfo.extraction])
        }
        if(this.additionalInfo.extractionBonus) {
            descriptions.push(["bonus:" + this.additionalInfo.extractionBonus.getTextParts()])
        }
        if(this.additionalInfo.movementBonus) {
            descriptions.push(["move:+" + this.additionalInfo.movementBonus])
        }
        return descriptions
    })
}