
/**
 * BACKEND SERVER FOR WABA ALATAS
 * Run this using: node server.js
 * Required packages: npm install express socket.io @whiskeysockets/baileys pino qrcode-terminal cors
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { 
    makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason 
} = require('@whiskeysockets/baileys');
const pino = require('pino');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = 3001;
let sock = null;
let qrCode = null;
let connectionStatus = 'disconnected';

// -- WHATSAPP LOGIC --
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrCode = qr;
            connectionStatus = 'awaiting_scan';
            io.emit('status_update', { status: 'awaiting_scan', qr });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            connectionStatus = 'disconnected';
            qrCode = null;
            io.emit('status_update', { status: 'disconnected' });
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            connectionStatus = 'connected';
            qrCode = null;
            io.emit('status_update', { status: 'connected' });
            console.log('WhatsApp Connected!');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type === 'notify') {
            for (const msg of messages) {
                if (!msg.key.fromMe) {
                    // Kirim ke Frontend via Socket
                    io.emit('new_message', {
                        id: msg.key.id,
                        sender: msg.pushName || msg.key.remoteJid,
                        text: msg.message?.conversation || msg.message?.extendedTextMessage?.text,
                        timestamp: new Date()
                    });
                }
            }
        }
    });
}

// -- API ENDPOINTS --
app.get('/api/status', (req, res) => {
    res.json({ status: connectionStatus, qr: qrCode });
});

app.post('/api/send-message', async (req, res) => {
    const { jid, text } = req.body;
    try {
        if (connectionStatus !== 'connected') throw new Error('WA Not Connected');
        await sock.sendMessage(jid, { text });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/generate-qr', (req, res) => {
    if (connectionStatus === 'connected') return res.json({ status: 'connected' });
    connectToWhatsApp();
    res.json({ status: 'initializing' });
});

server.listen(PORT, () => {
    console.log(`Backend Engine running on http://localhost:${PORT}`);
});
