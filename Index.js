const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const express = require('express');

// Configuración de Express para Render
const app = express();
app.get('/', (req, res) => res.send('Bot funcionando 🚀'));
app.listen(process.env.PORT || 3000); 

// Configuración del Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!guardar')) {
    const contenido = message.content.replace('!guardar ', '');
    
    try {
      await axios.post(process.env.GOOGLE_SCRIPT_URL, {
        user: message.author.tag,
        content: contenido
      });
      message.reply('✅ Registrado en Sheets.');
    } catch (e) {
      message.reply('❌ Error al conectar con la hoja.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
