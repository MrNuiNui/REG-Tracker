const Discord = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
const prefix = '!';
const token = 'MTA5MTY2NjgzODY3NDQ5MzQ5MA.GlTG-f.5XrvlbSUfX0lfBrZ5OYjH1wwlYIpGVCR9GOYpg'

client.once('ready', () => {
   console.log('Félicitations, votre bot Discord a été correctement initialisé !');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'ping') {
        message.channel.send('Pong !');
    }
});
//Interroge l'API rocket League//
const fetch = require('node-fetch');

async function getPlayerStats(username) {
  const apiKey = '9b656d72-8d56-4266-98a1-45584364de64';
  const url = `https://api.tracker.gg/api/v2/rocket-league/standard/profile/${encodeURIComponent(username)}`;
  const headers = {
    'Content-Type': 'application/json',
    'TRN-Api-Key': apiKey
  };
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  const stats = data.data.segments[0].stats;
  const rank = stats.tier.metadata.name;
  const mmr = stats.rating.value;
  const goals = stats.goals.value;
  const assists = stats.assists.value;
  const saves = stats.saves.value;
  const shots = stats.shots.value;
  return `Stats pour ${username}: Rank ${rank}, MMR ${mmr}, Buts ${goals}, Passes ${assists}, Arrêts ${saves}, Tirs ${shots}`;
}
//Commande Statistique Rocket League//
client.on('message', async message => {
    if (message.content.startsWith('!stats')) {
      const args = message.content.split(' ').slice(1);
      if (args.length !== 1) {
        message.reply('Utilisation : !stats <nom_utilisateur>');
        return;
      }
      try {
        const stats = await getPlayerStats(args[0]);
        message.channel.send(stats);
      } catch (e) {
        message.reply(`Erreur : ${e.message}`);
      }
    }
  });

client.login(token);