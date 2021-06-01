export class SortedMap extends Map {

    sortedKeys = [];

    set(key, value) {
        if (isNaN(parseInt(key))) {
            throw new Error('key must be an integer');
        }

        if (this.sortedKeys.findIndex(val => val === key) === -1) {
            this.sortedKeys.push(key);
            this.sortedKeys.sort();
        }
        super.set(key, value);
    }

    delete(key) {
        if (isNaN(parseInt(key))) {
            throw new Error('key must be an integer');
        }
        let keyIndex;
        if ((keyIndex = this.sortedKeys.findIndex(val => val === key)) === -1) {
            return false;
        }
        this.sortedKeys.splice(keyIndex, 1);
        super.delete(key);
        return true;
    }

    forEach(cb) {
        this.sortedKeys.forEach((val, index) => {
            cb(super.get(val), index, val, this);
        });
    }

    map(cb) {
        const newSortedMap = new SortedMap();
        this.sortedKeys.forEach((val, index) => {
            newSortedMap.set(val, cb(super.get(val), val, index, this));
        });
        return newSortedMap;
    }

}
