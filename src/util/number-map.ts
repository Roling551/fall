import { Addable } from "./addable"
import { addNumericalValuesFunctional, multiplyNumericalValuesFunctional } from "./map-functions"

export class NumberMap<T> implements Addable<NumberMap<T>> {
    map = new Map()
    constructor(map?: Map<T,number>) {
        this.map = map || new Map()
    }
    zero(): NumberMap<T> {
        return new NumberMap(new Map())
    }
    add(t: NumberMap<T>): NumberMap<T> {
        return new NumberMap(addNumericalValuesFunctional(this.map, t.map))
    }
    multiply(n: number): NumberMap<T> {
        return new NumberMap(multiplyNumericalValuesFunctional(this.map, n))
    }
    copy(): NumberMap<T> {
        return new NumberMap(this.map)
    }
}