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
        newMap.set(key, num + map1.get(key)!)
    }
    for (const [key, num] of map2.entries()) {
        newMap.set(key, num + map2.get(key)!)
    }
    return newMap
}