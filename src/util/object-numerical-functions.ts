export function withdrawFromObjectsValue<
  T extends object,
  K extends keyof T
>(obj: T, key: K, max: number) {
    const value = obj[key];
    if (typeof value !== "number") {
        throw new Error(`Property ${String(key)} is not a number`);
    }
    const amountToWithdraw = Math.max(Math.min(value, max),0)
    obj[key] = (value - amountToWithdraw) as T[K]
    return amountToWithdraw
}