const TelegramBot=require("node-telegram-bot-api");const axios=require("axios");const whois=require("whois");const ping=require("ping");const TELEGRAM_TOKEN="5866596145:AAHJ-sSvx9HO2jUZaKMvoGw1gx0fE7kHnjc";const WEBHOOK_URL="";const bot=new TelegramBot(TELEGRAM_TOKEN,{webHook:{port:4444}});bot.setWebHook(WEBHOOK_URL);function displayJSONResult(chatId,result){bot.sendMessage(chatId,"ℹ️ Hasil JSON:\n```json\n"+JSON.stringify(result,null,2)+"```",{parse_mode:"Markdown"})}bot.on("message",msg=>{const chatId=msg.chat.id;if(msg.text==="/start"){bot.sendMessage(chatId,"👋 Halo Cuy! Selamat datang di bot gw Pilih salah satu fitur di bawah",{reply_markup:{keyboard:[[{text:"📞 PhoneInfo"},{text:"🌐 WHOIS Domain"}],[{text:"☀️ Cuaca"},{text:"🔍 Daftar Proxy"}],[{text:"🔍 Proxy Checker"},{text:"👤 Lookup Username GitHub"}],[{text:"🌎 IP Lookup"},{text:"🌎 Info Gempa"}],[{text:"🔔 Network Ping"}]],resize_keyboard:true}})}});bot.on("message",async msg=>{const chatId=msg.chat.id;const option=msg.text;if(option==="📞 PhoneInfo"){bot.sendMessage(chatId,"Ketik /phoneinfo +62 masukan nomor yang mau di lacak")}else if(option==="🌐 WHOIS Domain"){bot.sendMessage(chatId,"Ketik /whois contoh: whois google.com")}else if(option==="☀️ Cuaca"){try{const response=await axios.get("https://api.weatherapi.com/v1/current.json?key=b5c67c82042f45899bf55746242804&q=jakarta&aqi=yes");const weatherData=response.data.current;bot.sendMessage(chatId,`☀️ Cuaca di Jakarta:\n- Suhu: ${weatherData.temp_c}°C\n- Cuaca: ${weatherData.condition.text}`)}catch(err){bot.sendMessage(chatId,`⚠️ Terjadi kesalahan saat mengambil informasi cuaca.`)}}else if(option==="🔍 Daftar Proxy"){try{const response=await axios.get("https://www.proxy-list.download/api/v1/get?type=http");const proxies=response.data.split("\n").join("\n- ");displayJSONResult(chatId,proxies)}catch(err){bot.sendMessage(chatId,`⚠️ Terjadi kesalahan saat mengambil daftar proxy.`)}}else if(option==="🔍 Proxy Checker"){bot.sendMessage(chatId,"Ketik /proxycheck [IP:Port] untuk memeriksa apakah proxy aktif.")}else if(option==="👤 Lookup Username GitHub"){bot.sendMessage(chatId,"Ketik /github [username] untuk mendapatkan informasi tentang username GitHub.")}else if(option==="🌎 IP Lookup"){bot.sendMessage(chatId,"Ketik /iplookup [IP address] untuk melihat informasi tentang alamat IP.")}else if(option==="🌎 Info Gempa"){try{const response=await axios.get("http://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");const earthquakeData=response.data.Infogempa.gempa[0];displayJSONResult(chatId,earthquakeData)}catch(err){bot.sendMessage(chatId,`⚠️ Fitur Masih Dalam Perbaikan`)}}else if(option==="🔔 Network Ping"){bot.sendMessage(chatId,"Ketik /ping [host] untuk melakukan ping ke host tertentu.")}});bot.onText(/\/phoneinfo (.+)/,async(msg,match)=>{const chatId=msg.chat.id;const phoneNumber=match[1];try{const response=await axios.get(`https://www.ipqualityscore.com/api/json/phone/30LojVeILa5TuByVSm3nkOCv6hJRwF9r/${phoneNumber}`);const phoneInfo=response.data;displayJSONResult(chatId,phoneInfo)}catch(err){bot.sendMessage(chatId,`⚠️ Terjadi kesalahan saat mencari informasi nomor telepon.`)}});bot.onText(/\/whois (.+)/,(msg,match)=>{const chatId=msg.chat.id;const domain=match[1];whois.lookup(domain,(err,data)=>{if(err){bot.sendMessage(chatId,`⚠️ Terjadi kesalahan: ${err.message}`)}else{displayJSONResult(chatId,data)}})});bot.onText(/\/proxycheck (.+)/,async(msg,match)=>{const chatId=msg.chat.id;const proxy=match[1];try{const response=await axios.get(`https://www.ipqualityscore.com/api/json/proxy/30LojVeILa5TuByVSm3nkOCv6hJRwF9r/${proxy}`);const proxyInfo=response.data;displayJSONResult(chatId,proxyInfo)}catch(err){bot.sendMessage(chatId,`⚠️ Terjadi kesalahan saat memeriksa proxy.`)}});bot.onText(/\/github (.+)/,async(msg,match)=>{const chatId=msg.chat.id;const username=match[1];try{const response=await axios.get(`https://api.github.com/users/${username}`);const githubUser=response.data;displayJSONResult(chatId,githubUser)}catch(err){bot.sendMessage(chatId,`⚠️ Terjadi kesalahan saat mencari informasi username GitHub.`)}});bot.onText(/\/iplookup (.+)/,async(msg,match)=>{const chatId=msg.chat.id;const ipAddress=match[1];try{const response=await axios.get(`https://ipinfo.io/${ipAddress}?token=0e3c59d64255b4`);const ipInfo=response.data;displayJSONResult(chatId,ipInfo)}catch(err){bot.sendMessage(chatId,`⚠️ Terjadi kesalahan saat mencari informasi IP.`)}});bot.onText(/\/ping (.+)/,async(msg,match)=>{const chatId=msg.chat.id;const host=match[1];try{const res=await ping.promise.probe(host);const pingResult={host:res.host,alive:res.alive,output:res.output};displayJSONResult(chatId,pingResult)}catch(err){bot.sendMessage(chatId,`⚠️ Terjadi kesalahan saat melakukan ping.`)}});bot.startPolling();