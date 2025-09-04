/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Client, LocalAuth } from 'whatsapp-web.js';
// import QRCode from 'qrcode';

// class WhatsApp {
//     public client;
//     private qrCodeData = '';
//     private isReady = false;

//     public constructor() {
//         this.client = new Client({
//             authStrategy: new LocalAuth(),
//             puppeteer: {
//                 args: [
//                     '--no-sandbox',
//                     '--disable-setuid-sandbox',
//                     '--disable-features=IsolateOrigins,site-per-process'
//                 ]
//             }
//         });

//         this.connect();
//         this.client.initialize();
//     }

//     public getQrCodeData() {
//         return this.qrCodeData;
//     }

//     private connect() {
//         this.client.on('qr', (qr: string) => {
//             QRCode.toDataURL(qr, (err: any, url: any) => {
//                 if (err) throw err;
//                 this.qrCodeData = url;
//                 console.log("QrCode Gerado");
//             });
//         });

//         this.client.on('ready', () => {
//             this.isReady = true;
//             console.log('✅ Bot está pronto!');
//         });

//         this.client.on('disconnected', () => {
//             this.isReady = false;
//             console.log('❌ Bot desconectado.');
//         });
//     }

//     public async sendMessage(to: string, message: string) {
//         if (!this.isReady) throw new Error("WhatsApp não está autenticado.");
//         await this.client.sendMessage(to, message);
//     }
// }

// export const wpClient = new WhatsApp();

import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import QRCode from 'qrcode';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    }
});

let qrCode: null | string = null;
client.on('qr', (qr: string) => {
    QRCode.toDataURL(qr, function (err: any, url) {
        console.log("QRCode gerado");
        qrCode = url; // ou exiba em uma página
    });
});

let isReady = false;
client.on('ready', () => {
    console.log('Bot está pronto!');
    isReady = true;
});

client.on('message', async (msg: Message) => {
    if (!isReady) {
        console.log('Mensagem recebida antes do bot estar pronto, ignorando.');
        return;
    }

    try {
        // if (msg.fromMe) return;

        const chat = await msg.getChat();
        const contact = await msg.getContact();
        const name = contact.pushname || 'Usuário';
        const firstName = name.split(" ")[0];
        
        await chat.sendStateTyping();
        
        await msg.reply(`Olá! ${firstName}! \nEsse número do Motoguard é apenas para enviar alertas`);
        return;
    } catch (err) {
        console.error("Erro ao processar mensagem:", err);
        if(!String(err).includes("serialize"))
            await client.sendMessage(msg.from, `Houve um problema tecnico. \nEsse número do Motoguard é apenas para enviar alertas. \n${err}`);
    }
});

export default client;
export { isReady, qrCode };