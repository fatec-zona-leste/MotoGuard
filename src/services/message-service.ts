import { Request, Response } from "express";
import client, { qrCode } from "../messages/WhatsApp";

export async function authenticateWhatsApp(req: Request, res: Response) {
    try {
        if (client.info) 
            return res.status(200).json({ message: "Já autenticado no WhatsApp" });

        if (!qrCode)
            return res.status(404).send("QR code ainda não gerado, aguarde...");

        
        const qr = qrCode.split(",")[1] ?? "";
        res.setHeader("Content-Type", "image/png");
        res.send(Buffer.from(qr, "base64"));
    } catch (err) {
        res.status(500).json({ message: err instanceof Error ? err.message : "Erro ao realizar logout" });
    }
}

export async function logoutWhatsApp(req: Request, res: Response) {
    try {
        await client.logout();
        client.initialize();
        res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (err) {
        res.status(500).json({ message: err instanceof Error ? err.message : "Erro ao realizar logout" });
    }
}

export async function sendEmergencyMessage(req: Request, res: Response) {
    try {
        if (!client.info || !client.info.me)
            return res.status(400).json({ message: "WhatsApp não está autenticado. Gere o QR code e autentique novamente." });

        const { number, message } = req.body;
        if (!number || !message) return res.status(400).json({ error: 'Número e mensagem são obrigatórios' });

        await client.sendMessage(`${number}@c.us`, message);
        res.json({ status: 'Mensagem enviada' });
    } catch (err) {
        res.status(500).json({ message: err instanceof Error ? err.message : "Erro ao enviar mensagem" });
    }
}