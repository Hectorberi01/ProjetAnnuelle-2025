"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPromotionEnrollmentEmail = exports.sendAccountCredentialsEmail = exports.sendResetEmail = void 0;
const node_mailjet_1 = __importDefault(require("node-mailjet"));
const mailjet = node_mailjet_1.default.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
const sendResetEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    try {
        const result = yield mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAIL_FROM,
                        Name: "Support ESGI"
                    },
                    To: [
                        {
                            Email: to,
                        }
                    ],
                    Subject: "Réinitialisation de votre mot de passe",
                    HTMLPart: `
            <h3>Bonjour,</h3>
            <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
            <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Ce lien expirera dans 15 minutes.</p>
          `
                }
            ]
        });
        console.log("📧 Email envoyé :", result.body);
        return true;
    }
    catch (err) {
        console.error("❌ Erreur lors de l’envoi de l’email :", err);
        return false;
    }
});
exports.sendResetEmail = sendResetEmail;
const sendAccountCredentialsEmail = (to, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAIL_FROM,
                        Name: "Support Calmeo"
                    },
                    To: [
                        {
                            Email: to,
                        }
                    ],
                    Subject: "Création de votre compte ESGI",
                    HTMLPart: `
            <h3>Bienvenue sur ESGI 🎓</h3>
            <p>Votre compte a été créé avec succès. Voici vos identifiants :</p>
            <ul>
              <li><strong>Email :</strong> ${to}</li>
              <li><strong>Mot de passe :</strong> ${password}</li>
            </ul>
            <p>Nous vous recommandons de modifier votre mot de passe dès votre première connexion.</p>
            <p>🔐 <a href="http://localhost:3000/login">Connexion à ESGI</a></p>
          `
                }
            ]
        });
        console.log("📧 Email de création de compte envoyé :", result.body);
        return true;
    }
    catch (err) {
        console.error("❌ Erreur lors de l’envoi de l’email de création :", err);
        return false;
    }
});
exports.sendAccountCredentialsEmail = sendAccountCredentialsEmail;
const sendPromotionEnrollmentEmail = (to, promotionName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAIL_FROM,
                        Name: "Support ESGI"
                    },
                    To: [
                        {
                            Email: to,
                        }
                    ],
                    Subject: "Ajout à une promotion",
                    HTMLPart: `
            <h3>Bonjour,</h3>
            <p>Vous avez été ajouté à la promotion <strong>${promotionName}</strong> sur la plateforme ESGI.</p>
            <p>Vous pourrez bientôt accéder aux projets associés à cette promotion et participer aux différentes activités : création de groupes, dépôt de livrables, rédaction de rapports, etc.</p>
            <p>👉 <a href="http://localhost:3000/login">Se connecter à ESGI</a></p>
            <p>En cas de problème, contactez l'équipe pédagogique.</p>
          `
                }
            ]
        });
        console.log("📧 Email d’ajout à la promotion envoyé :", result.body);
        return true;
    }
    catch (err) {
        console.error("❌ Erreur lors de l’envoi du mail de promotion :", err);
        return false;
    }
});
exports.sendPromotionEnrollmentEmail = sendPromotionEnrollmentEmail;
