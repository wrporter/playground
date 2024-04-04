// it.each([
//     {
//         input: 0,
//         want: 0,
//     },
// ])('todo - %#', ({ input, want }) => {
//     expect(input).toEqual(want);
// });

import { HashTable } from './main';

let hashTable: HashTable;

beforeEach(() => {
    hashTable = new HashTable();
});

describe('get', () => {
    it('returns null when the key does not exist', () => {
        expect(hashTable.get('a')).toBeNull();
    });

    it('returns the value when the key exists', () => {
        hashTable.put('a', 5);

        expect(hashTable.get('a')).toEqual(5);
    });
});

describe('delete', () => {
    it('returns null when the key does not exist', () => {
        expect(hashTable.delete('a')).toBeNull();
    });

    it('returns the previous value when the key exists', () => {
        hashTable.put('a', 5);

        expect(hashTable.delete('a')).toEqual(5);
    });
});
