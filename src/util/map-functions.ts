export function addExistingNumericalValues(map: Map<any, number>, addedMap: Map<any, number>) {
    for (const [key, num] of map.entries()) {
        if(addedMap.has(key)) {
            map.set(key, num + addedMap.get(key)!)
        }
    }
}