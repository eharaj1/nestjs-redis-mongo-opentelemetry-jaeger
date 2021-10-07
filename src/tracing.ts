/* tracing.js */
// Require dependencies
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import * as opentelemetry  from "@opentelemetry/sdk-node";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
const { BatchSpanProcessor } = require("@opentelemetry/tracing");
import  * as process from "process"
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
//const prometheusExporter = new PrometheusExporter();


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
  instrumentations: [getNodeAutoInstrumentations()],
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