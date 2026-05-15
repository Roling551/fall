export interface Addable<T> {
    zero(): T
    add(t: T): T
    multiply(n: number): T
}