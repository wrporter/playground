import {createServer} from '@wesp-up/express';
import {SpanStatusCode, trace} from '@opentelemetry/api';

const tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME ?? '');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class TestService {
    async mySpecialOperation() {
        const span = tracer.startSpan('your-span-name');

        try {
            await sleep(1000);
            throw new Error('kaboom!');

            span.setAttribute('attributeKey', 'attributeValue');
            span.addEvent('Event X');
        } catch (error) {
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
}).start(4333, 22600)
