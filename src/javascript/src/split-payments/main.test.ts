import { SplitPaymentProcessor } from './main.js';

describe('SplitPaymentProcessor', () => {
    it.each([
        {
            name: 'should process payments successfully',
            methods: [
                { method: 'Cash', amount: 120.21 },
                { method: 'Check', amount: 100 },
                { method: 'Card', amount: 200 },
            ],
            charges: [
                { id: 'aaa', amountDue: 100, method: 'Cash' },
                { id: 'bbb', amountDue: 20.21, method: 'Cash' },
                { id: 'ccc', amountDue: 200 },
                { id: 'ddd', amountDue: 100 },
            ],
            shouldThrow: false,
            expectedError: '',
        },
        {
            name: 'should throw an error for insufficient funds',
            methods: [{ method: 'Cash', amount: 50 }],
            charges: [{ id: 'aaa', amountDue: 100, method: 'Cash' }],
            shouldThrow: true,
            expectedError: 'Insufficient funds for charge aaa with Cash',
        },
        {
            name: 'should throw an error if not enough funds to cover default charges',
            methods: [
                { method: 'Cash', amount: 50 },
                { method: 'Check', amount: 20 },
            ],
            charges: [{ id: 'aaa', amountDue: 100 }],
            shouldThrow: true,
            expectedError: 'Not enough funds to cover charge aaa',
        },
        {
            name: 'should throw an error if more payment provided than required',
            methods: [{ method: 'Cash', amount: 500 }],
            charges: [{ id: 'aaa', amountDue: 100 }],
            shouldThrow: true,
            expectedError: 'More payment provided than required',
        },
    ])('$name', ({ methods, charges, shouldThrow, expectedError }) => {
        const processor = new SplitPaymentProcessor(methods, charges);
        if (shouldThrow) {
            expect(() => processor.validateAndProcessPayments()).toThrow(expectedError);
        } else {
            expect(() => processor.validateAndProcessPayments()).not.toThrow();
        }
    });
});
