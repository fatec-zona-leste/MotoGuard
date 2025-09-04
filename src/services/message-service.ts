/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import client, { qrCode } from "../messages/WhatsApp";
import User from "../models/User";
import fs from "fs";
import path from "path";


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
        const authDir = path.join(process.cwd(), "sessions", "default"); // padrão do LocalAuth
        if (fs.existsSync(authDir)) {
            fs.rmSync(authDir, { recursive: true, force: true });
        }

       if (client.info) {
            await client.destroy(); // encerra client
            client.initialize();
            console.log("Client destruído com sucesso");
        }

        res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (err) {
        res.status(500).json({ message: err instanceof Error ? err.message : "Erro ao realizar logout" });
    }
}

export async function sendEmergencyMessage(user: User, latitude?: number, longitude?: number) {
    try {
        if (!client.info || !client.info.me)
            throw Error('WhatsApp não está autenticado. Gere o QR code e autentique novamentes');

        const numbers = user.get("emergency_number")?.length ? user.get("emergency_number") : null;
        if (!numbers) return;

        let message = `Acidente detectado com ${user.get("name")}`;
        if (latitude !== undefined && longitude !== undefined) {
            message += `\nLocalização: https://www.google.com/maps?q=${latitude},${longitude}`;
        }

        let number = null;
        if (numbers.toString().replace("[", "").replace("]", "").split(",")) {
            number = numbers.toString().replace("[", "").replace("]", "").split(",")[0];
        } else {
            number = numbers.toString();
        }
        
        await client.sendMessage(`${number}@c.us`, message);
    } catch (err) {
        throw Error(err instanceof Error ? err.message : "Erro ao enviar mensagem")
    }
}