
import { Router } from 'express';
import {register,login,logout,forgotPassword,me, changePassword,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import passport from 'passport';
import '../config/passport'
import { loginWithGoogleOrAzure } from '../services/auth.service';
const router = Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);

router.get('/me', authMiddleware, me);

router.post('/change-password', authMiddleware, changePassword);

// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    //console.log('req.user', req.user);
    const user = req.user;
    if (user && (user as any)._json) {
      const email = (user as any)._json.email;
      loginWithGoogleOrAzure(email)
        .then((response) => {
          if (response.status === 200) {

            const { token, user } = response.data;
            res.cookie("token", token, {
                httpOnly: true,
                secure: false, // ⚠️ mettre true en production (HTTPS)
                maxAge: 3600000, // 1h
            });

            res.cookie("user", JSON.stringify(user), {
                httpOnly: false, // peut être lu en JS si besoin
                maxAge: 3600000,
            });

            // Redirigez vers votre application front-end
            res.redirect(`http://localhost:4000/oauth-callback`);
            
          }
          else {
            console.log('Error logging in with Google:', response.data.error);
            res.redirect('http://localhost:4000'); // Redirigez vers votre application front-end
          }
        })
        .catch((error) => {
          console.error('Error logging in with Google:', error);
          res.redirect('http://localhost:4000'); // Redirigez vers votre application front-end
        });
    } else {
      console.log('user is undefined or does not have _json property');
    }
  }
);

// Azure
router.get('/azure', passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }));

router.get('/azure/callback',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:4000'); // Redirigez vers votre application front-end
  }
);

// Déconnexion
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;