export type DistributionAndValues<T> = [chance:number, ValueChangeEvent:T][]

export function chooseRandom<T>(values: DistributionAndValues<T>, randomNumber?: number):T {
    if(randomNumber == undefined) {
        randomNumber = Math.random()
    }
    let totalChance = 0
    for(let i = 0; i<values.length; i++) {
        totalChance += values[i][0]
        if(totalChance > randomNumber) {
            return values[i][1]
        }
    }
    return values[values.length-1][1]
}

export function randomFunctionFromRange(minInclusive: number, maxExclusive: number, randomNumber?: number) {
    if(randomNumber == undefined) {
        randomNumber = Math.random()
    }
    return Math.floor(randomNumber * (maxExclusive - minInclusive)) + minInclusive;
}