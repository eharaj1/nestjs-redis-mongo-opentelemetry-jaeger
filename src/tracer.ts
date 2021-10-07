'use strict';

import opentelemetry from '@opentelemetry/api'
import {NodeTracerProvider} from '@opentelemetry/node';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { HttpBaggagePropagator } from '@opentelemetry/core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { MongoDBInstrumentation } from '@opentelemetry/instrumentation-mongodb';

const tracer = (serviceName: string) => {
    const provider = new NodeTracerProvider();

    // provider.addSpanProcessor(new SimpleSpanProcessor(new ZipkinExporter({
    //   serviceName,
    // })));

    provider.addSpanProcessor(new SimpleSpanProcessor(new JaegerExporter({
        tags: [], // optional
        // You can use the default UDPSender
        host:'localhost', // optional
        port: 6832, // optional
        // OR you can use the HTTPSender as follows
        //endpoint: 'http://localhost:4317',
        maxPacketSize: 65000 // optional
    })));
  
    // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
    provider.register();
  
    registerInstrumentations({
      instrumentations: [
        new HttpInstrumentation(),
        new MongoDBInstrumentation({
          enhancedDatabaseReporting: true,
        }),
      ],
      tracerProvider: provider,
    });
  
    return opentelemetry.trace.getTracer('mysql-example');
};
export default tracer;