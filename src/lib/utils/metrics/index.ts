import client from "prom-client";
import config from "../../../_config";

const { APP_NAME } = config;

export const prometheus = () => {
  // Create a Registry which registers the metrics
  const register = new client.Registry();

  // Add a default label which is added to all metrics
  register.setDefaultLabels({
    app: APP_NAME,
  });

  // Create custom metrics
  const userCounter = new client.Counter({
    name: "my_user_counter",
    help: "User counter for my application",
  });
  // Add your custom metric to the registry
  register.registerMetric(userCounter);
  // Enable the collection of default metrics
  client.collectDefaultMetrics({
    prefix: "node_",
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register,
  });

  return { register, userCounter };
};
