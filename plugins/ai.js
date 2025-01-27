/*
_  ______   _____ _____ _____ _   _
| |/ / ___| |_   _| ____/___ | | | |
| ' / |  _    | | |  _|| |   | |_| |
| . \ |_| |   | | | |__| |___|  _  |
|_|\_\____|   |_| |_____\____|_| |_|

ANYWAY, YOU MUST GIVE CREDIT TO MY CODE WHEN COPY IT
CONTACT ME HERE +237656520674
YT: KermHackTools
Github: Kgtech-cmr
*/

const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "gpt",
    desc: "Interact with ChatGPT using the Dreaded API.",
    category: "ai",
    react: "🤖",
    use: "<your query>",
    filename: __filename,
}, async (conn, mek, m, { from, args, q, reply }) => {
    try {
        // Vérification de l'entrée utilisateur
        if (!q) return reply("⚠️ Please provide a query for ChatGPT.\n\nExample:\n.gpt What is AI?");

        // Utilisation de `${text}` dans le endpoint API
        const text = q;  // Ici on définit le texte comme étant `q`, qui est la requête de l'utilisateur
        const url = `https://api.dreaded.site/api/chatgpt?text=${text}`;

        console.log('Requesting URL:', url);  // Afficher l'URL pour vérifier

        // Appel à l'API
        const response = await axios.get(url);

        // Débogage : Afficher la réponse complète de l'API pour mieux comprendre
        console.log('Full API Response:', response.data);

        // Vérifie si l'API a bien répondu avec la clé 'response'
        if (!response.data || !response.data.response) {
            return reply("❌ No valid response from the GPT API. Please try again later.");
        }

        // Retourne la réponse de l'API
        const gptResponse = response.data.response;

        // Image AI à envoyer
        const ALIVE_IMG = 'https://i.imgur.com/R4ebueM.jpeg'; // Remplacez par l'URL de votre image AI

        // Légende avec des informations formatées
        const formattedInfo = `🤖 *ChatGPT Response:*\n\n${gptResponse}`;

        // Envoyer le message avec image et légende
        await conn.sendMessage(from, {
            image: { url: ALIVE_IMG }, // Assurez-vous que l'URL est valide
            caption: formattedInfo,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363321386877609@newsletter',
                    newsletterName: '𝐊𝐄𝐑𝐌 𝐌𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in GPT command:", error);

        // Affichage du message d'erreur dans la console pour plus de détails
        console.log("Error Details:", error.response ? error.response.data : error.message);

        // Répondre avec des détails de l'erreur
        const errorMessage = `
❌ An error occurred while processing the GPT command.
🛠 *Error Details*:
${error.message}

Please report this issue or try again later.
        `.trim();
        return reply(errorMessage);
    }
});