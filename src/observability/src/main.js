import {createServer, log} from '@wesp-up/express';
import {SpanStatusCode, trace} from '@opentelemetry/api';
import promClient from 'prom-client';

const tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME ?? '');
const customCounter = promClient.Counter({
    name: 'custom_counter',
    help: 'This is a custom counter for an event we care about',
    labels: ['attribute1', 'attribute2'],
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class TestService {
    async mySpecialOperation() {
        const span = tracer.startSpan('your-span-name');

        try {
            await sleep(1000);

            customCounter.inc({attribute1: 'value1', attribute2: 'value2'});

            span.setAttribute('attributeKey', 'attributeValue');
            span.addEvent('Event X');
        } catch (error) {
            log.error({message: 'Failed my special operation!', error});
            span.recordException(error);
            span.setStatus({code: SpanStatusCode.ERROR, message: error.message});
        } finally {
            span.end();
        }
    }
}

const testService = new TestService();

createServer({
    mountApp(app) {
        app.get('*', async (req, res) => {
            await testService.mySpecialOperation()
            res.send('end');
        });
    }
}).start(4333, 22600);
