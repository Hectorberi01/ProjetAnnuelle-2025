import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});