const {NodeSDK} = require('@opentelemetry/sdk-node');
const {getNodeAutoInstrumentations} = require("@opentelemetry/auto-instrumentations-node");

const sdk = new NodeSDK({
    instrumentations: [
        getNodeAutoInstrumentations(),
    ],
});
sdk.start();

function shutdown() {
    sdk.shutdown().then(() => {
        console.log('Successfylly shutdown OpenTelemetry');
    });
}

// Without this, the server hangs and will not shutdown.
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
