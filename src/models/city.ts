import { computed, signal } from "@angular/core";
import { createForceSignal, ForceSignal } from "../util/force-signal"
import { Coordinate } from "./coordinate"
import { KeyValuePair } from "./key-value-pair"
import { Tile } from "./tile"
import { MapEntity } from "./map-entity";
import { Estate } from "./estate";
import { addExistingNumericalValues } from "../util/map-functions";
import { Extraction } from "./extraction";
import { Benefit } from "./benefit";
import { Population } from "./population";
import { OneTimeJob } from "./one-time-job";

export class City extends MapEntity {
    constructor() {
        super("city", 4)
    }

    readonly type = "city"

    ownedTiles = createForceSignal(new Map<string, KeyValuePair<Coordinate, Tile>>());

    extractions = createForceSignal(new Map<string, Extraction>())

    population = new Population(5, this)

    public jobs = createForceSignal(new Set<OneTimeJob>())

    addOwnedTile(tile: KeyValuePair<Coordinate, Tile>) {
        this.ownedTiles.get().set(tile.key.getKey(), tile)
        this.ownedTiles.forceUpdate()
    }

    removeOwnedTile(tile: KeyValuePair<Coordinate, Tile>) {
        this.ownedTiles.get().delete(tile.key.getKey())
        this.ownedTiles.forceUpdate()
    }

    clearOwnedTiles() {
        this.ownedTiles.get().clear()
        this.ownedTiles.forceUpdate()
    }

    ownedTilesNumber = computed(()=>{
        return this.ownedTiles.get().size
    })

    canNextTurn = computed(()=>{
        return true
        // return this.produced().get("authority")! >= this.produced().get("authority-need")! 
        //     &&
        // this.produced().get("workers")! >= this.produced().get("workers-need")!
    })

    nextTurn() {
        this.population.nextTurn()
        let changeHappend = false;
        for(const job of this.jobs.get()) {
            if(job.work()) {
                this.jobs.get().delete(job)
                changeHappend = true
            }
        }
        if(changeHappend) {
            this.jobs.forceUpdate()
        }
    }

    override produced = computed(()=>{
        const production = new Map(super.baseProduced())
        addExistingNumericalValues(production, this.population.produced())
        for (const [key, tile] of this.ownedTiles.get().entries()) {
            const mapEntity = tile.value.mapEntity.get()
            if(!!mapEntity && mapEntity.type === "estate") {
                const estate = mapEntity as Estate
                addExistingNumericalValues(production, estate.produced())
            }
        }
        for (const [name, extraction] of this.extractions.get()) {
            addExistingNumericalValues(production, extraction.produced())
        }
        for (const job of this.jobs.get()) {
            addExistingNumericalValues(production, job.produced())
        }
        production.set("authority-need", production.get("authority-need")! + this.ownedTilesNumber())
        production.set("workers", this.population.amount())
        return production
    })

    getExtractionRate = computed(()=>{
        
    })

    getOrCreateExtraction(extractionName: string, extractionConstructor: (belongsTo: any)=> Extraction) {
        if(this.extractions.get().has(extractionName)) {
            return this.extractions.get().get(extractionName)!
        } else {
            const extraction = extractionConstructor(self)
            this.extractions.get().set(extractionName, extraction)
            this.extractions.forceUpdate()
            return extraction
        }
    }

    benefits = computed<Map<string, Benefit>>(()=>{
        let result = new Map<string, Benefit>();
        for(const [key, value] of this.extractions.get()) {
            result = new Map([...result, ...value.benefits()])
        }
        return result
    })

    addJob(job: OneTimeJob) {
        this.jobs.get().add(job)
        this.jobs.forceUpdate()
    }

    deleteJob(job: OneTimeJob) {
        this.jobs.get().delete(job)
        this.jobs.forceUpdate()
    }
}