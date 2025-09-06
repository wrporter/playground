import { Config, ConfigProvider, Effect } from 'effect';

const config = Effect.runSync(
    Effect.withConfigProvider(
        Config.all({
            baseUrl: Config.string('baseUrl').pipe(
                Config.withDescription('Base URL to visit for each test.'),
                Config.withDefault('https://cloudcity.ub.opengov.engineering'),
            ),
            enableA11yScan: Config.boolean('enableA11yScan').pipe(
                Config.withDescription('Enable accessibility scan for all pages under test.'),
                Config.withDefault(false),
            ),
            basicUserName: Config.redacted('basicUserName').pipe(
                Config.withDescription('TODO: Describe what basic means'),
            ),
        }),
        ConfigProvider.fromEnv().pipe(ConfigProvider.snakeCase, ConfigProvider.upperCase),
    ),
);

console.log(config);
