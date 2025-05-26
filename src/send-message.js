require('dotenv').config();

const {
    Client,
    IntentsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

const roles = [
    {
        id: '1376227142609932398',
        label: 'test'
    }
];

client.on("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    try {
        const channel = await client.channels.fetch("1376228924660646100");

        if (!channel) {
            console.log("❌ Channel not found");
            return;
        }

        console.log("✅ Channel found, sending message...");

        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder()
                    .setCustomId(role.id)
                    .setLabel(role.label)
                    .setStyle(ButtonStyle.Primary)
            );
        });

        await channel.send({
            content: 'Claim or remove a role below:',
            components: [row]
        });

        console.log("✅ Message sent with role buttons!");
        // process.exit(); // علّقنا الخروج مؤقتاً

    } catch (error) {
        console.log("❌ Error sending message:", error);
    }
});

client.login(process.env.TOKEN);
