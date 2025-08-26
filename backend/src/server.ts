import express from "express";
import 'dotenv/config'
import { PORT } from "./utils/vars";

const app = express();

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})

app.get("", (req, res) => {
    res.send("")
})