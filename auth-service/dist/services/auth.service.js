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
exports.checkToken = exports.changePassword = exports.verifyEmail = exports.refreshToken = exports.verifyRoleMiddleware = exports.verifyTokenMiddleware = exports.verifyToken = exports.logout = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const axios_1 = __importDefault(require("axios"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_validation_1 = require("../validations/auth.validation");
dotenv_1.default.config();
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
if (!USER_SERVICE_URL) {
    console.error("❌ ERREUR: USER_SERVICE_URL n'est pas défini !");
    process.exit(1);
}
const register = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredFields = ['firstName', 'lastName', 'username', 'email', 'password'];
    for (const field of requiredFields) {
        const value = data[field];
        if (!value || value.trim() === "") {
            return { status: 400, data: { error: `Le champ '${field}' est requis.` } };
        }
    }
    const { error } = auth_validation_1.registerSchema.validate(data);
    if (error) {
        return {
            status: 400,
            data: { error: error.details[0].message },
        };
    }
    try {
        const response = yield axios_1.default.post(`${USER_SERVICE_URL}/create`, data);
        console.log("response", response);
        return { status: 201, data: response.data };
    }
    catch (error) {
        return { status: 400, data: { error: error.message } };
    }
});
exports.register = register;
const login = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    try {
        const response = yield fetch(`${USER_SERVICE_URL}/email?email=${email}`);
        console.log("response", response);
        const data = yield response.json();
        const user = data;
        if (!user) {
            return { status: 401, data: { error: 'Email ou mot de passe invalide' } };
        }
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return { status: 401, data: { error: 'Mot de passe incorrect' } };
        }
        const token = jsonwebtoken_1.default.sign({ id: user.userId, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h', });
        return { status: 200, data: { token, user } };
    }
    catch (err) {
        return { status: 401, data: { error: 'Email ou mot de passe invalide' } };
    }
});
exports.login = login;
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("email", email);
    if (!email) {
        return { status: 400, data: { error: 'Email requis' } };
    }
    try {
        // 1. Vérifie que l'utilisateur existe
        const response = yield fetch(`${USER_SERVICE_URL}/find-by-email?email=${email}`);
        console.log("response", response);
        const user = yield response.json();
        if (!user) {
            return { status: 404, data: { error: 'Entrer un mail correct' } };
        }
        // 2. Génère un token temporaire (JWT)
        const resetToken = jsonwebtoken_1.default.sign({ id: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
        // 3. [À faire] Envoie par email (non implémenté ici)
        console.log(`Lien de réinitialisation : http://localhost:3000/reset-password?token=${resetToken}`);
        return {
            status: 200,
            data: {
                message: 'Email de réinitialisation envoyé',
                token: resetToken // pour test uniquement
            }
        };
    }
    catch (error) {
        return {
            status: 404,
            data: { error: 'Utilisateur introuvable' }
        };
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token || !newPassword) {
        return { status: 400, data: { error: 'Token et mot de passe requis' } };
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = decoded.id;
        // Appel vers le service utilisateur pour mettre à jour le mot de passe
        const response = yield axios_1.default.put(`${USER_SERVICE_URL}/reset-password`, {
            userId,
            newPassword
        });
        return {
            status: 200,
            data: { message: 'Mot de passe réinitialisé avec succès' }
        };
    }
    catch (err) {
        return { status: 403, data: { error: 'Token invalide ou expiré' } };
    }
});
exports.resetPassword = resetPassword;
const logout = () => __awaiter(void 0, void 0, void 0, function* () {
    // Stateless, rien à faire côté serveur
    return { status: 200, data: { message: 'Logged out successfully' } };
});
exports.logout = logout;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return { status: 200, data: { user: decoded } };
    }
    catch (err) {
        return { status: 401, data: { error: 'Token invalide' } };
    }
});
exports.verifyToken = verifyToken;
const verifyTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authentification requise' });
    }
    const result = yield (0, exports.verifyToken)(token);
    if (result.status === 200) {
        req.user = result.data.user;
        next();
    }
    else {
        return res.status(result.status).json(result.data);
    }
});
exports.verifyTokenMiddleware = verifyTokenMiddleware;
const verifyRoleMiddleware = (role) => {
    return (req, res, next) => {
        if (req.user.role === role) {
            next();
        }
        else {
            return res.status(403).json({ error: 'Autorisation refusée' });
        }
    };
};
exports.verifyRoleMiddleware = verifyRoleMiddleware;
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken) {
        return { status: 400, data: { error: 'Refresh token manquant' } };
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
        // On peut ici vérifier l'utilisateur dans la base si tu veux plus tard
        const newAccessToken = jsonwebtoken_1.default.sign({ id: decoded.id, email: decoded.email }, JWT_SECRET, { expiresIn: '1h' });
        return { status: 200, data: { token: newAccessToken } };
    }
    catch (err) {
        return { status: 403, data: { error: 'Refresh token invalide ou expiré' } };
    }
});
exports.refreshToken = refreshToken;
const verifyEmail = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        return { status: 400, data: { error: 'Token manquant' } };
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = decoded.id;
        // Appel au service utilisateur pour activer l'email
        const response = yield axios_1.default.put(`${USER_SERVICE_URL}/verify-email`, {
            userId
        });
        return {
            status: 200,
            data: { message: 'Email vérifié avec succès' }
        };
    }
    catch (err) {
        return { status: 403, data: { error: 'Token invalide ou expiré' } };
    }
});
exports.verifyEmail = verifyEmail;
const changePassword = (userId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (!oldPassword || !newPassword) {
        return { status: 400, data: { error: 'Champs requis' } };
    }
    try {
        // 1. Récupère l’utilisateur
        const response = yield axios_1.default.get(`${USER_SERVICE_URL}/${userId}`);
        const user = response.data;
        // 2. Vérifie le mot de passe actuel
        const isValid = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!isValid) {
            return { status: 403, data: { error: 'Ancien mot de passe incorrect' } };
        }
        // 3. Mise à jour via le service utilisateur
        yield axios_1.default.put(`${USER_SERVICE_URL}/change-password`, {
            userId,
            newPassword
        });
        return { status: 200, data: { message: 'Mot de passe changé avec succès' } };
    }
    catch (err) {
        return { status: 400, data: { error: err.message || 'Erreur interne' } };
    }
});
exports.changePassword = changePassword;
const checkToken = (token) => {
    if (!token) {
        return { status: 400, data: { error: 'Token requis' } };
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return {
            status: 200,
            data: {
                valid: true,
                decoded,
            },
        };
    }
    catch (err) {
        return {
            status: 403,
            data: {
                valid: false,
                error: 'Token invalide ou expiré',
            },
        };
    }
};
exports.checkToken = checkToken;
