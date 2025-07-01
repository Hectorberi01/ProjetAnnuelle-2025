import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { OIDCStrategy as AzureStrategy } from 'passport-azure-ad';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: 'http://localhost:3001/auth/google/callback',

}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// Azure Strategy
passport.use(new AzureStrategy({
  identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
  clientID: process.env.AZURE_CLIENT_ID!,
  clientSecret: process.env.AZURE_CLIENT_SECRET!,
  redirectUrl: 'https://localhost:3001/auth/azure/callback',
  responseType: 'code',
  responseMode: 'query',
  scope: ['profile', 'email'],
  passReqToCallback: false,
}, (
  iss: string,sub: string,profile: any,accessToken: string,refreshToken: string,
  done: (error: any, user?: any) => void
) => {
  return done(null, profile);
}));