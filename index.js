const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const express = require('express');

// --- 1. CONFIGURACIÓN DEL SERVIDOR ---
const app = express();
app.get('/', (req, res) => res.send('Bot Status: Online 🚀'));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor web en puerto ${port}`));

// --- 2. INICIALIZACIÓN DEL BOT ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

// --- 3. LÓGICA DE COMANDOS ---
client.on('messageCreate', async (message) => {
  // Ignorar mensajes de otros bots
  if (message.author.bot) return;

  // COMANDO ÚNICO: /r (Prioridades 0-5)
  if (message.content.startsWith('/r')) {
    const args = message.content.split(' ');
    const input = args[1];

    // CASO A: No hay texto (ej. solo escribió "/r")
    if (!input) {
      return message.channel.send('https://tenor.com/b12jl.gif');
    }

    // CASO B: Validación de número del 0 al 5
    const esNumeroValido = /^[0-5]$/.test(input);

    if (esNumeroValido) {
      // Respondemos tagueando al usuario
      await message.channel.send(`El usuario <@${message.author.id}> ha usado su prioridad No.${input}`);

      // Guardamos la acción en Google Sheets de forma silenciosa
      try {
        await axios.post(process.env.GOOGLE_SCRIPT_URL, {
          user: message.author.tag,
          content: `Usó prioridad: ${input}`,
          channel: message.channel.name
        });
      } catch (e) {
        console.error('Error al registrar en Sheets:', e.message);
      }
    } else {
      // CASO C: El usuario escribió algo inválido
      return message.reply(`Aqui solo aceptamos prioridades de 0 a 5, no tus mamadas de ${input}`);
    }
  }
});

// --- 4. LOGIN ---
client.login(process.env.DISCORD_TOKEN);
