/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, LocalAuth } from 'whatsapp-web.js';
import QRCode from 'qrcode';

class WhatsApp {
    public client;
    private qrCodeData = '';
    private isReady = false;

    public constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-features=IsolateOrigins,site-per-process'
                ]
            }
        });

        this.connect();
        this.client.initialize();
    }

    public getQrCodeData() {
        return this.qrCodeData;
    }

    private connect() {
        this.client.on('qr', (qr: string) => {
            QRCode.toDataURL(qr, (err: any, url: any) => {
                if (err) throw err;
                this.qrCodeData = url;
                console.log("QrCode Gerado");
            });
        });

        this.client.on('ready', () => {
            this.isReady = true;
            console.log('✅ Bot está pronto!');
        });

        this.client.on('disconnected', () => {
            this.isReady = false;
            console.log('❌ Bot desconectado.');
        });
    }

    public async sendMessage(to: string, message: string) {
        if (!this.isReady) throw new Error("WhatsApp não está autenticado.");
        await this.client.sendMessage(to, message);
    }
}

export const wpClient = new WhatsApp();