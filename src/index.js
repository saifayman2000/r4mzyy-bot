require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  EmbedBuilder
} = require('discord.js');
const { OpenAI } = require("openai")


const axios = require('axios');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});



// هنا روابط الصور لكل شخصية (تقدر تعدلهم حسب صور رسمية أو تحب)
const characters = [
    { name: 'Jett', image: 'https://i.postimg.cc/66Rx3bv1/Jett-Artwork-Full.webp' },
    { name: 'Phoenix', image: 'https://i.postimg.cc/QxXY3fk7/Phoenix-Artwork-Full.webp' },
    { name: 'Waylay', image: 'https://i.postimg.cc/3xjwvJ0V/Waylay-Artwork-Full.webp' },
    { name: 'Yoru', image: 'https://i.postimg.cc/tTcRjs8Z/Yoru-Artwork-Full.webp' },
    { name: 'Reyna', image: 'https://i.postimg.cc/bJxLXnZL/Reyna-Artwork-Full.webp' },
    { name: 'Raze', image: 'https://i.postimg.cc/kgHTWqrN/Raze-Artwork-Full.webp' },
    { name: 'Neon', image: 'https://i.postimg.cc/pTzc276f/Neon-Artwork-Full.webp' },
    { name: 'Iso', image: 'https://i.postimg.cc/cJHNLsRQ/Iso-Artwork-Full.webp' },
    { name: 'Killjoy', image: 'https://i.postimg.cc/bwVBL1nt/Killjoy-Artwork-Full.webp' },
    { name: 'Cypher', image: 'https://i.postimg.cc/C1QX1kh0/Cypher-Artwork-Full.webp' },
    { name: 'Chamber', image: 'https://i.postimg.cc/4ynG2Xdf/Chamber-Artwork-Full.webp' },
    { name: 'Deadlock', image: 'https://i.postimg.cc/kDrHNCRh/Deadlock-Artwork-Full.webp' },
    { name: 'Sage', image: 'https://i.postimg.cc/cCTmCNMn/Sage-Artwork-Full.webp' },
    { name: 'Skye', image: 'https://i.postimg.cc/Jzsqrvys/Skye-Artwork-Full.webp' },
    { name: 'Breach', image: 'https://i.postimg.cc/XqDjnphB/Breach-Artwork-Full.webp' },
    { name: 'Sova', image: 'https://i.postimg.cc/W3wmYPyH/Sova-Artwork-Full.webp' },
    { name: 'Tejo', image: 'https://i.postimg.cc/W3wmYPyH/Sova-Artwork-Full.webp' },
    { name: 'Fade', image: 'https://i.postimg.cc/qBtMGGC8/Fade-Artwork-Full.webp' },
    { name: 'KAY/O', image: 'https://i.postimg.cc/gc31dwCC/KAYO-Artwork-Full.webp' },
    { name: 'Gekko', image: 'https://i.postimg.cc/x1P0dxWS/Gekko-Artwork-Full.webp' },
    { name: 'Harbor', image: 'https://i.postimg.cc/3Rk7nKWK/Harbor-Artwork-Full.webp' },
    { name: 'Viper', image: 'https://i.postimg.cc/DZv4Z4Cx/Viper-Artwork-Full.webp' },
    { name: 'Vyse', image: 'https://i.postimg.cc/s2c1tDV7/Vyse-Artwork-Full.webp' },
    { name: 'Astra', image: 'https://i.postimg.cc/59pjPtPV/Astra-Artwork-Full.webp' },
    { name: 'Brimstone', image: 'https://i.postimg.cc/k4Jq8QPt/Brimstone-Artwork-Full.webp' },
    { name: 'Omen', image: 'https://i.postimg.cc/SR4TjrBw/Omen-Artwork-Full.webp' },
    { name: 'Clove', image: 'https://i.postimg.cc/g0DPYxLc/Clove-Artwork-Full.webp' } 
];

const ALLOWED_CHANNEL_ID = '1376570668929515651';
const ALLOWED_CHANNEL_ID_AI = '1380368205637488850';

const userSelections = {};



client.on('messageCreate', message => {
  // تأكد إن البوت متعمله mention وإن الرسالة فيها "hi"
  if (message.mentions.has(client.user)) {
    message.reply('انا بوت سيرفر r4mzyy');
  }
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
    if (message.channel.id !== ALLOWED_CHANNEL_ID) return;

  if (message.content.toLowerCase() === 'random') {
    // قسم الشخصيات لقائمتين
    const firstBatch = characters.slice(0, 25);
    const secondBatch = characters.slice(25);

    const selectMenu1 = new StringSelectMenuBuilder()
      .setCustomId('character_select_1')
      .setPlaceholder('اختر من الشخصيات 1 إلى 25')
      .setMinValues(1)
      .setMaxValues(firstBatch.length)
      .addOptions(
        firstBatch.map(c => ({
          label: c.name,
          value: c.name.toLowerCase()
        }))
      );

    const selectMenu2 = new StringSelectMenuBuilder()
      .setCustomId('character_select_2')
      .setPlaceholder('اختر من الشخصيات 26 إلى 28')
      .setMinValues(0) // خليها 0 عشان تكون اختيارية
      .setMaxValues(secondBatch.length)
      .addOptions(
        secondBatch.map(c => ({
          label: c.name,
          value: c.name.toLowerCase()
        }))
      );

    const row1 = new ActionRowBuilder().addComponents(selectMenu1);
    const row2 = new ActionRowBuilder().addComponents(selectMenu2);

    const enterButton = new ButtonBuilder()
      .setCustomId('enter')
      .setLabel('🎯 Enter')
      .setStyle(ButtonStyle.Success);

    const buttonRow = new ActionRowBuilder().addComponents(enterButton);

    await message.reply({
      content: 'اختر الشخصيات اللي عايز تدخلها في الراندوم، وبعدين دوس Enter 🎯\nتقدر تختار من واحدة أو اكتر من القائمتين.',
      components: [row1, row2, buttonRow]
    });
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isStringSelectMenu()) {
    const userId = interaction.user.id;
    const selectedValues = interaction.values;

    // لو المستخدم اختار من اي قائمة، نخزن كل اختياراته مدموجة
    if (!userSelections[userId]) userSelections[userId] = [];

    // نضيف الاختيارات الجديدة بدون تكرار
    selectedValues.forEach(v => {
      if (!userSelections[userId].some(c => c.name.toLowerCase() === v)) {
        const char = characters.find(c => c.name.toLowerCase() === v);
        if (char) userSelections[userId].push(char);
      }
    });

    await interaction.reply({
      content: `✅ تم تحديث اختيارك: ${userSelections[userId].map(c => c.name).join(', ')}`,
      ephemeral: true
    });
  }

  if (interaction.isButton() && interaction.customId === 'enter') {
    const userId = interaction.user.id;
    const selected = userSelections[userId];

    if (!selected || selected.length === 0) {
      await interaction.reply({ content: '❗ لازم تختار شخصية واحدة على الأقل!', ephemeral: true });
    } else {
      const choice = selected[Math.floor(Math.random() * selected.length)];

      const embed = new EmbedBuilder()
        .setTitle(`🎲 تم اختيار: ${choice.name}`)
        .setImage(choice.image)
        .setColor('Random')
        .setFooter({ text: 'Valorant Random Selector' });

      await interaction.reply({ embeds: [embed] });
      delete userSelections[userId];
    }
  }
});

// async function sendOpenAIRequest(messageContent) {
//   const maxRetries = 3;
//   let attempt = 0;

//   while (attempt < maxRetries) {
//     try {
//       const response = await axios.post(
//         'https://api.openai.com/v1/chat/completions',
//         {
//           model: 'gpt-3.5-turbo',
//           messages: [{ role: 'user', content: messageContent }],
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       return response.data.choices[0].message.content;
//     } catch (error) {
//       if (error.response && error.response.status === 429) {
//         attempt++;
//         console.log(`Rate limit hit, retrying attempt ${attempt}...`);
//         await new Promise(r => setTimeout(r, 2000 * attempt)); // تأخير متزايد
//       } else {
//         throw error;
//       }
//     }
//   }
//   throw new Error('Rate limit exceeded, please try again later.');
// }

// client.on('messageCreate', async (message) => {
//   if (message.author.bot || message.channel.id !== ALLOWED_CHANNEL_ID_AI) return;

//   try {
//     const reply = await sendOpenAIRequest(message.content);
//     await message.reply(reply);
//   } catch (error) {
//     console.error('❌ Error:', error);
//     await message.reply('حصل خطأ بسبب تجاوز حد الاستخدام، جرب تاني بعد شوية.');
//   }
// });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})


client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!ALLOWED_CHANNEL_ID_AI.includes(message.channelId)) return 

  const response = await openai.chat.completions
    .create({
      model: 'gpt-4',
      messages: [
        {
          // name
          role: 'system',
          content: 'chat gpt is a freun'

        },
        {
          // name
          role: 'user',
          content: message.content,
        }
      ]
    })
    .catch((error) => console.error('erorr:\n', error))
  message.reply(response.choices[0].message.content)
});




// تشغيل البوت
client.login(process.env.DISCORD_TOKEN);