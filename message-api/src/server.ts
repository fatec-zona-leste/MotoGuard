import express, { Request, Response } from "express"
import { WhatsApp } from "./whatsapp";
import { MessageRouter } from "./routes/message";
import { ALLOW_ORIGINS, APP_URL, PORT } from "./utils/vars";
import { Swagger } from "./swagger";
import cors from "cors";

const corsOptions = {
  origin: ALLOW_ORIGINS,
  optionsSuccessStatus: 200
}

const wp = new WhatsApp();
const messageRouter = new MessageRouter(wp);
const swagger = new Swagger();

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", wp.routers());
app.use("/api/message", messageRouter.routers());
app.get("/", (req, res) => res.redirect("/docs"));
app.use("/docs", swagger.routers());

app.listen(PORT, () => {
    wp.client.initialize();
    console.log(APP_URL);
});

