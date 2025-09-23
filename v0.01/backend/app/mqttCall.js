import { startMQTT } from "./mqtt/ftb.js";
import { startPublisher } from "./mqtt/btf.js";

// Start publisher for clients
startPublisher();
