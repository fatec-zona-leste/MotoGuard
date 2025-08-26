/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, LocalAuth } from 'whatsapp-web.js';
import QRCode from 'qrcode';

export class WhatsApp {
    public client;
    private qrCodeData = '';

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
        this.client.initialize();
    }

    public getQrCodeData(){
        return this.qrCodeData;
    }

    private connect(){
        this.client.on('qr', (qr: string) => {
            QRCode.toDataURL(qr, (err: any, url: any) => {
                if (err) {
                    console.error(err);
                    throw err
                };
                this.qrCodeData = url;
                console.log("QrCode Gerado");
            });
        });
        
        this.client.on('ready', () => {
            console.log('Bot está pronto!');
        });
    }

    public async sendMessage(to: string, message: string) {
        await this.client.sendMessage(to, message);
    }
}