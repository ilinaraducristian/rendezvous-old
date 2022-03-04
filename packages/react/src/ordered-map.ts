import { action, computed, makeObservable, observable } from "mobx";

class OrderedMap<K, V> extends Map<K, V> {
  orderedKeys: K[] = [];

  constructor();
  constructor(entries?: readonly (readonly [K, V])[] | null);
  constructor(entries?: readonly (readonly [K, V])[] | null) {
    super();
    makeObservable(this, {
      orderedKeys: observable,
      set: action,
      delete: action,
      array: computed,
    });
    if (entries === undefined || entries === null) return;
    this.setMultiple(entries as [K, V][]);
  }

  set(key: K, value: V, front: boolean = false) {
    super.set(key, value);
    if (front) {
      this.orderedKeys.splice(0, 0, key);
    } else {
      this.orderedKeys.push(key);
    }
    return this;
  }

  setMultiple(entries: [K, V][], front: boolean = false) {
    entries.forEach(([key, value]) => {
      this.set(key, value, front);
    });
  }

  delete(key: K): boolean {
    if (!super.delete(key)) return false;
    const index = this.orderedKeys.findIndex((element) => element === key);
    this.orderedKeys.splice(index, 1);
    return true;
  }

  get array(): V[] {
    return this.orderedKeys.map((key) => this.get(key)) as V[];
  }

  map<U>(callbackfn: (value: V, index: number, array: V[]) => U, thisArg?: this): U[] {
    return (thisArg ?? this).array.map(callbackfn);
  }
}

export default OrderedMap;
