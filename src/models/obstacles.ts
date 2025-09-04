export type ObstacleType = "swamp" | "mountain"

export class Obstacles {
    constructor(public obstacles: Map<ObstacleType, number> = new Map()) {}

    getDistance(bonus?: Map<ObstacleType, number>) {
        let distance = 1
        for(const obstacle of this.obstacles) {
            distance += Math.max(0, obstacle[1]-(bonus?.get(obstacle[0])||0))
        }
        return distance
    }
}