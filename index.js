client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // 1. Detección del comando /r
  if (message.content.startsWith('/r')) {
    // Dividimos el mensaje para separar el comando del valor
    const args = message.content.split(' ');
    const input = args[1]; // Lo que sigue después de /r

    // CASO A: No hay texto (solo escribió /r)
    if (!input) {
      return message.channel.send('https://tenor.com/b12jl.gif');
    }

    // CASO B: Es un número entre 0 y 5
    // Usamos una expresión regular para asegurar que sea UN solo dígito del 0 al 5
    const esNumeroValido = /^[0-5]$/.test(input);

    if (esNumeroValido) {
      const prioridad = input;
      const respuesta = `El usuario <@${message.author.id}> ha usado su prioridad No.${prioridad}`;
      
      // Enviamos la respuesta a Discord
      await message.channel.send(respuesta);

      // Opcional: Guardar también en Google Sheets (manteniendo tu lógica anterior)
      try {
        await axios.post(process.env.GOOGLE_SCRIPT_URL, {
          user: message.author.tag,
          content: `Usó prioridad: ${prioridad}`,
          channel: message.channel.name
        });
      } catch (error) {
        console.error("Error al guardar en Sheets:", error);
      }
      return;
    }

    // CASO C: Escribió algo que no es un número del 0 al 5
    return message.reply(`Aqui solo aceptamos prioridades de 0 a 5, no tus mamadas de ${input}`);
  }
});
