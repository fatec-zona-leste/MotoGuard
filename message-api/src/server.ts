import express, { Request, Response } from "express"
import { WhatsApp } from "./whatsapp";
import { MessageRouter } from "./routes/message";
import { PORT } from "./utils/vars";
import { Swagger } from "./swagger";

const wp = new WhatsApp();
const messageRouter = new MessageRouter(wp);
const swagger = new Swagger();

const app = express();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Home
 *     responses:
 *       200:
 *         description: Hello Word para verificar status da API
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               items:
 *                 type: object
 *                 example: Ola Mundo
 */
app.get("/", (req, res) => {
  res.send("Ola Mundo");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/message", messageRouter.routers());
app.use("/api", wp.routers());
app.use("", swagger.routers());

app.listen(PORT, () => {
    wp.client.initialize();
    console.log(`http://localhost:${PORT}`);
});

