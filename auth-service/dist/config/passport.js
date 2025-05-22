"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_azure_ad_1 = require("passport-azure-ad");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((obj, done) => {
    done(null, obj);
});
// Google Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));
// Azure Strategy
passport_1.default.use(new passport_azure_ad_1.OIDCStrategy({
    identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    redirectUrl: 'https://localhost:3001/auth/azure/callback',
    responseType: 'code',
    responseMode: 'query',
    scope: ['profile', 'email'],
    passReqToCallback: false,
}, (iss, sub, profile, accessToken, refreshToken, done) => {
    return done(null, profile);
}));
