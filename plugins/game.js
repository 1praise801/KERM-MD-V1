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


const { cmd } = require("../command");


cmd({
  pattern: "wgc",
  react: "🎮",
  alias: ["game"],
  desc: "Start a game with participants",
  category: "games",
  filename: __filename
}, async (conn, mek, m, { from, sender, isGroup, reply }) => {
  let participants = [];
  let gameStarted = false;
  let currentQuestionIndex = 0;
  let playerScores = {};

  // Vérification si le bot est dans un groupe
  if (!isGroup) {
    return reply("🎮 Le jeu commence bientôt ! 🚀 Pour participer, écris 'ready' dans le chat pour rejoindre la partie ! 📢 Ensuite, tapez 'start' pour démarrer le jeu. Que le meilleur gagne ! 🎉");
  }

  // Lorsque l'utilisateur tape "ready" pour rejoindre le jeu
  cmd({
    pattern: "ready",
    react: "👍",
    desc: "Rejoindre le jeu",
    category: "games",
    filename: __filename
  }, async (conn, mek, m, { from, sender, pushname }) => {
    if (gameStarted) return reply("❌ Le jeu a déjà commencé !");
    
    if (participants.includes(sender)) {
      return reply(`❌ ${pushname}, tu as déjà rejoint le jeu !`);
    }

    participants.push(sender);
    reply(`${pushname} a rejoint le jeu ! 🎉`);
  });

  // Démarrage du jeu lorsque l'utilisateur tape "start"
  cmd({
    pattern: "start",
    react: "🚀",
    desc: "Démarrer le jeu",
    category: "games",
    filename: __filename
  }, async (conn, mek, m, { from, sender, pushname }) => {
    if (gameStarted) return reply("❌ Le jeu a déjà commencé !");
    
    if (participants.length < 2) {
      return reply("❌ Il faut au moins 2 participants pour démarrer le jeu.");
    }

    gameStarted = true;
    await reply("🚀 Le jeu commence maintenant ! 🎉");

    // Liste des questions
    const questions = [
      { question: "Quel est le plus grand pays du monde ?", answer: "Russie" },
      { question: "Quelle est la capitale de la France ?", answer: "Paris" },
      { question: "Combien de continents y a-t-il sur Terre ?", answer: "7" },
      { question: "Quel est l'animal qui miaule ?", answer: "Chat" },
      { question: "Dans quelle ville se trouve la Tour Eiffel ?", answer: "Paris" },
      { question: "Quel est l'animal national de l'Australie ?", answer: "Kangourou" },
      { question: "Quel est le fruit jaune et courbé ?", answer: "Banane" },
      { question: "Quel est l'animal qui aboie ?", answer: "Chien" },
      { question: "Combien de couleurs y a-t-il dans un arc-en-ciel ?", answer: "7" },
      { question: "Qui a peint la Joconde ?", answer: "Léonard de Vinci" },
      { question: "Quelle couleur fait le ciel par temps clair ?", answer: "Bleu" },
      { question: "Combien de jours y a-t-il dans une semaine ?", answer: "7" }
      // Ajoute d'autres questions selon besoin
    ];

    // Fonction pour poser des questions aux participants
    async function askQuestion(player, pushname) {
      if (currentQuestionIndex >= questions.length) {
        return;
      }
      
      const question = questions[currentQuestionIndex];
      currentQuestionIndex++;

      await conn.sendMessage(from, `${pushname}, voici ta question : ${question.question}`);

      // Attendre la réponse du joueur
      conn.on("message", async (response) => {
        if (response.from === player) {
          if (response.body.toLowerCase() === question.answer.toLowerCase()) {
            playerScores[player] = (playerScores[player] || 0) + 1;
            await conn.sendMessage(from, `${pushname} a répondu correctement ! 🎉`);
          } else {
            setTimeout(() => {
              conn.sendMessage(from, `${pushname} a répondu incorrectement. La bonne réponse était : ${question.answer}`);
            }, 4000); // Attente de 4 secondes avant d'afficher la mauvaise réponse
          }
        }
      });
    }

    // Demander des questions à chaque participant
    for (let i = 0; i < participants.length; i++) {
      const player = participants[i];
      const playerName = await conn.getName(player);
      await askQuestion(player, playerName);
    }

    // Affichage des scores finaux après toutes les questions
    setTimeout(() => {
      let scoreBoard = "📊 Scores finaux : \n";
      participants.forEach(player => {
        const playerName = conn.getName(player);
        scoreBoard += `${playerName}: ${playerScores[player] || 0} points\n`;
      });
      reply(scoreBoard);
    }, 10000); // Attendre 10 secondes avant d'afficher les scores
  });
});