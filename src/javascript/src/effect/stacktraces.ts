import { Effect } from 'effect';

const fail = Effect.gen(function* () {
    throw new Error('gen1');
});

const program = Effect.fn('span1')(function* () {
    return yield* fail;
});

Effect.runFork(program().pipe(Effect.catchAllCause(Effect.logError)));
