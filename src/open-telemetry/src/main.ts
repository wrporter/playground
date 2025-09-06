import express from 'express';
import {log} from '@wesp-up/logger';
import {createServer} from '@wesp-up/express';
import {SpanStatusCode, trace} from '@opentelemetry/api';

// const sdk = new NodeSDK({
//     instrumentations: [
//         new WinstonInstrumentation(),
//         new HttpInstrumentation(),
//         new ExpressInstrumentation(),
//         getNodeAutoInstrumentations(),
//     ],
// });
// sdk.start();

// const app = express();

const tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME ?? '');

function sleep(ms: number) {
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
            span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        } finally {
            span.end();
        }
    }
}

const testService = new TestService();

createServer({mountApp(app) {

        app.get('*', async (req, res) => {
            // console.log(req.headers)
            // const tracer = trace.getTracer('sample-app');
            // tracer.startActiveSpan('api request', (span: Span) => {
            //     const traceHeaders = {};
            //     propagation.inject(context.active(), traceHeaders);
            //     console.log(traceHeaders)
            //
            //     res.json(traceHeaders);
            //     span.end();
            // })

            // const span = tracer.startSpan('http-request', {
            //     attributes: {
            //         httpMethod: req.method,
            //         httpUrl: req.url,
            //     },
            // });
            //
            // const traceId = span.spanContext().traceId;
            // res.setHeader('traceparent', traceId);

            res.on('finish', () => {
                log.info('finished request')
                // span.end();
            });
            await testService.mySpecialOperation()
            res.send('end');

            // try {
            //     const span = trace.getSpan(context.active());
            //     res.json(span.spanContext())
            // } catch (error) {
            //     console.log(error);
            //     res.send(error.message)
            // }
        });
    }}).start(4333, 22600)


// app.listen(4333, () => {
//     console.log('Server listening at http://localhost:4333');
// });