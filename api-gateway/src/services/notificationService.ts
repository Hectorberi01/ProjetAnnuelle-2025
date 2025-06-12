import Mailjet from 'node-mailjet';



const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC!,
  process.env.MJ_APIKEY_PRIVATE!
);


export const sendResetEmail = async (to: string, token: string) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAIL_FROM!,
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
  } catch (err) {
    console.error("❌ Erreur lors de l’envoi de l’email :", err);
    return false;
  }
};

export const sendAccountCredentialsEmail = async (to: string, password: string) => {
  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAIL_FROM!,
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
  } catch (err) {
    console.error("❌ Erreur lors de l’envoi de l’email de création :", err);
    return false;
  }
};

export const sendPromotionEnrollmentEmail = async (to: string, promotionName: string) => {
  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAIL_FROM!,
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
  } catch (err) {
    console.error("❌ Erreur lors de l’envoi du mail de promotion :", err);
    return false;
  }
};

