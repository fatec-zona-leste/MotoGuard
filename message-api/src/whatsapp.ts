import { Client, LocalAuth } from 'whatsapp-web.js';
import QRCode from 'qrcode';
import express from "express";

export class WhatsApp {
    public client;
    private qrCodeData = '';
    private router = express.Router();

    public constructor(){
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                // executablePath: '/snap/bin/chromium', //para servidor
                args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-features=IsolateOrigins,site-per-process'
                ]
            }
        });

        this.connect();
    }

    private connect(){
        this.client.on('qr', (qr: string) => {
            QRCode.toDataURL(qr, (err, url) => {
                if (err) throw err;
                this.qrCodeData = url;
                console.log("QrCode Gerado");
            });
        });
        
        this.client.on('ready', () => {
            console.log('Bot está pronto!');
        });
    }

    public routers(){
        /**
         * @swagger
         * /api/qr:
         *   get:
         *     summary: Obtém o QR code para autenticação do WhatsApp
         *     description: Retorna uma imagem HTML contendo o QR code necessário para vincular o WhatsApp Web ao bot.
         *     responses:
         *       200:
         *         description: HTML com o QR code
         *         content:
         *           text/html:
         *             schema:
         *               type: string
         *               example: "<img src='data:image/png;base64,...'>"
         *       404:
         *         description: QR code ainda não gerado
         */
        this.router.get("/qr", (req, res) => {
            if (!this.qrCodeData)
                return res.send("QR code ainda não gerado");
            
            res.send(`<img src="${this.qrCodeData}">`);
        });

        return this.router;
    }

    public async sendMessage(to: string, message: string) {
        await this.client.sendMessage(to, message);
    }
}