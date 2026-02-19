export function addExistingNumericalValues(map: Map<any, number>, addedMap: Map<any, number>) {
    for (const [key, num] of map.entries()) {
        if(addedMap.has(key)) {
            map.set(key, num + addedMap.get(key)!)
        }
    }
}

export function addNumericalValues(map1: Map<any, number>, map2: Map<any, number>) {
    for (const [key, num] of map2.entries()) {
        map1.set(key, num + (map1.get(key) || 0))
    }
}

export function addNumericalValuesFunctional(map1?: Map<any, number>, map2?: Map<any, number>) {
    const newMap = new Map<any, number>()
    if(map1) {
        for (const [key, num] of map1.entries()) {
            newMap.set(key, num + (newMap.get(key) || 0))
        }
    }
    if(map2) {
        for (const [key, num] of map2.entries()) {
            newMap.set(key, num + (newMap.get(key) || 0))
        }
    }
    return newMap
}

export function substractNumericalValues(map1: Map<any, number>, map2: Map<any, number>) {
    for (const [key, num] of map2.entries()) {
        map1.set(key, (map1.get(key) || 0) - num)
    }
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

export function removeNonPositiveValues(map: Map<any, number>) {
    for (const [key, num] of map.entries()) {
        if(num <= 0) {
            map.delete(key)
        }
    }
}

export function removeNonPositiveValuesFunctional(map: Map<any, number>) {
    const newMap = new Map(map)
    for (const [key, num] of newMap.entries()) {
        if(num <= 0) {
            newMap.delete(key)
        }
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

export function roundDown(map: Map<any, number>) {
    for (const [key, num] of map.entries()) {
        map.set(key, Math.floor(num))
    }
}

export function roundDownFunctional(map: Map<any, number>) {
    const newMap = new Map<any, number>()
    for (const [key, num] of map.entries()) {
        newMap.set(key, Math.floor(num))
    }
    return newMap
}

export function mapContainsMap(map1: Map<any, number>, map2: Map<any, number>) {
    for (const [key, num] of map2.entries()) {
        if((map1.get(key) || 0) < num) {
            return false
        }
    }
    return true
}

export function addToMapValue(map: Map<any, number>, key:any, addent: number) {
    if(!map.has(key)) {
        return false
    }
    map.set(key, map.get(key)!+addent)
    return true
}

export function withdrawFromMapValue(map: Map<any, number>, key: any, max: number) {
    if(!map.has) {
        return 0
    }
    const amountToWithdraw = Math.max(Math.min(map.get(key)!, max),0)
    addToMapValue(map, key, -amountToWithdraw)
    return amountToWithdraw
}