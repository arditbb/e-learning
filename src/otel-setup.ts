import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
import * as api from '@opentelemetry/api';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { Resource } from '@opentelemetry/resources';

// Export the tracing setup function
export function otelSetup() {
  const contextManager = new AsyncHooksContextManager().enable();

  api.context.setGlobalContextManager(contextManager);

  // Configure the console exporter
  const consoleExporter = new ConsoleSpanExporter();

  // Configure the trace provider
  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'test-tracing-service',
      [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    }),
  });

  // Configure how spans are processed and exported. In this case, we're sending spans
  // as we receive them to the console
  provider.addSpanProcessor(new SimpleSpanProcessor(consoleExporter));

  // Register your auto-instrumentors
  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [new PrismaInstrumentation({ middleware: true })],
  });

  // Register the provider
  provider.register();
}
