import { Request, Response } from "express";
import { WhatsApp } from "../messages/WhatsApp";

export async function sendEmergencyMessage(req: Request, res: Response) {
    const { number, message } = req.body;
    if (!number || !message) return res.status(400).json({ error: 'Número e mensagem são obrigatórios' });
    const wp = new WhatsApp();

    try {
        await wp.client.sendMessage(`${number}@c.us`, message);
        res.json({ status: 'Mensagem enviada' });
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Erro inesperado" });
        }
    }
}