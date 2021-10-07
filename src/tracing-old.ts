/* tracing.js */

import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { MongoDBInstrumentation } from "@opentelemetry/instrumentation-mongodb";
import  { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core'
const {  SimpleSpanProcessor, BatchSpanProcessor } = require("@opentelemetry/tracing");
import { RedisInstrumentation }  from '@opentelemetry/instrumentation-redis';
import { MongooseInstrumentation } from 'opentelemetry-instrumentation-mongoose';
import  process from "process"
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
// Require dependencies
import opentelemetry  from "@opentelemetry/sdk-node";
//const prometheusExporter = new PrometheusExporter();
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { registerInstrumentations } from '@opentelemetry/instrumentation';

const options =  {
  tags: [], // optional
  // You can use the default UDPSender
  host:'localhost', // optional
  port: 6832, // optional
  // OR you can use the HTTPSender as follows
  //endpoint: 'http://localhost:4317',
  maxPacketSize: 65000 // optional
}
const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.JAEGER_SERVICE_NAME,
  }),
  //traceExporter: new opentelemetry.tracing.ConsoleSpanExporter(),
  //metricExporter: prometheusExporter,
  instrumentations: [getNodeAutoInstrumentations(), new NestInstrumentation()],
  spanProcessor: new BatchSpanProcessor(new JaegerExporter(options))
});


process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(
      () => console.log("SDK shut down successfully"),
      (err) => console.log("Error shutting down SDK", err)
    )
    .finally(() => process.exit(0));
});

export default sdk;