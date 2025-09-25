/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */

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
        if (msg.fromMe) return;

       const chat = await msg.getChat();
        const contact = await msg.getContact();
        const name = contact.pushname || 'Usuário';
        const firstName = name.split(" ")[0];

        await chat.sendStateTyping();
        await msg.reply(
            `Olá, ${firstName}! \nEsse número do Motoguard é apenas para enviar alertas`
        );
    } catch (err) {
        console.error("Erro ao processar mensagem:", err);
        if(!String(err).includes("serialize"))
            await client.sendMessage(msg.from, `Houve um problema tecnico. \nEsse número do Motoguard é apenas para enviar alertas. \n${err}`);
    }
});

export default client;
export { isReady, qrCode };