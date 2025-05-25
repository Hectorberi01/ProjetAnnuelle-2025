import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { RegisterDTO } from '../models/auth.model';
import { registerSchema } from '../validations/auth.validation';
import Mailjet from 'node-mailjet';

import { Buffer } from 'buffer';

dotenv.config();

//let USER_SERVICE_URL: string;

const isDocker = process.env.IS_DOCKER === 'true';


console.log("isDocker", isDocker);
console.log("USER_SERVICE_URL", process.env.USER_SERVICE_URL);

const USER_SERVICE_URL: string =
  process.env.USER_SERVICE_URL !== undefined
    ? process.env.USER_SERVICE_URL
    : isDocker
      ? "http://users:3003/api/users"
      : "http://localhost:3003/api/users";


console.log("Final USER_SERVICE_URL =", USER_SERVICE_URL);

const JWT_SECRET = process.env.JWT_SECRET!;

if (!USER_SERVICE_URL) {
  console.error("❌ ERREUR: USER_SERVICE_URL n'est pas défini !");
}

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC!,
  process.env.MJ_APIKEY_PRIVATE!
);

interface createAdminUserDTO {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}


export const register = async (data: RegisterDTO) => {

  const requiredTextFields = ['nom', 'prenom', 'email'];
  for (const field of requiredTextFields) {
    const value = (data as any)[field];
    if (!value || value.trim() === "") {
      return { status: 400, data: { error: `Le champ '${field}' est requis.` } };
    }
  }

  if (typeof data.roleId !== "number") {
    return { status: 400, data: { error: "Le champ 'roleId' est requis et doit être un nombre." } };
  }

  const { error } = registerSchema.validate(data);
  if (error) {
    return {
      status: 400,
      data: { error: error.details[0].message },
    };
  }

  try {
    const response = await axios.post(`${USER_SERVICE_URL}`,data);
    console.log("response", response);
    return { status: 201, data: response.data };
  } catch (error: any) {
    return { status: 400, data: { error: error.message } };
  }
};

// create admin user
export const createAdminUser = async (data: createAdminUserDTO) => {
  const adminData: createAdminUserDTO = {
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    password: data.password,
  };

  try {
    const result = await axios.post(`${USER_SERVICE_URL}/admin`, adminData);
    if (result.status !== 201) {
      throw new Error(`Erreur lors de la création de l'utilisateur admin: ${result.statusText}`);
    }
    // Supprimer le champ password avant de retourner l'utilisateur
    delete result.data.password;
   
    // Génération du token JWT
    const token = jwt.sign({ user: result.data }, JWT_SECRET, { expiresIn: '1h' });
    
    // Retourner l'utilisateur créé avec le token
    return { status: 201, data: { user: result.data, token } };

  } catch (error) {
    console.error("Error creating admin user:", error);
    return { status: 500, data: { error: 'Internal server error' } };
  }
};

export const login = async ({ email, password }: { email: string; password: string }) => {
    console.log("USER_SERVICE_URL", USER_SERVICE_URL);
    console.log("email", email);
    console.log("password", password);
    try {
        if (!email || !password) {
            return { status: 400, data: { error: 'Email et mot de passe requis' } };
        }
        // Vérifier si l'email est valide
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return { status: 400, data: { error: 'Email invalide' } };
        }

        // Récupérer l'utilisateur par email
        console.log("USER_SERVICE_URL", `${USER_SERVICE_URL}/email/${email}`);

        const response = await fetch(`${USER_SERVICE_URL}/email/${email}`);
        const data = await response.json();

        // console.log("data", data);
        const user = data;
        if (!user) {
          return { status: 401, data: { error: 'Email ou mot de passe invalide' } };
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return { status: 401, data: { error: 'Mot de passe incorrect' } };
        }
        // Supprimer le champ password
      delete user.password;
      //const encodedId = Buffer.from(user.id.toString()).toString('base64');
      //user.id = encodedId;
      const token = jwt.sign({ user: user }, JWT_SECRET, {expiresIn: '1h',});
  
      return { status: 200, data: { token, user } };
    } catch (err: any) {
      return { status: 401, data: { error: 'Email ou mot de passe invalide' } };
    }
};

export const loginWithGoogleOrAzure = async (email: string) => {
    try {
        const response = await fetch(`${USER_SERVICE_URL}/email/${email}`);
        console.log("url", `${USER_SERVICE_URL}/email/${email}`);
        const data = await response.json();
        const user = data;
        if (!user) {
          return { status: 401, data: { error: 'Email ou mot de passe invalide' } };
        }

        // Supprimer le champ password
      delete user.password;
      const encodedId = Buffer.from(user.id.toString()).toString('base64');
      user.id = encodedId;
      const token = jwt.sign({ user: user }, JWT_SECRET, {expiresIn: '1h',});
  
      return { status: 200, data: { token, user } };
    } catch (err: any) {
      return { status: 401, data: { error: 'Email ou mot de passe invalide' } };
    }
};

export const forgotPassword = async (email: string) => {
  if (!email) {
    return { status: 400, data: { error: 'Email requis' } };
  }

  try {
    // 1. Vérifie que l'utilisateur existe
    const response = await fetch(`${USER_SERVICE_URL}/email/${email}`);
    const user = await response.json();
    if (!user) {
      return { status: 404, data: { error: 'Entrer un mail correct' } };
    }

    // 2. Génère un token temporaire (JWT)
    const resetToken = jwt.sign(
      { id: user.userId, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // 3. [À faire] Envoie par email (non implémenté ici)
    const emailSent = await sendResetEmail(user.email, resetToken);

    if (!emailSent) {
      return { status: 500, data: { error: "Erreur lors de l'envoi de l'email" } };
    }

    return {
      status: 200,
      data: {
        message: 'Email de réinitialisation envoyé',
        token: resetToken 
      }
    };
  } catch (error: any) {
    return {
      status: 404,
      data: { error: 'Utilisateur introuvable' }
    };
  }
};


export const logout = async () => {
  // Stateless, rien à faire côté serveur
  return { status: 200, data: { message: 'Logged out successfully' } };
};

export const verifyToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { status: 200, data: { user: decoded } };
  } catch (err: any) {
    return { status: 401, data: { error: 'Token invalide' } };
  }
}

export const verifyTokenMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json
    ({ error: 'Authentification requise' });
  }
  const result = await verifyToken(token);
  if (result.status === 200) {
    req.user = result.data.user;
    next();
  }
  else {
    return res.status(result.status).json(result.data);
  }
}

export const verifyRoleMiddleware = (role: string) => {
  return (req: any, res: any, next: any) => {
    if (req.user.role === role) {
      next();
    } else {
      return res.status(403).json({ error: 'Autorisation refusée' });
    }
  }
}

export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  if (!oldPassword || !newPassword) {
    return { status: 400, data: { error: 'Champs requis' } };
  }
  const decodedId = parseInt(Buffer.from(userId, 'base64').toString());
  console.log("decodedId", decodedId);
  try {
    // 1. Récupère l’utilisateur
    const response = await axios.get(`${USER_SERVICE_URL}/${decodedId}`);
    const user = response.data;
    console.log("user", user);
    // 2. Vérifie le mot de passe actuel
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return { status: 403, data: { error: 'Ancien mot de passe incorrect' } };
    }

    console.log("avatar");
    // 3. Mise à jour via le service utilisateur
    console.log(`${USER_SERVICE_URL}/${userId}`);
    try {
      const res = await axios.put(`${USER_SERVICE_URL}/${decodedId}`, {
        password: newPassword
      });
      console.log("✅ Mot de passe mis à jour :", res.data);
    } catch (err: any) {
      console.error("❌ Erreur lors de la mise à jour :", err.message);
    }

    return { status: 200, data: { message: 'Mot de passe changé avec succès' } };
  } catch (err: any) {
    return { status: 400, data: { error: err.message || 'Erreur interne' } };
  }
};


// Envoi d'un email de réinitialisation de mot de passe
export const sendResetEmail = async (to: string, token: string) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

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