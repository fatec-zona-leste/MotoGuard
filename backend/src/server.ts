import express from "express";
import 'dotenv/config'
import { ALLOW_ORIGINS, APP_URL, PORT } from "./utils/vars";
import { syncModels } from "./models";
import messageRouter from "./routes/message-routes";
import deviceRouter from "./routes/device-routes";
import authRouter from "./routes/auth-routes";
import cors from "cors";
import { Swagger } from "./swagger";
// import { WhatsApp } from "./messages/WhatsApp";

const corsOptions = {
  origin: ALLOW_ORIGINS,
  optionsSuccessStatus: 200
}

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

syncModels();

app.listen(PORT, () => {
  console.log(APP_URL);
})

app.use("/api", authRouter);
app.use("/api/devices", deviceRouter);
app.use("/api", messageRouter);
app.get("/", (req, res) => res.redirect("/docs"));
app.use("/docs", (new Swagger()).routers());

app.use((req, res) => {
  res.status(404).json({
    message: "Rota não encontrada",
    path: req.originalUrl
  });
});