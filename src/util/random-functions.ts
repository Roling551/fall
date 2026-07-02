export type DistributionAndValues<T> = [number, T][]

export function randomValue<T>(values: DistributionAndValues<T>, randomNumber?: number):T {
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

export function randomNumberFromRange(minInclusive: number, maxExclusive: number, randomNumber?: number) {
    if(randomNumber == undefined) {
        randomNumber = Math.random()
    }
    return Math.floor(randomNumber * (maxExclusive - minInclusive)) + minInclusive;
}

export function randomNumber(maxExclusive: number, randomNumber?: number) {
    if(randomNumber == undefined) {
        randomNumber = Math.random()
    }
    return Math.floor(randomNumber * (maxExclusive));
}
