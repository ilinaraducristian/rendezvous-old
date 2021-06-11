class SortedMap<V = any> extends Map<number, V> {

  private _size: number;
  private readonly sortedKeys: number[];

  constructor(entries?: readonly (readonly [number, V])[] | null) {
    super();
    this.sortedKeys = [];
    entries?.forEach(entry => {
      this.sortedKeys.push(entry[0]);
      super.set(entry[0], entry[1]);
    });
    this._size = this.sortedKeys.length;
  }

  get size(): number {
    return this._size;
  }

  set(key: number, value: V): this {
    if (this.sortedKeys === undefined) return this;
    if (this.sortedKeys.findIndex(val => val === key) === -1) {
      this.sortedKeys.push(key);
      this.sortedKeys.sort();
    }
    super.set(key, value);
    this._size = this.sortedKeys.length;
    return this;
  }

  get(key: number): V {
    const value = super.get(key);
    if (value === undefined) {
      throw new Error("Value cannot be undefined");
    }
    return value;
  }

  delete(key: number): boolean {
    let keyIndex;
    if ((keyIndex = this.sortedKeys.findIndex(val => val === key)) === -1) {
      return false;
    }
    this.sortedKeys.splice(keyIndex, 1);
    super.delete(key);
    this._size = this.sortedKeys.length;
    return true;
  }

  forEach(callbackfn: (value: V, index: number, map: Map<number, V>, key: number) => void): void {
      this.sortedKeys.forEach((key, index) => {
          callbackfn(this.get(key), index, this, key);
      });
  }

  has(key: number): boolean {
    return this.sortedKeys.includes(key);
  }

  clear(): void {
    this.sortedKeys.length = 0;
    super.clear();
  }

  // map<K = any>(callbackfn: (value: V, index: number, map: Map<number, V>, key: number) => K) {
  //     const newSortedMap = new SortedMap<K>();
  //     this.sortedKeys.forEach((key, index) => {
  //         newSortedMap.set(key, callbackfn(this.get(key), index, this, key));
  //     });
  //     return newSortedMap;
  // }

  toArray<T = any>(mappingfn?: (value: V, index: number, map: Map<number, V>, key: number) => T): (V | T)[] {
    return this.sortedKeys.map((key, index) => {
      const val = super.get(key);
      if (val === undefined) throw new Error("Value cannot be undefined");
      if (mappingfn !== undefined)
        return mappingfn(val, index, this, key);
      else return val;
    });
  }

}

export default SortedMap;
