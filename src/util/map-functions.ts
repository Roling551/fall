export function addExistingNumericalValues(map: Map<any, number>, addedMap: Map<any, number>) {
    for (const [key, num] of map.entries()) {
        if(addedMap.has(key)) {
            map.set(key, num + addedMap.get(key)!)
        }
    }
}

export function addNumericalValuesFunctional(map1: Map<any, number>, map2: Map<any, number>) {
    const newMap = new Map<any, number>()
    for (const [key, num] of map1.entries()) {
        newMap.set(key, num + (newMap.get(key) || 0))
    }
    for (const [key, num] of map2.entries()) {
        newMap.set(key, num + (newMap.get(key) || 0))
    }
    return newMap
}

export function substractNumericalValuesFunctional(map1: Map<any, number>, map2: Map<any, number>) {
    const newMap = new Map<any, number>()
    for (const [key, num] of map1.entries()) {
        newMap.set(key, num + (newMap.get(key) || 0))
    }
    for (const [key, num] of map2.entries()) {
        newMap.set(key, (newMap.get(key) || 0) - num)
    }
    return newMap
}

export function multiplyNumericalValues(map: Map<any, number>, multiplicant: number) {
    for (const [key, num] of map.entries()) {
        map.set(key, map.get(key)!*multiplicant)
    }
}

export function multiplyNumericalValuesFunctional(map: Map<any, number>, multiplicant: number) {
    const newMap = new Map<any, number>()
    for (const [key, num] of map.entries()) {
        newMap.set(key, num*multiplicant)
    }
    return newMap
}