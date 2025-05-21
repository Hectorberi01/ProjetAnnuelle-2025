declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      provider: 'google' | 'azure';
    }

    interface Request {
      user?: User;
    }
  }
}