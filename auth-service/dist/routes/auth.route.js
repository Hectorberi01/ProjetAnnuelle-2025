"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
require("../config/passport");
const auth_service_1 = require("../services/auth.service");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.register);
// Register admin
router.post('/register-admin', auth_controller_1.registerAdmin);
router.post('/login', auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
router.post('/forgot-password', auth_controller_1.forgotPassword);
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.me);
router.post('/change-password', auth_middleware_1.authMiddleware, auth_controller_1.changePassword);
// Google
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    //console.log('req.user', req.user);
    const user = req.user;
    if (user && user._json) {
        const email = user._json.email;
        (0, auth_service_1.loginWithGoogleOrAzure)(email)
            .then((response) => {
            if (response.status === 200) {
                const { token, user } = response.data;
                res.cookie("token", token, {
                    httpOnly: false, // Rendre visible pour JS (en dev)
                    secure: false, // true si HTTPS
                    sameSite: 'lax', // ou 'none' si cross-domain
                    path: '/',
                    maxAge: 3600000,
                });
                res.cookie("user", JSON.stringify(user), {
                    httpOnly: false,
                    secure: false,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 3600000,
                });
                // Redirigez vers votre application front-end
                res.redirect(`http://localhost:4000/oauth-callback`);
            }
            else {
                console.log('Error logging in with Google:', response.data.error);
                res.redirect('http://localhost:4000/dashboard'); // Redirigez vers votre application front-end
            }
        })
            .catch((error) => {
            console.error('Error logging in with Google:', error);
            res.redirect('http://localhost:4000'); // Redirigez vers votre application front-end
        });
    }
    else {
        console.log('user is undefined or does not have _json property');
    }
});
// Azure
router.get('/azure', passport_1.default.authenticate('azuread-openidconnect', { failureRedirect: '/' }));
router.get('/azure/callback', passport_1.default.authenticate('azuread-openidconnect', { failureRedirect: '/' }), (req, res) => {
    res.redirect('http://localhost:4000'); // Redirigez vers votre application front-end
});
// Déconnexion
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});
exports.default = router;
