const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const whois = require('whois');
const ping = require('ping');

// Token bot Telegram Anda
const TELEGRAM_TOKEN = '5866596145:AAHJ-sSvx9HO2jUZaKMvoGw1gx0fE7kHnjc';

// URL webhook publik Anda
const WEBHOOK_URL = ''; // Ganti dengan URL Anda

// Buat bot Telegram
const bot = new TelegramBot(TELEGRAM_TOKEN, {
    webHook: {
        port: 4444,
    },
});

// Set webhook
bot.setWebHook(WEBHOOK_URL);

// Handler untuk menampilkan hasil JSON
function displayJSONResult(chatId, result) {
    bot.sendMessage(chatId, 'ℹ️ Hasil JSON:\n```json\n' + JSON.stringify(result, null, 2) + '```', { parse_mode: 'Markdown' });
}



// m
const MESSAGE_DELETION_DELAY =10;


// Handler untuk pesan masuk
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const option = msg.text;

    if (option === '/start') {
        bot.sendMessage(
            chatId,
            '👋 Halo! Selamat datang di bot saya. Pilih salah satu fitur di bawah:',
            {
                reply_markup: {
                    keyboard: [
                        [{ text: '📞 PhoneInfo' }, { text: '🌐 WHOIS Domain' }],
                        [{ text: '☀️ Cuaca' }, { text: '🔍 Daftar Proxy' }],
                        [{ text: '🔍 Dorks List' }, { text: '👤 Lookup Username GitHub' }],
                        [{ text: '🌎 IP Lookup' }, { text: '🌎 Info Gempa' }],
                        [{ text: '🔔 Network Ping' }],
                    ],
                    resize_keyboard: true,
                },
            }
        );
    } else if (option === '📞 PhoneInfo') {
        bot.sendMessage(chatId, 'Ketik /phoneinfo +62 masukan nomor yang mau di lacak');
    } else if (option === '🌐 WHOIS Domain') {
        bot.sendMessage(chatId, 'Ketik /whois contoh: whois google.com');
    } else if (option === '☀️ Cuaca') {
        try {
            const response = await axios.get(
                'https://api.weatherapi.com/v1/current.json?key=b5c67c82042f45899bf55746242804&q=jakarta&aqi=yes'
            );
            const weatherData = response.data.current;

            bot.sendMessage(
                chatId,
                `☀️ Cuaca di Jakarta:\n- Suhu: ${weatherData.temp_c}°C\n- Cuaca: ${weatherData.condition.text}`
            );
        } catch (err) {
            bot.sendMessage(chatId, `⚠️ Terjadi kesalahan saat mengambil informasi cuaca.`);
        }
    } else if (option === '🔍 Daftar Proxy') {
        try {
            const response = await axios.get(
                'https://www.proxy-list.download/api/v1/get?type=http'
            );
            const proxies = response.data.split('\n').join('\n- ');

            displayJSONResult(chatId, proxies); // Menampilkan hasil JSON daftar proxy
        } catch (err) {
            bot.sendMessage(chatId, `⚠️ Fitur masih dalam perbaikan.`);
        }
    } else if (option === '🔍 Dorks List') {
        try {
            const response = await axios.get(
                'https://example.com/api/get_dorks' // Ganti dengan URL yang sesuai untuk mendapatkan daftar dorks
            );
            const dorksList = response.data;

            displayJSONResult(chatId, dorksList); // Menampilkan hasil JSON daftar dorks
        } catch (err) {
            bot.sendMessage(chatId, `⚠️ Terjadi kesalahan saat mengambil daftar dorks.`);
        }
    } else if (option === '👤 Lookup Username GitHub') {
        bot.sendMessage(chatId, 'Ketik /github [username] untuk mendapatkan informasi tentang username GitHub.');
    } else if (option === '🌎 IP Lookup') {
        bot.sendMessage(chatId, 'Ketik /iplookup [IP address] untuk melihat informasi tentang alamat IP.');
    } else if (option === '🌎 Info Gempa') {
        try {
            const response = await axios.get(
                'http://data.bmkg.go.id/DataMKG/TEWS/autogempa.json'
            );
            const earthquakeData = response.data.Infogempa.gempa[0];

            displayJSONResult(chatId, earthquakeData); // Menampilkan hasil JSON informasi gempa
        } catch (err) {
            bot.sendMessage(chatId, `⚠️ Fitur Masih Dalam Perbaikan`);
        }
    } else if (option === '🔔 Network Ping') {
        bot.sendMessage(chatId, 'Ketik /ping [host] untuk melakukan ping ke host tertentu.');
    }
});

// Perintah lookup nomor telepon
bot.onText(/\/phoneinfo (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const phoneNumber = match[1];

    try {
        const response = await axios.get(
            `https://www.ipqualityscore.com/api/json/phone/30LojVeILa5TuByVSm3nkOCv6hJRwF9r/${phoneNumber}`
        );
        const phoneInfo = response.data;

        displayJSONResult(chatId, phoneInfo); // Menampilkan hasil JSON informasi nomor telepon
    } catch (err) {
        bot.sendMessage(chatId, `⚠️ Terjadi kesalahan saat mencari informasi nomor telepon.`);
    }
});

// Perintah whois untuk domain
bot.onText(/\/whois (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const domain = match[1];

    whois.lookup(domain, (err, data) => {
        if (err) {
            bot.sendMessage(chatId, `⚠️ Terjadi kesalahan: ${err.message}`);
        } else {
            displayJSONResult(chatId, data); // Menampilkan hasil JSON WHOIS
        }
    });
});

// Perintah lookup GitHub username
bot.onText(/\/github (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const username = match[1];

    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const githubUser = response.data;

        displayJSONResult(chatId, githubUser); // Menampilkan hasil JSON informasi GitHub user
    } catch (err) {
        bot.sendMessage(chatId, `⚠️ Terjadikesalahan saat mencari informasi username GitHub.`);
    }
});

// Perintah lookup IP
bot.onText(/\/iplookup (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const ipAddress = match[1];

    try {
        const response = await axios.get(
            `https://ipinfo.io/${ipAddress}?token=0e3c59d64255b4`
        );
        const ipInfo = response.data;

        displayJSONResult(chatId, ipInfo); // Menampilkan hasil JSON informasi IP
    } catch (err) {
        bot.sendMessage(chatId, `⚠️ Terjadi kesalahan saat mencari informasi IP.`);
    }
});

// Perintah ping jaringan
bot.onText(/\/ping (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const host = match[1];

    try {
        const res = await ping.promise.probe(host);
        const pingResult = {
            host: res.host,
            alive: res.alive,
            output: res.output,
        };

        displayJSONResult(chatId, pingResult); // Menampilkan hasil JSON ping jaringan
    } catch (err) {
        bot.sendMessage(chatId, `⚠️ Terjadi kesalahan saat melakukan ping.`);
    }
});

// Mulai polling untuk bot
bot.startPolling();
