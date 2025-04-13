import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { RegisterDTO } from '../models/auth.model';
import { registerSchema } from '../validations/auth.validation';
dotenv.config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL!;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;


if (!USER_SERVICE_URL) {
    console.error("❌ ERREUR: USER_SERVICE_URL n'est pas défini !");
    process.exit(1);
}

export const register = async (data: RegisterDTO) => {

  const requiredFields = ['firstName', 'lastName', 'username', 'email', 'password'];
  for (const field of requiredFields) {
    const value = (data as any)[field];
    if (!value || value.trim() === "") {
      return { status: 400, data: { error: `Le champ '${field}' est requis.` } };
    }
  }

  const { error } = registerSchema.validate(data);
  if (error) {
    return {
      status: 400,
      data: { error: error.details[0].message },
    };
  }

  try {
        const response = await axios.post(`${USER_SERVICE_URL}/create`,data);
      console.log("response", response);
      return { status: 201, data: response.data };
  } catch (error: any) {
        return { status: 400, data: { error: error.message } };
  }
};

export const login = async ({ email, password }: { email: string; password: string }) => {
    try {
        const response = await fetch(`${USER_SERVICE_URL}/find-by-email?email=${email}`);
        const data = await response.json();
        const user = data;
        if (!user) {
          return { status: 401, data: { error: 'Email ou mot de passe invalide' } };
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return { status: 401, data: { error: 'Mot de passe incorrect' } };
        }
  
      const token = jwt.sign({ id: user.userId, email: user.email }, JWT_SECRET, {expiresIn: '1h',});
  
      return { status: 200, data: { token, user } };
    } catch (err: any) {
      return { status: 401, data: { error: 'Email ou mot de passe invalide' } };
    }
};

export const forgotPassword = async (email: string) => {
  console.log("email", email);
  if (!email) {
    return { status: 400, data: { error: 'Email requis' } };
  }

  try {
    // 1. Vérifie que l'utilisateur existe
    const response = await fetch(`${USER_SERVICE_URL}/find-by-email?email=${email}`);
    console.log("response", response);
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
    console.log(`Lien de réinitialisation : http://localhost:3000/reset-password?token=${resetToken}`);

    return {
      status: 200,
      data: {
        message: 'Email de réinitialisation envoyé',
        token: resetToken // pour test uniquement
      }
    };
  } catch (error: any) {
    return {
      status: 404,
      data: { error: 'Utilisateur introuvable' }
    };
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  if (!token || !newPassword) {
    return { status: 400, data: { error: 'Token et mot de passe requis' } };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.id;

    // Appel vers le service utilisateur pour mettre à jour le mot de passe
    const response = await axios.put(`${USER_SERVICE_URL}/reset-password`, {
      userId,
      newPassword
    });

    return {
      status: 200,
      data: { message: 'Mot de passe réinitialisé avec succès' }
    };
  } catch (err: any) {
    return { status: 403, data: { error: 'Token invalide ou expiré' } };
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


export const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    return { status: 400, data: { error: 'Refresh token manquant' } };
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;

    // On peut ici vérifier l'utilisateur dans la base si tu veux plus tard
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { status: 200, data: { token: newAccessToken } };
  } catch (err: any) {
    return { status: 403, data: { error: 'Refresh token invalide ou expiré' } };
  }
};

export const verifyEmail = async (token: string) => {
  if (!token) {
    return { status: 400, data: { error: 'Token manquant' } };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.id;

    // Appel au service utilisateur pour activer l'email
    const response = await axios.put(`${USER_SERVICE_URL}/verify-email`, {
      userId
    });

    return {
      status: 200,
      data: { message: 'Email vérifié avec succès' }
    };
  } catch (err) {
    return { status: 403, data: { error: 'Token invalide ou expiré' } };
  }
};

export const changePassword = async (userId: number, oldPassword: string, newPassword: string) => {
  if (!oldPassword || !newPassword) {
    return { status: 400, data: { error: 'Champs requis' } };
  }

  try {
    // 1. Récupère l’utilisateur
    const response = await axios.get(`${USER_SERVICE_URL}/${userId}`);
    const user = response.data;

    // 2. Vérifie le mot de passe actuel
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return { status: 403, data: { error: 'Ancien mot de passe incorrect' } };
    }

    // 3. Mise à jour via le service utilisateur
    await axios.put(`${USER_SERVICE_URL}/change-password`, {
      userId,
      newPassword
    });

    return { status: 200, data: { message: 'Mot de passe changé avec succès' } };
  } catch (err: any) {
    return { status: 400, data: { error: err.message || 'Erreur interne' } };
  }
};

export const checkToken = (token: string) => {
  if (!token) {
    return { status: 400, data: { error: 'Token requis' } };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      status: 200,
      data: {
        valid: true,
        decoded,
      },
    };
  } catch (err) {
    return {
      status: 403,
      data: {
        valid: false,
        error: 'Token invalide ou expiré',
      },
    };
  }
};