import { greet } from './greet';

describe('greet', () => {
    it('uses the most common greeting', () => {
        expect(greet()).toEqual('Hello, World!');
    });
});
