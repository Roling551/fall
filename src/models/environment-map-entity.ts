import { computed } from "@angular/core";
import { ForceSignal } from "../util/force-signal";
import { LimitedSet } from "../util/limited-set";
import { multiplyNumericalValues, multiplyNumericalValuesFunctional } from "../util/map-functions";
import { Building } from "./building";
import { MapEntity, MapEntityType, SkillActionResult } from "./map-entity";
import { Resource, resourcesToTextParts } from "./resource";
import { Reward } from "./reward";
import { SimpleActee } from "./simple-actee";
import { getSkillSymbol, Skill } from "./skill";
import { TextPart } from "./text-part";
import { Actee } from "./actee";
import { Extraction } from "./extraction";

export type ExtractableModifications = "Hardness" | "Fragility"

export type ExtractableSettings = {
    maxProgress: number, 
    modifications?: Map<ExtractableModifications, number>
}

export class EnvironmentMapEntity extends MapEntity {
    readonly type = "environment";
    actee?: SimpleActee

    constructor(name: string, extractableSettings?: ExtractableSettings, public resourcesGain?: Map<Resource, number>, private onDepletedRewardsGetter?: ()=>Reward[]) {
        super(name);
        if(extractableSettings) {
            this.actee = new SimpleActee(extractableSettings)
        }
    }

    override extractionAction(extraction: Extraction): SkillActionResult {
        if(!this.actee) {
            return {}
        }
        const actionResult = this.actee.extractionAction(extraction)
        if(this.onDepletedRewardsGetter && actionResult.justFinished) {
            this.onDepletedRewardsGetter().forEach(x=>x.claim())
        }
        if(this.onSelfDestroy && actionResult.justFinished) {
            this.onSelfDestroy()
        }
        return {
            ...(this.resourcesGain && {resourcesGained: multiplyNumericalValuesFunctional(this.resourcesGain, actionResult.progressDone)})
        }
    }

    override canAttemptExtractionAction(extraction: Extraction): boolean {
        return !!this.actee && this.actee.canAttemptExtractionAction(extraction)
    }

    getDescription = computed<TextPart[]>(() => {
        if(!this.actee) {
            return []
        }
        let textParts:TextPart[] =  []
        if(this.resourcesGain) {
            textParts = textParts.concat(
                resourcesToTextParts(multiplyNumericalValuesFunctional(this.resourcesGain, this.actee.progressLeft()))
            )
        } else {
            textParts = textParts.concat(this.actee.progressLeft() + "/" + this.actee.maxProgress)
        }
        return textParts
    })
}