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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetEmail = exports.changePassword = exports.verifyRoleMiddleware = exports.verifyTokenMiddleware = exports.verifyToken = exports.logout = exports.forgotPassword = exports.loginWithGoogleOrAzure = exports.login = exports.createAdminUser = exports.register = void 0;
const axios_1 = __importDefault(require("axios"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_validation_1 = require("../validations/auth.validation");
const node_mailjet_1 = __importDefault(require("node-mailjet"));
const buffer_1 = require("buffer");
dotenv_1.default.config();
console.log("AUTH_PORT", process.env.AUTH_PORT);
console.log("AUTH_IS_DOCKER", process.env.AUTH_IS_DOCKER);
const isDocker = process.env.AUTH_IS_DOCKER === 'true';
console.log("isDocker", isDocker);
console.log("USER_SERVICE_URL", process.env.USER_SERVICE_URL);
const USER_SERVICE_URL = (_a = process.env.USER_SERVICE_URL) !== null && _a !== void 0 ? _a : (isDocker
    ? "http://users:3003/users"
    : "http://localhost:3003/users");
console.log("Final USER_SERVICE_URL =", USER_SERVICE_URL);
const JWT_SECRET = process.env.JWT_SECRET;
if (!USER_SERVICE_URL) {
    console.error("❌ ERREUR: USER_SERVICE_URL n'est pas défini !");
}
const mailjet = node_mailjet_1.default.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
const register = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredTextFields = ['nom', 'prenom', 'email'];
    for (const field of requiredTextFields) {
        const value = data[field];
        if (!value || value.trim() === "")
            return { status: 400, data: { error: `Le champ '${field}' est requis.` } };
    }
    if (typeof data.roleId !== "number")
        return { status: 400, data: { error: "Le champ 'roleId' est requis et doit être un nombre." } };
    const { error } = auth_validation_1.registerSchema.validate(data);
    if (error) {
        return {
            status: 400,
            data: { error: error.details[0].message },
        };
    }
    console.log("USER_SERVICE_URL", USER_SERVICE_URL);
    try {
        const response = yield axios_1.default.post(`${USER_SERVICE_URL}`, data);
        return { status: 201, data: response.data };
    }
    catch (error) {
        return { status: 400, data: { error: error.message } };
    }
});
exports.register = register;
// create admin user
const createAdminUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const adminData = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.password,
    };
    try {
        const result = yield axios_1.default.post(`${USER_SERVICE_URL}/admin`, adminData);
        if (result.status !== 201) {
            throw new Error(`Erreur lors de la création de l'utilisateur admin: ${result.statusText}`);
        }
        // Supprimer le champ password avant de retourner l'utilisateur
        delete result.data.password;
        // Génération du token JWT
        const token = jsonwebtoken_1.default.sign({ user: result.data }, JWT_SECRET, { expiresIn: '1h' });
        // Retourner l'utilisateur créé avec le token
        return { status: 201, data: { user: result.data, token } };
    }
    catch (error) {
        console.error("Error creating admin user:", error);
        return { status: 500, data: { error: 'Internal server error' } };
    }
});
exports.createAdminUser = createAdminUser;
const login = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    try {
        if (!email || !password) {
            return { data: { error: 'Email et mot de passe requis' } };
        }
        // Vérifier si l'email est valide
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { data: { error: 'Email invalide' } };
        }
        // Récupérer l'utilisateur par email
        const response = yield fetch(`${USER_SERVICE_URL}/email/${email}`);
        if (response.status !== 200) {
            console.log("response.status", response.status);
            return { data: { error: 'Email ou mot de passe invalide' } };
        }
        console.log("response", response);
        const data = yield response.json();
        console.log("data", data);
        const user = data;
        // if (!user) {
        //   return { status: 401, data: { error: 'Email ou mot de passe invalide' } };
        // }
        console.log("user", user);
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        console.log("isValid", isValid);
        if (isValid === false) {
            return null;
        }
        // Supprimer le champ password
        delete user.password;
        const token = jsonwebtoken_1.default.sign({ user: user }, JWT_SECRET, { expiresIn: '1h', });
        return { data: { token, user } };
    }
    catch (err) {
        return { data: { error: 'Email ou mot de passe invalide' } };
    }
});
exports.login = login;
const loginWithGoogleOrAzure = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${USER_SERVICE_URL}/email/${email}`);
        console.log("url", `${USER_SERVICE_URL}/email/${email}`);
        const data = yield response.json();
        const user = data;
        if (!user) {
            return { status: 401, data: { error: 'Email ou mot de passe invalide' } };
        }
        // Supprimer le champ password
        delete user.password;
        const encodedId = buffer_1.Buffer.from(user.id.toString()).toString('base64');
        user.id = encodedId;
        const token = jsonwebtoken_1.default.sign({ user: user }, JWT_SECRET, { expiresIn: '1h', });
        return { status: 200, data: { token, user } };
    }
    catch (err) {
        return { status: 401, data: { error: 'Email ou mot de passe invalide' } };
    }
});
exports.loginWithGoogleOrAzure = loginWithGoogleOrAzure;
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email) {
        return { status: 400, data: { error: 'Email requis' } };
    }
    try {
        // 1. Vérifie que l'utilisateur existe
        const response = yield fetch(`${USER_SERVICE_URL}/email/${email}`);
        const user = yield response.json();
        if (!user) {
            return { status: 404, data: { error: 'Entrer un mail correct' } };
        }
        // 2. Génère un token temporaire (JWT)
        const resetToken = jsonwebtoken_1.default.sign({ id: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
        // 3. [À faire] Envoie par email (non implémenté ici)
        const emailSent = yield (0, exports.sendResetEmail)(user.email, resetToken);
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
    }
    catch (error) {
        return {
            status: 404,
            data: { error: 'Utilisateur introuvable' }
        };
    }
});
exports.forgotPassword = forgotPassword;
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
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
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
const changePassword = (userId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (!oldPassword || !newPassword) {
        return { status: 400, data: { error: 'Champs requis' } };
    }
    const decodedId = parseInt(buffer_1.Buffer.from(userId, 'base64').toString());
    console.log("decodedId", decodedId);
    try {
        // 1. Récupère l’utilisateur
        const response = yield axios_1.default.get(`${USER_SERVICE_URL}/${decodedId}`);
        const user = response.data;
        console.log("user", user);
        // 2. Vérifie le mot de passe actuel
        const isValid = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!isValid) {
            return { status: 403, data: { error: 'Ancien mot de passe incorrect' } };
        }
        console.log("avatar");
        // 3. Mise à jour via le service utilisateur
        console.log(`${USER_SERVICE_URL}/${userId}`);
        try {
            const res = yield axios_1.default.put(`${USER_SERVICE_URL}/${decodedId}`, {
                password: newPassword
            });
            console.log("✅ Mot de passe mis à jour :", res.data);
        }
        catch (err) {
            console.error("❌ Erreur lors de la mise à jour :", err.message);
        }
        return { status: 200, data: { message: 'Mot de passe changé avec succès' } };
    }
    catch (err) {
        return { status: 400, data: { error: err.message || 'Erreur interne' } };
    }
});
exports.changePassword = changePassword;
// Envoi d'un email de réinitialisation de mot de passe
const sendResetEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
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
