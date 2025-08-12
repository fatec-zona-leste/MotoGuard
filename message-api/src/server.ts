import express, { Request, Response } from "express"
import { WhatsApp } from "./whatsapp";
import { MessageRouter } from "./routes/message";
import { PORT } from "./utils/vars";
import { Swagger } from "./swagger";
import cors from "cors";

const wp = new WhatsApp();
const messageRouter = new MessageRouter(wp);
const swagger = new Swagger();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", wp.routers());
app.use("/api/message", messageRouter.routers());
app.use(swagger.routers());

app.listen(PORT, () => {
    wp.client.initialize();
    console.log(`http://localhost:${PORT}`);
});

