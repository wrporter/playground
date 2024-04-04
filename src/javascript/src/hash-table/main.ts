export class HashTable {
    /*
    Collision Strategies:
    - Probing to find an available spot.
    - Buckets of lists for each has spot.
     */

    private table: { key: string; value: any }[][] = new Array(2);

    /**
     * Map the given key to the given value.
     * @returns The previous value mapped to the key, or null.
     */
    put(key: string, value: any): any {
        const index = this.hash(key) % this.table.length;
        const bucket = this.table[index];
        let previousValue: null | any = null;

        if (bucket) {
            for (let i = 0; i < bucket.length && !previousValue; i += 1) {
                if (bucket[i].key === key) {
                    previousValue = bucket[i].value;
                    bucket[i].value = value;
                }
            }

            if (!previousValue) {
                bucket.push({ key, value });
            }
        } else {
            this.table[index] = [{ key, value }];
        }

        // TODO: Resize the table when it is full.
        // TODO: Keep track of table size (positions taken up).

        return previousValue;
    }

    /**
     * @returns The current mapped value for the key, or null.
     */
    get(key: string): any {
        const index = this.hash(key) % this.table.length;
        const bucket = this.table[index];

        if (bucket) {
            for (let i = 0; i < bucket.length; i += 1) {
                if (bucket[i].key === key) {
                    return bucket[i].value;
                }
            }
        }

        return null;
    }

    /**
     * Remove the key from the hashtable.
     * @returns The previous mapped value for the key, or null.
     */
    delete(key: string): any {
        const index = this.hash(key) % this.table.length;
        const bucket = this.table[index];

        if (bucket) {
            for (let i = 0; i < bucket.length; i += 1) {
                if (bucket[i].key === key) {
                    const prev = bucket[i].value;
                    bucket.splice(i, 1);
                    return prev;
                }
            }
        }

        return null;
    }

    hash(key: string) {
        let h = 0;
        for (let i = 0; i < key.length; i += 1) {
            h += key.charCodeAt(i);
        }
        return h;
    }
}
