import { signal, Signal, WritableSignal } from '@angular/core';

export function forceSignal<T>(initialValue: T) {
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
    readonly: base.asReadonly()
  };

  return exposed;
}