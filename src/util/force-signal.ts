import { signal, Signal, WritableSignal } from '@angular/core';

export type ForceSignal<T> = {
    get: () => T;
    set: (value: T) => void;
    update: (fn: (current: T) => T) => void;
    forceUpdate: () => void;
}

export function createForceSignal<T>(initialValue: T) {
  const base = signal(initialValue);
  const forceTrigger = signal(true);

  const exposed = {
    get: (): T => {
      forceTrigger();
      return base();
    },
    set: (value: T) => base.set(value),
    update: (fn: (current: T) => T) => base.update(fn),
    forceUpdate: () => forceTrigger.update(x => !x),
  };

  return exposed;
}