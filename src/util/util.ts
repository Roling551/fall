export function getFirstOfSet<T>(set: Set<T>): T {
    for(const item of set) {
        return item;
    }
    throw Error("Set is empty")
}