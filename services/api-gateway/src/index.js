// api-gateway/index.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

import passengerRouter from "./routes/passenger.routes.js";

app.use("/api/passenger", passengerRouter);


const PORT = 4000;
app.listen(PORT, () => console.log(`API Gateway running on ${PORT}`));
